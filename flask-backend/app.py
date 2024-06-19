from flask import Flask, request, jsonify
from model.load_model import get_career_recommendation, get_course_recommendation
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)