/**
 * Gemini Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const geminiController = require('../controllers/geminiController');

const router = express.Router();

router.post('/predict-and-recommend', verifyToken, asyncHandler(geminiController.predictAndRecommend));
router.post('/musics-from-mood', verifyToken, asyncHandler(geminiController.musicsFromMood));

module.exports = router;
