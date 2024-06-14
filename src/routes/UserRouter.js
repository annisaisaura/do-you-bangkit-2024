const express = require('express')
const { registerUserHandler, getSpesificUserHandler, editUserHandler } = require('../handlers/UserHandler');
const { requireAuth, revokeAuth } = require('../middlewares/AuthMiddleware');

router = express.Router()

router.post('/user', registerUserHandler)
router.get('/user/:userId', requireAuth, revokeAuth, getSpesificUserHandler);
router.put('/user/:userId', requireAuth, revokeAuth, editUserHandler);

module.exports = router