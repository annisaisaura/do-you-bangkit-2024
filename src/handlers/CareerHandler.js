require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function getRoleFromModel(bidang, pendidikan, skill, jenisKelamin) {
    try {
        const response = await axios.get(process.env.MODEL_CAREER_URL);
        const modelData = response.data;
        const role = modelData.role;

        return role;
    } catch (error) {
        console.error('Error fetching model data:', error);
        throw new Error('Failed to fetch model data');
    }
}

async function createUserCareerHandler(req, res) {
    const { userId } = req.user;
    const { bidang, pendidikan, skill, jenisKelamin } = req.body;

    if (!bidang || !pendidikan || !jenisKelamin || !skill) {
        return res.status(400).json({ status: 'Failed', message: 'Please fill all of the required fields' });
    }

    try {
        const newBidang = await prisma.Bidang.create({ data: { bidang } });
        const newPendidikan = await prisma.Pendidikan.create({ data: { pendidikan } });
        const newSkill = await prisma.Skill.create({ data: { skill } });

        const role = await getRoleFromModel(bidang, pendidikan, skill, jenisKelamin);

        const userCareer = await prisma.UserCareer.create({
            data: {
                userId,
                bidangId: newBidang.id,
                pendidikanId: newPendidikan.id,
                skillId: newSkill.id,
                jenisKelamin,
                role
            }
        });

        res.status(201).json({
            status: 'Success',
            message: 'UserCareer created successfully',
            data: userCareer
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to create UserCareer' });
    }
}

async function getUserCareerHandler(req, res) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        const userCareer = await prisma.UserCareer.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                bidang: true,
                pendidikan: true,
                skill: true
            }
        });

        if (!userCareer || userCareer.userId !== userId) {
            return res.status(404).json({ status: 'Failed', message: 'UserCareer not found' });
        }

        res.status(200).json({
            status: 'Success',
            data: userCareer
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to fetch UserCareer' });
    }
}

module.exports = { createUserCareerHandler, getUserCareerHandler };