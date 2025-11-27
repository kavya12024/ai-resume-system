from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token
from models.user_model import User

register_parser = reqparse.RequestParser()
register_parser.add_argument('name', type=str, required=True, help="Name cannot be blank")
register_parser.add_argument('email', type=str, required=True, help="Email cannot be blank")
register_parser.add_argument('password', type=str, required=True, help="Password cannot be blank")
register_parser.add_argument('role', type=str, default='candidate', choices=('candidate', 'recruiter'))

login_parser = reqparse.RequestParser()
login_parser.add_argument('email', type=str, required=True, help="Email cannot be blank")
login_parser.add_argument('password', type=str, required=True, help="Password cannot be blank")

class UserRegister(Resource):
    def post(self):
        data = register_parser.parse_args()
        
        # Check if user already exists
        existing_user = User.find_by_email(data['email'])
        if existing_user:
            return {'message': 'User with this email already exists'}, 400
        
        try:
            # Create new user
            user = User(
                email=data['email'],
                password=data['password'],
                name=data['name'],
                role=data['role']
            )
            user.save()
            return {'message': 'User created successfully', 'user': user.to_dict()}, 201
        except Exception as e:
            return {'message': f'Something went wrong: {str(e)}'}, 500

class UserLogin(Resource):
    def post(self):
        data = login_parser.parse_args()
        user = User.find_by_email(data['email'])

        if user and User.check_password(user.password, data['password']):
            # Create JWT token
            access_token = create_access_token(
                identity=user.email,
                additional_claims={
                    'role': user.role,
                    'user_id': user.id
                }
            )
            
            return {
                'message': 'Logged in successfully',
                'access_token': access_token,
                'user': user.to_dict()
            }, 200
        
        return {'message': 'Invalid credentials'}, 401

def init_user_routes(api):
    api.add_resource(UserRegister, '/register')
    api.add_resource(UserLogin, '/login')
