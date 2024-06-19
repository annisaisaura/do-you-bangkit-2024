const { prisma } = require('../prisma');
const tf = require('@tensorflow/tfjs-tflite');
const { loadModels, getCareerModel, getCourseModel } = require('../utils/loadModel');

// Pastikan model dimuat ketika aplikasi mulai
loadModels();

const getCareerRecommendations = async (req, res) => {
    try {
        const inputData = req.body;
        const careerModel = getCareerModel();
        const prediction = careerModel.predict(tf.tensor(inputData));
        const recommendations = prediction.dataSync(); // Extract data from tensor

        // Save recommendations to database using Prisma
        const savedRecommendations = await prisma.userCareer.createMany({
            data: recommendations.map(recommendation => ({
                userId: inputData.userId,
                bidangId: recommendation.bidangId,
                pendidikanId: recommendation.pendidikanId,
                jenisKelamin: inputData.jenisKelamin,
                skillId: recommendation.skillId,
                roleId: recommendation.roleId,
            }))
        });

        res.status(200).json({
            status: 'Success',
            data: savedRecommendations
        });
    } catch (error) {
        console.error('Error in getCareerRecommendations:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error processing career recommendations'
        });
    }
}

const getCourseRecommendations = async (req, res) => {
    try {
        const inputData = req.body;
        const courseModel = getCourseModel();
        const prediction = courseModel.predict(tf.tensor(inputData));
        const recommendations = prediction.dataSync(); // Extract data from tensor

        // Save recommendations to database using Prisma
        const savedRecommendations = await prisma.userCourse.createMany({
            data: recommendations.map(recommendation => ({
                userId: inputData.userId,
                courseId: recommendation.courseId,
                moduleId: recommendation.moduleId,
            }))
        });

        res.status(200).json({
            status: 'Success',
            data: savedRecommendations
        });
    } catch (error) {
        console.error('Error in getCourseRecommendations:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error processing course recommendations'
        });
    }
}

module.exports = { getCareerRecommendations, getCourseRecommendations };