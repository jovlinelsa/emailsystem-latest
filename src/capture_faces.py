# import cv2
# import os

# # Create directory for storing faces if it doesn't exist
# face_dir = "faces"
# if not os.path.exists(face_dir):
#     os.makedirs(face_dir)

# # Initialize OpenCV face detector
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# # Ask user for ID
# user_id = input("Enter User ID: ")
# user_folder = os.path.join(face_dir, user_id)
# if not os.path.exists(user_folder):
#     os.makedirs(user_folder)

# cap = cv2.VideoCapture(0)
# count = 0

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#     for (x, y, w, h) in faces:
#         count += 1
#         face_img = gray[y:y+h, x:x+w]
#         cv2.imwrite(f"{user_folder}/{count}.jpg", face_img)  # Save image
#         cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

#     cv2.imshow("Face Capture", frame)
    
#     # Stop after capturing 20 images
#     if count >= 20:
#         break

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()

import cv2
import numpy as np
import sqlite3

# Connect to DB
conn = sqlite3.connect("face_db.sqlite")
cursor = conn.cursor()

# Create table if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    face_data BLOB
)
""")
conn.commit()

# Initialize webcam
cap = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

email = input("Enter email: ")
password = input("Enter password: ")

face_count = 0
face_images = []

while face_count < 20:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        face = gray[y:y+h, x:x+w]
        face_images.append(face)
        face_count += 1
        cv2.imshow("Face Capture", face)
    
    if cv2.waitKey(100) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

# Convert faces to binary and store in DB
face_data = np.array(face_images, dtype=np.uint8).tobytes()
cursor.execute("INSERT INTO users (email, password, face_data) VALUES (?, ?, ?)", (email, password, face_data))
conn.commit()
conn.close()

