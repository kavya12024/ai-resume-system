from database import db
from datetime import datetime

class Resume(db.Model):
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text, nullable=False)
    parsed_data = db.Column(db.JSON, nullable=True)  # Store as JSON
    is_suspicious = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'text': self.text,
            'parsed_data': self.parsed_data,
            'is_suspicious': self.is_suspicious,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
