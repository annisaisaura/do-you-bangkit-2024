FROM node:20.13.1
WORKDIR /usr/src/app
ENV PORT 3000
ENV CAREER_MODEL_URL=https://storage.googleapis.com/ml_do-you/career_model.json
ENV COURSE_MODEL_URL=https://storage.googleapis.com/ml_do-you/course_model.json
COPY . .
COPY .env .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]