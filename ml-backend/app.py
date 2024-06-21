from flask import Flask, request, jsonify
import pandas as pd
import tensorflow as tf
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from preprocessing_career_recommendation import Preprocessor

app = Flask(__name__)

# Load the trained model and preprocessor for career recommendation
model_career = tf.keras.models.load_model('career-model.h5')
preprocessor_career = Preprocessor.load('career-preprocessor.pkl')

# Load data for course recommendation
file_path = 'data/Learning_Pathway_Index.csv'
learning_path_df = pd.read_csv(file_path)
keywords = learning_path_df['Course_Learning_Material'].str.get_dummies(sep=', ')
unique_interests = keywords.columns.tolist()

learning_paths = {}
for module in learning_path_df['Module'].unique():
    module_keywords = keywords[learning_path_df['Module'] == module].sum().clip(upper=1)
    learning_paths[module] = module_keywords.tolist()

# Function to recommend learning paths
def recommend_learning_path(user_pref, data, top_n=5):
    data_vectors = {key: np.array(value) for key, value in data.items()}
    similarities = {key: cosine_similarity([user_pref], [value])[0][0] for key, value in data_vectors.items()}
    sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    top_similarities = sorted_similarities[:top_n]
    return [path for path, similarity in top_similarities]

@app.route('/career', methods=['POST'])
def recommend_career():
    try:
        data = request.json
        
        # Validate input data
        required_columns = ['jenisKelamin', 'bidang', 'pendidikan', 'skill']
        if not all(column in data for column in required_columns):
            return jsonify({'error': 'Missing data'}), 400
        
        # Rename columns to match the preprocessing requirements
        data['Pendidikan'] = data.pop('pendidikan')
        data['Skill'] = data.pop('skill')
        data['Bidang'] = data.pop('bidang')
        data['Jenis Kelamin'] = data.pop('jenisKelamin')
        
        # Create DataFrame from input
        df_input = pd.DataFrame([data])
        
        # Preprocess the input data
        df_processed = preprocessor_career.transform(df_input)
        
        # Make prediction for career recommendation
        prediction = model_career.predict(df_processed)
        predicted_role_index = prediction.argmax(axis=1)[0]
        predicted_role = preprocessor_career.label_encoder_role.inverse_transform([predicted_role_index])[0]
        
        return jsonify({'role': predicted_role})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/course', methods=['POST'])
def recommend_course():
    try:
        data = request.json
        user_interests = data['course']

        # Convert user interests to user preferences
        user_preference = [1 if interest in user_interests else 0 for interest in unique_interests]

        # Get recommended learning paths
        recommended_paths = recommend_learning_path(user_preference, learning_paths)

        # Prepare response in JSON format
        response = {'module': recommended_paths}
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)