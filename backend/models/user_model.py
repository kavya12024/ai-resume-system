from database import db
import flask_bcrypt

bcrypt = flask_bcrypt.Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='candidate')  # 'candidate' or 'recruiter'
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    def __init__(self, email, password, name, role='candidate'):
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.name = name
        self.role = role

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def find_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def find_by_id(user_id):
        return User.query.filter_by(id=user_id).first()

    @staticmethod
    def check_password(hashed_password, password):
        return bcrypt.check_password_hash(hashed_password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }
