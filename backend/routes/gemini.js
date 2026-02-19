/**
 * Gemini Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const geminiController = require('../controllers/geminiController');

const router = express.Router();

router.post('/predict-and-recommend', verifyToken, geminiController.predictAndRecommend);
router.post('/musics-from-mood', verifyToken, geminiController.musicsFromMood);

module.exports = router;
