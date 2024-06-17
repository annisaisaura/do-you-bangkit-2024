const express = require('express');
const { createUserCareerHandler, getUserCareerHandler } = require('../handlers/CareerHandler');
const authenticateToken = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/career', createUserCareerHandler);
router.get('/career/:id', authenticateToken, getUserCareerHandler);

module.exports = router;