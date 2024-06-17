const { prisma } = require("../prisma");
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/JWTUtils');

async function loginUserHandler(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'Failed', message: 'Please fill all of the required fields' });
    }

    try {
        const user = await prisma.User.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ status: 'Failed', message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'Failed', message: 'Invalid email or password' });
        }

        const token = generateToken({ userId: user.id });
        res.status(200).json({
            status: 'Success',
            message: 'User login successful',
            token
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to login user' });
    }
}

async function logoutUserHandler(req, res) {
    res.status(200).json({ status: 'Success', message: 'User logout successful' });
}

module.exports = { loginUserHandler, logoutUserHandler };