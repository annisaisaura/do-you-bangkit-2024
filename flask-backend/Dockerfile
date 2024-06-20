# Flask Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

ENV PORT 8080

ENV JWT_SECRET=bdda2386656cc1bbf16b0acd4650d5cb9d54f0e75e8acca517e780d0df92d77a

ENV PROJECT_ID=do-you-bangkit-2024
ENV BUCKET_NAME=ml_do-you
ENV CAREER_MODEL_URL=https://storage.googleapis.com/ml_do-you/career_model.h5
ENV COURSE_MODEL_URL=https://storage.googleapis.com/ml_do-you/learning_path_model.h5

ENV DB_URL=mysql://anggun:sayangzayne@34.101.149.195:3306/do-you-db?schema=public

RUN apt-get update && apt-get install -y npm
RUN npx prisma generate

EXPOSE 8080

CMD ["python", "app.py"]