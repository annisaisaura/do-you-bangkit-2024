const { prisma } = require("../prisma");
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require("../utils/JWTUtils");

async function loginUserHandler(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Email or password is not provided'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User is not found',
            });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Please insert correct credentials'
            });
        }

        const token = generateAccessToken(user.id, user.email);
        const refreshToken = generateRefreshToken(user.id, user.email);

        const userData = {
            email: user.email,
            name: user.name
        };

        res.cookie('access_token', token, { maxAge: 30000, httpOnly: true });
        res.cookie('refresh_token', refreshToken, { maxAge: 600000, httpOnly: true });

        return res.status(200).json({
            status: 'Success',
            data: {
                user: userData,
                token,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'Failed',
            message: 'An error occurred while processing your request'
        });
    }
}

async function logoutUserHandler(req, res) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json({
        status: 'Success',
        message: 'Logout successful'
    });
}

module.exports = { loginUserHandler, logoutUserHandler };