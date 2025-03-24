# import cv2
# import numpy as np
# import os

# recognizer = cv2.face.LBPHFaceRecognizer_create()
# recognizer.read("lbph_model.xml")  # Load trained model

# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# cap = cv2.VideoCapture(0)

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#     for (x, y, w, h) in faces:
#         face_img = gray[y:y+h, x:x+w]
#         label, confidence = recognizer.predict(face_img)

#         text = f"User {label} (Conf: {confidence:.2f})"
#         color = (0, 255, 0) if confidence < 50 else (0, 0, 255)

#         cv2.putText(frame, text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
#         cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)

#     cv2.imshow("Face Recognition", frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()


import cv2
import numpy as np
import sqlite3

# Load LBPH model
model = cv2.face.LBPHFaceRecognizer_create()
model.read("lbph_model.xml")

# Connect to DB
conn = sqlite3.connect("face_db.sqlite")
cursor = conn.cursor()

# Start camera
cap = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        face = gray[y:y+h, x:x+w]
        label, confidence = model.predict(face)
        
        # Fetch user email from database
        cursor.execute("SELECT email FROM users WHERE id=?", (label,))
        user = cursor.fetchone()
        
        if user and confidence < 50:  # Confidence threshold (lower is better)
            cv2.putText(frame, f"User: {user[0]}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        else:
            cv2.putText(frame, "Unknown", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
conn.close()
