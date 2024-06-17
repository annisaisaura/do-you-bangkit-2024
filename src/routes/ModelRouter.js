const express = require('express');
const { getCareerRecommendations, getCourseRecommendations } = require('../handlers/ModelHandler');

const router = express.Router();

router.post('/career-recommendations', getCareerRecommendations);
router.post('/course-recommendations', getCourseRecommendations);

module.exports = router;