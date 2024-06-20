require('dotenv').config();
const tf = require('@tensorflow/tfjs-node');

async function loadCareerModel() {
    try {
        const careerModel = await tf.loadLayersModel(process.env.MODEL_CAREER_URL);
        return careerModel;
    } catch (error) {
        console.error('Failed to load career model:', error);
        throw new Error('Failed to load career model');
    }
}

async function loadCourseModel() {
    try {
        const courseModel = await tf.loadLayersModel(process.env.MODEL_COURSE_URL);
        return courseModel;
    } catch (error) {
        console.error('Failed to load course model:', error);
        throw new Error('Failed to load course model');
    }
}

module.exports = { loadCareerModel, loadCourseModel };