const { PrismaClient } = require('@prisma/client');
const { loadCareerModel } = require('../utils/loadModel');
const prisma = new PrismaClient();

async function recommendCareer(inputData) {
    try {
        const careerModel = await loadCareerModel();
        const prediction = careerModel.predict(inputData);
        const roleId = await matchRole(prediction);
        console.log('Prediction successful:', prediction);
        return roleId;
    } catch (error) {
        console.error('Error in recommendCareer:', error);
        throw new Error('Failed to recommend career');
    }
}

async function matchRole(role) {
    try {
        const existingRole = await prisma.Role.findFirst({
            where: {
                role: role
            }
        });

        if (existingRole) {
            return existingRole.id;
        } else {
            throw new Error(`Role not found: ${role}`);
        }
    } catch (error) {
        throw new Error('Failed to match role');
    }
}

async function createUserCareerHandler(inputData) {
    const userId = inputData.userId;
    let roleId;

    try {
        roleId = await recommendCareer(inputData);
    } catch (error) {
        throw new Error('Failed to recommend career');
    }

    try {
        const newUserCareer = await prisma.UserCareer.create({
            data: {
                userId: userId,
                jenisKelamin: inputData.jenisKelamin,
                bidang: inputData.bidang,
                pendidikan: inputData.pendidikan,
                skill: inputData.skill,
                roleId: roleId
            }
        });

        return newUserCareer;
    } catch (error) {
        throw new Error('Failed to create user career data');
    }
}

async function getUserCareerHandler(req, res) {
    const inputData = req.body;

    try {
        const newUserCareer = await createUserCareerHandler(inputData);
        res.status(201).json({
            status: 'Success',
            message: 'User career data created successfully',
            data: {
                userId: newUserCareer.userId,
                jenisKelamin: newUserCareer.jenisKelamin,
                bidang: newUserCareer.bidang,
                pendidikan: newUserCareer.pendidikan,
                skill: newUserCareer.skill,
                role: newUserCareer.role
            }
        });
    } catch (error) {
        console.error('Error in getUserCareerHandler:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Failed to create user career data'
        });
    }
}

module.exports = { createUserCareerHandler, getUserCareerHandler };