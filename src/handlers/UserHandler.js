const { prisma } = require("../prisma");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUserHandler = async (req, res) => {
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

const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'Failed', message: 'Please fill all of the required fields' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ status: 'Failed', message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ status: 'Failed', message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 'Success',
            message: 'User login successful',
            token: token,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to login user' });
    }
};

const logoutUserHandler = async (req, res) => {
    const { userId } = req.user;

    try {
        await prisma.refresh_session.delete({
            where: { userId },
        });

        res.status(200).json({
            status: 'Success',
            message: 'User logout successful',
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to logout user' });
    }
};

module.exports = { registerUsenorHandler, loginUserHandler, logoutUserHandler };