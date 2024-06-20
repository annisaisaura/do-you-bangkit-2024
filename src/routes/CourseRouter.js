const express = require('express');
const { createUserCourseHandler, getUserCourseHandler } = require('../handlers/CourseHandler');
const authenticateToken = require('../middleware/AuthMiddleware');

const router = express.Router();

router.post('/course', createUserCourseHandler);
router.get('/course/:id', authenticateToken, getUserCourseHandler);

module.exports = router;