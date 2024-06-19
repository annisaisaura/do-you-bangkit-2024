const { PrismaClient } = require('@prisma/client');
const loadModel = require('../utils/loadModel');
const prisma = new PrismaClient();

async function mapInputColumns(inputData) {
    return {
        'Jenis_Kelamin': inputData['jenisKelamin'],
        'Bidang': inputData['bidang'],
        'Pendidikan': inputData['pendidikan'],
        'Skill': inputData['skill']
    };
}

async function mapModelColumns(inputData) {
    return {
        'jenisKelamin': inputData['Jenis_Kelamin'],
        'bidang': inputData['Bidang'],
        'pendidikan': inputData['Pendidikan'],
        'skill': inputData['Skill']
    };
}

async function predictRole(inputData) {
    try {
        const model = await loadModel();
        const mappedInput = await mapModelColumns(inputData);
        const prediction = model.predict(mappedInput);
        const result = prediction.dataSync();
        return result;
    } catch (error) {
        throw new Error('Failed to make prediction');
    }
}

async function checkRole(role) {
    try {
        const existingRole = await prisma.Role.findFirst({
            where: {
                role: role
            }
        });

        if (existingRole) {
            return existingRole.id;
        } else {
            const newRole = await prisma.Role.create({
                data: {
                    role: role
                }
            });
            return newRole.id;
        }
    } catch (error) {
        throw new Error('Failed to check or create role');
    }
}

async function createUserCareerHandler(req, res) {
    const inputData = req.body;

    try {
        const mappedInput = await mapInputColumns(inputData);
        const predictedRole = await predictRole(mappedInput);
        const roleId = await checkRole(predictedRole);
        const userId = req.user.id;

        const newUserCareer = await prisma.UserCareer.create({
            data: {
                userId: userId,
                jenisKelamin: mappedInput['Jenis_Kelamin'],
                bidang: mappedInput['Bidang'],
                pendidikan: mappedInput['Pendidikan'],
                skill: mappedInput['Skill'],
                roleId: roleId
            }
        });

        res.status(201).json({
            status: 'Success',
            message: 'User career data created successfully',
            data: {
                id: newUserCareer.id,
                userId: newUserCareer.userId,
                jenisKelamin: newUserCareer.jenisKelamin,
                bidang: newUserCareer.bidang,
                pendidikan: newUserCareer.pendidikan,
                skill: newUserCareer.skill,
                roleId: newUserCareer.roleId
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Failed to create user career data'
        });
    }
}

async function getUserCareerHandler(req, res) {
    const { userCareerId } = req.params;

    try {
        const userCareer = await prisma.UserCareer.findUnique({
            where: { id: userCareerId },
        });

        if (!userCareer) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User career not found',
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'User career information successfully retrieved',
            data: {
                id: userCareer.id,
                userId: userCareer.userId,
                jenisKelamin: userCareer.jenisKelamin,
                bidang: userCareer.bidang,
                pendidikan: userCareer.pendidikan,
                skill: userCareer.skill,
                roleId: userCareer.roleId,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Failed to retrieve user career information',
        });
    }
}

module.exports = { createUserCareerHandler, getUserCareerHandler };