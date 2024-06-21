import re
import nltk
import pandas as pd
from nltk.corpus import wordnet, stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import joblib

# Download NLTK data
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('indonesian'))

def get_wordnet_pos(word):
    tag = nltk.pos_tag([word])[0][1][0].upper()
    tag_dict = {'J': wordnet.ADJ, 'N': wordnet.NOUN, 'V': wordnet.VERB, 'R': wordnet.ADV}
    return tag_dict.get(tag, wordnet.NOUN)

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\W|\d', ' ', text)
    words = word_tokenize(text)
    words = [word for word in words if word not in stop_words]
    lemmatized_words = [lemmatizer.lemmatize(word, get_wordnet_pos(word)) for word in words]
    return ' '.join(lemmatized_words)

class Preprocessor:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer()
        self.label_encoder_bidang = LabelEncoder()
        self.label_encoder_gender = LabelEncoder()
        self.label_encoder_role = LabelEncoder()

    def fit_transform(self, df):
        df['Pendidikan'] = df['Pendidikan'].apply(preprocess_text)
        df['Skill'] = df['Skill'].apply(preprocess_text)
        df['combined_text'] = df['Pendidikan'] + ' ' + df['Skill']

        tfidf_matrix = self.tfidf_vectorizer.fit_transform(df['combined_text'])
        tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=self.tfidf_vectorizer.get_feature_names_out())
        
        df['Bidang'] = self.label_encoder_bidang.fit_transform(df['Bidang'])
        df['Jenis Kelamin'] = self.label_encoder_gender.fit_transform(df['Jenis Kelamin'])
        df['Role'] = self.label_encoder_role.fit_transform(df['Role'])

        df = df.join(tfidf_df).drop(columns=['Pendidikan', 'Skill', 'combined_text'])
        return df, df['Role']

    def transform(self, df):
        df['Pendidikan'] = df['Pendidikan'].apply(preprocess_text)
        df['Skill'] = df['Skill'].apply(preprocess_text)
        df['combined_text'] = df['Pendidikan'] + ' ' + df['Skill']

        tfidf_matrix = self.tfidf_vectorizer.transform(df['combined_text'])
        tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=self.tfidf_vectorizer.get_feature_names_out())
        
        df['Bidang'] = self.label_encoder_bidang.transform(df['Bidang'])
        df['Jenis Kelamin'] = self.label_encoder_gender.transform(df['Jenis Kelamin'])
        
        df = df.join(tfidf_df).drop(columns=['Pendidikan', 'Skill', 'combined_text'])
        return df

    def save(self, filepath):
        joblib.dump(self, filepath)

    @staticmethod
    def load(filepath):
        return joblib.load(filepath)