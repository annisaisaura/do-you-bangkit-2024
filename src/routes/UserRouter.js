const express = require('express');
const { registerUserHandler } = require('../handlers/UserHandler');
const { loginUserHandler, logoutUserHandler } = require('../handlers/AuthHandler');
const { requireAuth, revokeAuth } = require('../middleware/AuthMiddleware');

router = express.Router();

router.post('/user', registerUserHandler);
router.post('/login', loginUserHandler);
router.post('/logout', requireAuth, logoutUserHandler);

module.exports = router;