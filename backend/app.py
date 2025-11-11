from flask import Flask
from flask_cors import CORS
from config import Config
from database import db
from routes.user_routes import user_bp
from routes.resume_routes import resume_bp
from routes.interview_routes import interview_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(resume_bp, url_prefix='/api/resume')
app.register_blueprint(interview_bp, url_prefix='/api/interview')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
