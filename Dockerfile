FROM node:18.20.3
WORKDIR /usr/src/app
ENV PORT 3000
COPY . .
COPY .env .
RUN npm install
EXPOSE 3000
ENV CAREER_MODEL_URL=https://storage.googleapis.com/ml_do-you/career_model.json
CMD ["npm", "run", "start"]