from flask import Blueprint, request, jsonify
from services.question_generator import generate_questions
from services.answer_evaluator import evaluate_answer
from services.scoring_engine import calculate_score

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/start', methods=['POST'])
def start_interview():
    data = request.get_json()
    resume_data = data.get('resume_data')
    questions = generate_questions(resume_data)
    return jsonify({'questions': questions}), 200

@interview_bp.route('/answer', methods=['POST'])
def submit_answer():
    data = request.get_json()
    question = data.get('question')
    answer = data.get('answer')
    evaluation = evaluate_answer(question, answer)
    return jsonify({'evaluation': evaluation}), 200

@interview_bp.route('/score', methods=['POST'])
def get_score():
    data = request.get_json()
    answers = data.get('answers')
    score = calculate_score(answers)
    return jsonify({'score': score}), 200
