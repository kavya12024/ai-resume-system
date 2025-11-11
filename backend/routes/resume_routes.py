from flask import Blueprint, request, jsonify
from services.resume_parser import parse_resume
from werkzeug.utils import secure_filename
import os

resume_bp = Blueprint('resume', __name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        parsed_data = parse_resume(filepath)
        return jsonify({'parsed_data': parsed_data}), 200
    return jsonify({'error': 'Invalid file type'}), 400
