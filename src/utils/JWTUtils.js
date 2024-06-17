require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, secretKey);
}

module.exports = { generateToken, verifyToken };