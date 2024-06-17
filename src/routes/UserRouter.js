const express = require('express');
const { registerUserHandler, profileUserHandler } = require('../handlers/UserHandler');
const { requireAuth, revokeAuth } = require('../middleware/AuthMiddleware');

router = express.Router();

router.post('/register', registerUserHandler);
router.get('/profile/:userId', requireAuth, profileUserHandler);

module.exports = router;