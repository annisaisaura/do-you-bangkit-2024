from flask import Flask
from routes.routes import * as routes
from model.load_model import get_career_recommendation, get_course_recommendation
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.getcwd(), '.env'))

app = Flask(__name__)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv("PORT"))