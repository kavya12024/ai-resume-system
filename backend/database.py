from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

def init_db(app):
    """Initialize database with SQLAlchemy"""
    # Use SQLite by default (works with XAMPP or standalone)
    database_url = os.getenv('DATABASE_URL', 'sqlite:///ai_resume_system.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
        print(f"✓ Database initialized successfully")

