import pymysql
from pymysql import cursors

# Connect to MySQL
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    port=3306
)

try:
    cursor = conn.cursor()
    
    # Create database if it doesn't exist
    cursor.execute("CREATE DATABASE IF NOT EXISTS ai_resume_system;")
    print("✓ Database 'ai_resume_system' created successfully")
    
    # Use the database
    cursor.execute("USE ai_resume_system;")
    
    conn.commit()
    print("✓ Database setup complete")
    
finally:
    cursor.close()
    conn.close()
