const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function registerUserHandler(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: 'Failed', message: 'Please fill all of the required fields' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.User.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            status: 'Success',
            message: 'User register successful',
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({
                status: 'Failed',
                message: 'Email has been taken, please select another email'
            });
        } else {
            console.error('Error:', error);
            res.status(500).json({ status: 'Failed', message: 'Failed to create user' });
        }
    }
}

async function profileUserHandler(req, res) {
    const { userId } = req.params;

    try {
        const user = await prisma.User.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'User information successfully retrieved',
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Failed to retrieve user information'
        });
    }
}

module.exports = { registerUserHandler, profileUserHandler };