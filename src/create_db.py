import sqlite3

# Connect to SQLite database
conn = sqlite3.connect("face_database.db")
cursor = conn.cursor()

# Create a table for storing user face data and login credentials
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        face_data BLOB NOT NULL
    )
""")

conn.commit()
conn.close()
print("Database setup complete!")
