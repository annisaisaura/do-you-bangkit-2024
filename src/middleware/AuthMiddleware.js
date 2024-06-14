const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../utils/JWTUtils');

dotenv.config()

function requireAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 'Failed',
            message: 'Authorization header is missing'
        });
    }

    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        res.json({
            status: 'Failed',
            message: 'User is not authenticated'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        req.user = {
            id: decoded.userId,
            email: decoded.email
        }
        return next()
    } catch (err) {
        res.clearCookie('access_token')
        res.status(401)
        return res.json({
            status: 'Failed',
            message: 'User is not authenticated'
        })
    }
}

function revokeAuth(req, res, next) {
    const decoded = req.user
    const newToken = generateAccessToken(decoded.id, decoded.email)
    res.cookie('access_token', newToken)
    return next()
}


module.exports = { requireAuth, revokeAuth }