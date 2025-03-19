import cv2
import numpy as np
import sqlite3
import os
from flask import Flask, request, jsonify
import pyttsx3
import hashlib
import logging

app = Flask(__name__)
base_path = "face_database"
# Initialize the LBPH face recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create(radius=1, neighbors=8, grid_x=8, grid_y=8)
# Load the Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
# Initialize text-to-speech engine
tts = pyttsx3.init()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the SQLite database and create the users table if it doesn't exist."""
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    face_path TEXT)''')
    conn.commit()
    return conn

def load_trained_model():
    """Load face data from the database and train the LBPH recognizer."""
    conn = init_db()
    c = conn.cursor()
    c.execute("SELECT user_id, face_path FROM users")
    faces = []
    labels = []
    for user_id, face_path in c.fetchall():
        face = cv2.imread(face_path, cv2.IMREAD_GRAYSCALE)
        if face is not None:
            faces.append(face)
            labels.append(user_id)
        else:
            logger.warning(f"Could not load face image at {face_path}")
    if faces:
        recognizer.train(faces, np.array(labels))
    else:
        logger.info("No faces to train on")
    conn.close()

def detect_face(image):
    """Detect a face in the given image using Haar Cascade."""
    faces = face_cascade.detectMultiScale(image, scaleFactor=1.2, minNeighbors=5)
    if len(faces) == 0:
        logger.debug("No faces detected in image")
        return None
    (x, y, w, h) = faces[0]
    return image[y:y+h, x:x+w]

def hash_password(password):
    """Hash the password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/register', methods=['POST'])
def register():
    """Handle user registration with email, password, and face image."""
    try:
        email = request.form.get('email')
        password = request.form.get('password')
        image_data = request.files.get('image').read()
        
        logger.debug(f"Received: email={email}, password={password}, image_size={len(image_data)} bytes")
        
        if not email or not password:
            return jsonify({"status": "error", "message": "Email or password missing"}), 400
        
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        if image is None:
            logger.error("Failed to decode image")
            return jsonify({"status": "error", "message": "Invalid image data"}), 400
        
        face = detect_face(image)
        if face is None:
            return jsonify({"status": "error", "message": "No face detected"}), 400
        
        conn = init_db()
        c = conn.cursor()
        hashed_password = hash_password(password)
        c.execute("INSERT INTO users (email, password, face_path) VALUES (?, ?, ?)", 
                  (email, hashed_password, ""))
        user_id = c.lastrowid
        face_path = os.path.join(base_path, f"{user_id}_001.jpg")
        
        logger.debug(f"Saving face to {face_path}")
        if not cv2.imwrite(face_path, face):
            raise Exception("Failed to save face image")
        
        c.execute("UPDATE users SET face_path = ? WHERE user_id = ?", (face_path, user_id))
        conn.commit()
        load_trained_model()
        tts.say("Registration successful")
        tts.runAndWait()
        return jsonify({"status": "success", "message": "Registered successfully"})
    except sqlite3.IntegrityError:
        logger.error("Email already exists")
        conn.close()
        return jsonify({"status": "error", "message": "Email already exists"}), 400
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        conn.close()
        return jsonify({"status": "error", "message": f"Registration failed: {str(e)}"}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    """Handle user login with email, password, and face recognition."""
    try:
        email = request.form.get('email')
        password = request.form.get('password')
        image_data = request.files.get('image').read()
        
        logger.debug(f"Received login request: email={email}, image_size={len(image_data)} bytes")
        
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        if image is None:
            logger.error("Failed to decode image")
            return jsonify({"status": "error", "message": "Invalid image data"}), 400
        
        conn = init_db()
        c = conn.cursor()
        hashed_password = hash_password(password)
        c.execute("SELECT user_id FROM users WHERE email = ? AND password = ?", (email, hashed_password))
        result = c.fetchone()
        if not result:
            conn.close()
            tts.say("Invalid email or password")
            tts.runAndWait()
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
        
        user_id = result[0]
        
        face = detect_face(image)
        if face is None:
            conn.close()
            tts.say("No face detected")
            tts.runAndWait()
            return jsonify({"status": "error", "message": "No face detected"}), 400
        
        label, confidence = recognizer.predict(face)
        logger.debug(f"Face recognition result: label={label}, user_id={user_id}, confidence={confidence}")
        if label == user_id and confidence < 100:
            conn.close()
            tts.say(f"Login successful. Welcome, {email}")
            tts.runAndWait()
            return jsonify({"status": "success", "email": email})
        else:
            conn.close()
            tts.say("Login failed. Face not recognized")
            tts.runAndWait()
            return jsonify({"status": "error", "message": "Face not recognized"}), 401
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        if 'conn' in locals():
            conn.close()
        return jsonify({"status": "error", "message": f"Login failed: {str(e)}"}), 500

if __name__ == "__main__":
    os.makedirs(base_path, exist_ok=True)
    load_trained_model()
    app.run(debug=True, port=5000)