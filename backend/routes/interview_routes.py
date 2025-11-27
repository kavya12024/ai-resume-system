from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import json

# Python AI Service URL
AI_SERVICE_URL = 'http://localhost:5000'

class GenerateQuestion(Resource):
    @jwt_required()
    def post(self):
        """Generate interview questions based on skills"""
        parser = reqparse.RequestParser()
        parser.add_argument('skills', type=str, required=True, help='Skills to generate questions for')
        parser.add_argument('question_count', type=int, default=1)
        args = parser.parse_args()
        
        try:
            # Call AI service
            response = requests.post(
                f'{AI_SERVICE_URL}/generate-question',
                json={
                    'skills': args.skills,
                    'question_count': args.question_count
                }
            )
            
            if response.status_code == 200:
                return response.json(), 200
            else:
                return {'error': 'Failed to generate question'}, 500
                
        except Exception as e:
            return {'error': str(e)}, 500

class EvaluateAnswer(Resource):
    @jwt_required()
    def post(self):
        """Evaluate candidate answer to interview question"""
        parser = reqparse.RequestParser()
        parser.add_argument('question', type=str, required=True)
        parser.add_argument('answer', type=str, required=True)
        args = parser.parse_args()
        
        try:
            # Call AI service
            response = requests.post(
                f'{AI_SERVICE_URL}/evaluate-answer',
                json={
                    'question': args.question,
                    'answer': args.answer
                }
            )
            
            if response.status_code == 200:
                return response.json(), 200
            else:
                return {'error': 'Failed to evaluate answer'}, 500
                
        except Exception as e:
            return {'error': str(e)}, 500

class ExtractSkills(Resource):
    @jwt_required()
    def post(self):
        """Extract skills from resume text"""
        parser = reqparse.RequestParser()
        parser.add_argument('resume_text', type=str, required=True)
        args = parser.parse_args()
        
        try:
            # Call AI service
            response = requests.post(
                f'{AI_SERVICE_URL}/extract-skills',
                json={'resume_text': args.resume_text}
            )
            
            if response.status_code == 200:
                return response.json(), 200
            else:
                return {'error': 'Failed to extract skills'}, 500
                
        except Exception as e:
            return {'error': str(e)}, 500

def init_interview_routes(api):
    """Register interview routes"""
    api.add_resource(GenerateQuestion, '/interview/generate-question')
    api.add_resource(EvaluateAnswer, '/interview/evaluate-answer')
    api.add_resource(ExtractSkills, '/interview/extract-skills')
