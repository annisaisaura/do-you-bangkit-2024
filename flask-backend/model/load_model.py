import tensorflow as tf 
import os
import requests
from utils.gcs_utils import download_model_from_gcs

# Load env
career_model_url = os.getenv('CAREER_MODEL_URL')
course_model_url = os.getenv('COURSE_MODEL_URL')

# Download and process models from bucket
career_model_path = download_model_from_gcs(career_model_url)
course_model_path = download_model_from_gcs(course_model_url)

career_model = tf.keras.models.load_model(career_model_path)
course_model = tf.keras.model.load_model(course_model_path)

def get_career_recommendation(input_data):
    predictions = career_model.predict(input_data)
    return predictions

def get_course_recommendation(input_data):
    predictions = course_model.predict(input_data)
    return predictions