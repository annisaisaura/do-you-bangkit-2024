const express = require('express');
const { registerUserHandler, profileUserHandler } = require('../handlers/UserHandler');
const { requireAuth } = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/register', registerUserHandler);
router.get('/profile/:userId', requireAuth, profileUserHandler);

module.exports = router;