const { Storage } = require('@google-cloud/storage');
const axios = require('axios');
const dotenv = require('dotenv');
const { prisma } = require('../prisma');

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
        res.status(200).json({
            status: 'Success',
            data: model
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error fetching career model'
        });
    }
}

async function getCourseModelHandler(req, res) {
    try {
        const model = await getModelFromUrl(COURSE_MODEL_URL);
        res.status(200).json({
            status: 'Success',
            data: model
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'Error fetching course model'
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