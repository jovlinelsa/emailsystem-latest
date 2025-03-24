# import cv2
# import numpy as np
# import os

# data_dir = "faces"
# recognizer = cv2.face.LBPHFaceRecognizer_create()

# faces = []
# labels = []

# # Read images and labels
# for user_id in os.listdir(data_dir):
#     user_path = os.path.join(data_dir, user_id)
#     if not os.path.isdir(user_path):
#         continue
    
#     for image_name in os.listdir(user_path):
#         image_path = os.path.join(user_path, image_name)
#         img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
#         faces.append(img)
#         labels.append(int(user_id))  # Convert user_id to int

# # Convert lists to NumPy arrays
# faces = np.array(faces, dtype="object")
# labels = np.array(labels)

# # Train the model
# recognizer.train(faces, labels)
# recognizer.save("lbph_model.xml")  # Save trained model
# print("Training complete, model saved as lbph_model.xml")


import cv2
import numpy as np
import sqlite3

# Connect to DB
conn = sqlite3.connect("face_db.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, face_data FROM users")
users = cursor.fetchall()

faces = []
labels = []

for user in users:
    user_id, face_data = user
    faces_array = np.frombuffer(face_data, dtype=np.uint8)
    faces.append(faces_array.reshape(-1, 100, 100))  # Reshape to 100x100 (Adjust as needed)
    labels.append(user_id)

faces = np.array(faces)
labels = np.array(labels)

# Train LBPH model
model = cv2.face.LBPHFaceRecognizer_create()
model.train(faces, labels)
model.save("lbph_model.xml")
print("Training Complete")
