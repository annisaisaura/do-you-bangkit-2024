const { verifyToken } = require('../utils/JWTUtils');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            status: 'Failed', 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            status: 'Failed', 
            message: 'Invalid token' 
        });
    }
}

module.exports = authenticateToken;