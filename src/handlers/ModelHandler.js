const { prisma } = require('../prisma');
const axios = require('axios');
const csv = require('csv-parser');
const { Storage } = require('@google-cloud/storage');

const BUCKET_NAME = process.env.BUCKET_NAME;
const CAREER_MODEL_URL = process.env.CAREER_MODEL_URL;
const COURSE_MODEL_URL = process.env.COURSE_MODEL_URL;

const storage = new Storage();

// Function to fetch JSON career model from URL
async function fetchCareerModel() {
    try {
        const response = await axios.get(CAREER_MODEL_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching career model:', error);
        throw new Error('Error fetching career model');
    }
}

// Function to fetch JSON course model from URL
async function fetchCourseModel() {
    try {
        const response = await axios.get(COURSE_MODEL_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching course model:', error);
        throw new Error('Error fetching course model');
    }
}

// Function to fetch role recommendations from CSV
async function fetchRoleRecommendations() {
    try {
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file('role.csv');
        const stream = file.createReadStream();

        const roleRecommendations = await new Promise((resolve, reject) => {
            const results = [];
            stream.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', reject);
        });

        return roleRecommendations;
    } catch (error) {
        console.error('Error fetching role recommendations:', error);
        throw new Error('Error fetching role recommendations');
    }
}

// Function to fetch education categories from CSV
async function fetchEducationCategories() {
    try {
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file('pendidikan.csv');
        const stream = file.createReadStream();

        const educationCategories = await new Promise((resolve, reject) => {
            const results = [];
            stream.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', reject);
        });

        return educationCategories;
    } catch (error) {
        console.error('Error fetching education categories:', error);
        throw new Error('Error fetching education categories');
    }
}

// Function to process user input using career model
async function processCareerModel(inputData) {
    try {
        const careerModel = await fetchCareerModel();
        // Replace with your actual model processing logic
        const recommendations = careerModel.predict(inputData);
        return recommendations;
    } catch (error) {
        console.error('Error processing career model:', error);
        throw new Error('Error processing career model');
    }
}

// Function to process user input using course model
async function processCourseModel(inputData) {
    try {
        const courseModel = await fetchCourseModel();
        // Replace with your actual model processing logic
        const recommendations = courseModel.predict(inputData);
        return recommendations;
    } catch (error) {
        console.error('Error processing course model:', error);
        throw new Error('Error processing course model');
    }
}

// Handler to get career recommendations
async function getCareerRecommendations(req, res) {
    try {
        const inputData = req.body;
        const recommendations = await processCareerModel(inputData);

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

// Handler to get course recommendations
async function getCourseRecommendations(req, res) {
    try {
        const inputData = req.body;
        const recommendations = await processCourseModel(inputData);

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