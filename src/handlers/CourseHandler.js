const { PrismaClient } = require('@prisma/client');
const { loadCourseModel } = require('../utils/loadModel');
const prisma = new PrismaClient();

async function recommendModules(inputData) {
    try {
        const careerModel = await loadCourseModel();
        const prediction = courseModel.predict(inputData);
        const moduleIds = await matchModules(prediction);
        console.log('Prediction successful:', prediction);
        return moduleIds;
    } catch (error) {
        console.error('Error in recommendCareer:', error);
        throw new Error('Failed to recommend career');
    }
}

async function matchModules(modules) {
    try {
        const moduleIds = [];
        for (const module of modules) {
            const existingModule = await prisma.Module.findFirst({
                where: {
                    module: module
                }
            });
            if (existingModule) {
                moduleIds.push(existingModule.id);
            } else {
                throw new Error(`Module not found: ${moduleName}`);
            }
        }
        return moduleIds;
    } catch (error) {
        throw new Error('Failed to match modules');
    }
}

async function createUserCourseHandler(inputData) {
    const userId = inputData.userId;
    const courseIds = inputData.courseIds;
    const moduleIds = await recommendModules(courseIds);

    try {
        const newUserCourse = await prisma.UserCourse.create({
            data: {
                userId: userId,
                courseId: courseIds,
                moduleId: moduleIds
            }
        });

        return newUserCourse;
    } catch (error) {
        throw new Error('Failed to create user course data');
    }
}

async function getUserCourseHandler(req, res) {
    const inputData = req.body;

    try {
        const newUserCourse = await createUserCourseHandler(inputData);
        res.status(201).json({
            status: 'Success',
            message: 'User course data created successfully',
            data: {
                userId: newUserCourse.userId,
                course: newUserCourse.courseIds,
                module: newUserCourse.moduleIds
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Failed to create user course data'
        });
    }
}

module.exports = { createUserCourseHandler, getUserCourseHandler };