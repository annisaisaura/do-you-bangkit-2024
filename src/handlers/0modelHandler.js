const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const dotenv = require('dotenv');
const { prisma } = require('../prisma');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

dotenv.config();

const storage = new Storage;

const BUCKET_NAME = process.env.BUCKET_NAME;
const CAREER_MODEL_URL = process.env.CAREER_MODEL_URL;
const COURSE_MODEL_URL = process.env.COURSE_MODEL_URL;

async function getModelFromUrl(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching model from URL ${url}:`, error);
        throw new Error('Error fetching model');
    }
}

async function getCareerModelHandler(req, res) {
    try {
        const model = await getModelFromUrl(CAREER_MODEL_URL);
        const inputData = req.body;

        const recommendations = await processModel(model, inputData);

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
        console.error('Error processing career model:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error processing career model'
        });
    }
}

async function getCourseModelHandler(req, res) {
    try {
        const model = await getModelFromUrl(COURSE_MODEL_URL);
        const inputData = req.body;

        const recommendations = await processModel(model, inputData);

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
        console.error('Error processing course model:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error processing course model'
        });
    }
}

async function saveCareerRecommendationHandler(req, res) {
    const { userId, bidangId, pendidikanId, jenisKelamin, skillId, roleId } = req.body;

    if (!userId || !bidangId || !pendidikanId || !jenisKelamin || !skillId || !roleId) {
        res.status(400).json({
            status: 'Failed',
            message: 'Missing required fields'
        });
        return;
    }

    try {
        const recommendation = await prisma.userCareer.create({
            data: {
                userId,
                bidangId,
                pendidikanId,
                jenisKelamin,
                skillId,
                roleId
            }
        });
        res.status(201).json({
            status: 'Success',
            data: recommendation
        });
    } catch (error) {
        console.error('Error saving career recommendation:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error saving career recommendation'
        });
    }
}

async function saveCourseRecommendationHandler(req, res) {
    const { userId, courseId, moduleId } = req.body;

    if (!userId || !courseId || !moduleId) {
        res.status(400).json({
            status: 'Failed',
            message: 'Missing required fields'
        });
        return;
    }

    try {
        const recommendation = await prisma.userCourse.create({
            data: {
                userId,
                courseId,
                moduleId
            }
        });
        res.status(201).json({
            status: 'Success',
            data: recommendation
        });
    } catch (error) {
        console.error('Error saving course recommendation:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error saving course recommendation'
        });
    }
}

module.exports = {getCareerModelHandler, getCourseModelHandler, saveCareerRecommendationHandler, saveCourseRecommendationHandler};