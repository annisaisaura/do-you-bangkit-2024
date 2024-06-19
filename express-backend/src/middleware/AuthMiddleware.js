const { verifyToken } = require('../utils/JWTUtils');

function requireAuth(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
}

module.exports = { requireAuth };