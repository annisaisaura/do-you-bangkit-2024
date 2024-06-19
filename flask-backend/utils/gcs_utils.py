from google.cloud import storage
import os

def download_model_from_gcs(model_url):
    client = storage.Client()
    bucket_name, model_file = model_path.split('/', 1)
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(model_file)
    local_path = f'/tmp/{os.path.basename(model_file)}'
    blob.download_to_filename(local_path)
    return local_path