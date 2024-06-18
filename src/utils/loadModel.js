const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

let careerModel;
let courseModel;

const loadModels = async () => {
    if (!careerModel) {
        careerModel = await tf.loadLayersModel(process.env.CAREER_MODEL_URL);
    }
    if (!courseModel) {
        courseModel = await tf.loadLayersModel(process.env.COURSE_MODEL_URL);
    }
};

const getCareerModel = () => careerModel;
const getCourseModel = () => courseModel;

module.exports = { loadModels, getCareerModel, getCourseModel };