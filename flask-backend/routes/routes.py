from flask import Flask, request, jsonify
import requests
from service.predict import *
import service.predict as predict
from service.recommendations import *
import service.recommendations as recom

app = Flask(__name__)

@app.route("/")
def home():
    message = "Welcome to our machine learning model and backend integration endpoints."
    return jsonify(message)

@app.route('/career-recommendation', methods=['POST'])
def career_recommendation():
    data = request.json
    recommendations = get_career_recommendation(data)
    return jsonify(recommendations)

@app.route('/course-recommendation', methods=['POST'])
def course_recommendation():
    data = request.json
    recommendations = get_course_recommendation(data)
    return jsonify(recommendations)

@app.route('/fetch-users', methods=['GET'])
def fetch_users():
    # Example of fetching users from Express backend
    express_base_url = os.getenv('https://express-be-service-ecpkt3b5wq-et.a.run.app ')  # Example: http://express-backend-service.default.svc.cluster.local:8080
    response = requests.get(f'{express_base_url}/api/users')
    return response.json()

@app.route('/create-user', methods=['POST'])
def create_user():
    # Example of creating a user via Express backend
    express_base_url = os.getenv('https://express-be-service-ecpkt3b5wq-et.a.run.app ')  # Example: http://express-backend-service.default.svc.cluster.local:8080
    data = request.json
    response = requests.post(f'{express_base_url}/api/users', json=data)
    return response.json()

