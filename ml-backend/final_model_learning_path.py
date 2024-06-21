import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

file_path = 'data/Learning_Pathway_Index.csv'
learning_path_df = pd.read_csv(file_path)

keywords = learning_path_df['Course_Learning_Material'].str.get_dummies(sep=', ')
unique_interests = keywords.columns.tolist()

learning_paths = {}
for module in learning_path_df['Module'].unique():
    module_keywords = keywords[learning_path_df['Module'] == module].sum().clip(upper=1)
    learning_paths[module] = module_keywords.tolist()

# Function to display interests and get user input
def get_user_interests():
    print("Select up to 3 interests from the list below by entering their numbers (comma-separated):")
    for idx, interest in enumerate(unique_interests, 1):
        print(f"{idx}. {interest}")
    
    user_input = input("Enter your choices (e.g., 1, 5, 12): ").strip()
    chosen_indices = [int(i.strip()) - 1 for i in user_input.split(',') if i.strip().isdigit()]
    user_interests = [unique_interests[i] for i in chosen_indices if i < len(unique_interests)]
    
    return user_interests

user_preference = [0] * len(unique_interests)
user_interests = get_user_interests()

for interest in user_interests:
    if interest in unique_interests:
        user_preference[unique_interests.index(interest)] = 1
    else:
        print(f"Interest '{interest}' not found in the dataset.")

def recommend_learning_path(user_pref, data, top_n=5):
    data_vectors = {key: np.array(value) for key, value in data.items()}

    similarities = {key: cosine_similarity([user_pref], [value])[0][0] for key, value in data_vectors.items()}
    sorted_similarities = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    top_similarities = sorted_similarities[:top_n]
    
    return top_similarities

recommended_paths = recommend_learning_path(user_preference, learning_paths)
recommendations = [{"Module": path, "Similarity": similarity} for path, similarity in recommended_paths]