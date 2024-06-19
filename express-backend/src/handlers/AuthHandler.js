const bcrypt = require('bcrypt');
const { prisma } = require("../prisma");
const { generateToken } = require('../utils/JWTUtils');

async function loginUserHandler(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000 });
    return res.status(200).json({ token });
}

async function logoutUserHandler(req, res) {
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { loginUserHandler, logoutUserHandler };