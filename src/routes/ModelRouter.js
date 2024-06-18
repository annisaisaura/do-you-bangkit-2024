const express = require('express');
const { getCareerRecommendations, getCourseRecommendations } = require('../handlers/ModelHandler');

const router = express.Router();

// Rute untuk mendapatkan rekomendasi karir dan menyimpan ke database
router.post('/career-recommendations', getCareerRecommendations);

// Rute untuk mendapatkan rekomendasi kursus dan menyimpan ke database
router.post('/course-recommendations', getCourseRecommendations);

module.exports = router;