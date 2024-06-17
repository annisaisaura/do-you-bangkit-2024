const express = require('express');
const { getCareerModelHandler, getCourseModelHandler, saveCareerRecommendationHandler, saveCourseRecommendationHandler } = require('../handlers/ModelHandler');

const router = express.Router();

router.get('/career-model', getCareerModelHandler);
router.get('/course-model', getCourseModelHandler);
router.post('/save-career-recommendation', saveCareerRecommendationHandler);
router.post('/save-course-recommendation', saveCourseRecommendationHandler);

module.exports = router;