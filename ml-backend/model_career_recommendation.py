import pandas as pd
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras import layers
import joblib
from preprocessing_career_recommendation import Preprocessor

# Initialize preprocessor
preprocessor = Preprocessor()

# Preprocess the data
df = pd.read_csv('data/df_cr.csv').head(1000)
df_processed, labels = preprocessor.fit_transform(df)

# Separate features and labels
X = df_processed.drop(columns=['Role'])
y = labels

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create the model
model = tf.keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    layers.Dense(64, activation='relu'),
    layers.Dense(len(preprocessor.label_encoder_role.classes_), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=5, batch_size=4, validation_split=0.2)

# Save the model and preprocessor
model.save('career-model.h5')
preprocessor.save('career-preprocessor.pkl')