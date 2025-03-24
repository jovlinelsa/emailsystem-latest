import sqlite3

# Connect to the database (creates file if it doesn't exist)
conn = sqlite3.connect(r"C:\Users\jovli\Downloads\email-system---frontend--main\face_database.db")
print("Database connected successfully!")

conn.close()
