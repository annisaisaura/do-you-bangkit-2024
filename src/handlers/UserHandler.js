const { prisma } = require("../prisma");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUserHandler(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: 'Failed', message: 'Please fill all of the required fields' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const data = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        res.status(201).json({
            status: 'Success',
            message: 'User register successful',
            data: data,
        });
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({
                status: 'Failed',
                message: 'Email has been taken, please select another email',
            });
        } else {
            console.error('Error:', error);
            res.status(500).json({ status: 'Failed', message: 'Failed to create user' });
        }
    }
};

async function profileUserHandler(req, res) {
    const { userId } = req.params;

    try {
        const User = await prisma.User.findUnique({
            where: {
                ID: userId
            },
        });

        if (!User) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'User Information successfully retrieved',
            data: {
                ID: User.ID,
                name: User.name,
                email: User.email
            }
        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({
            status: 'Failed', 
            error: 'Failed to retrieve user information'
        });
    }
}

module.exports = { registerUserHandler, profileUserHandler };