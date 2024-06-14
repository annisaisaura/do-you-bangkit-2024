const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");

dotenv.config()

function generateAccessToken(userId, email) {
    return jwt.sign({
        userId,
        email
    },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '30s' }
    )
}

function generateRefreshToken(userId, email) {
    return jwt.sign({
        userId,
        email
    },
        process.env.REFRESH_ACCESS_TOKEN,
        { expiresIn: '10m' }
    )
}

module.exports = { generateAccessToken, generateRefreshToken }