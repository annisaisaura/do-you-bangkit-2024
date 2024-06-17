const express = require('express');
const { registerUserHandler, profileUserHandler } = require('../handlers/UserHandler');
const authenticateToken = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/register', registerUserHandler);
router.get('/profile/:userId', authenticateToken, profileUserHandler);

module.exports = router;