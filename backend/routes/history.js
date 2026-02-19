/**
 * History Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const historyController = require('../controllers/historyController');

const router = express.Router();

router.post('/', verifyToken, asyncHandler(historyController.create));
router.get('/stats/:userId', verifyToken, asyncHandler(historyController.getStats));
router.get('/top-artist/:userId', verifyToken, asyncHandler(historyController.getTopArtist));
router.get('/top-favorite-artist/:userId', verifyToken, asyncHandler(historyController.getTopFavoriteArtist));
router.get('/ai-mood-history/recommendation/:moodHistoryId', verifyToken, asyncHandler(historyController.getAiMoodRecommendations));
router.get('/ai-mood-history/:userId', verifyToken, asyncHandler(historyController.getAiMoodHistory));
router.get('/:userId', verifyToken, asyncHandler(historyController.getHistory));

module.exports = router;
