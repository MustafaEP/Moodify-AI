/**
 * History Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const historyController = require('../controllers/historyController');

const router = express.Router();

router.post('/', verifyToken, historyController.create);
router.get('/stats/:userId', verifyToken, historyController.getStats);
router.get('/top-artist/:userId', verifyToken, historyController.getTopArtist);
router.get('/top-favorite-artist/:userId', verifyToken, historyController.getTopFavoriteArtist);
router.get('/ai-mood-history/recommendation/:moodHistoryId', verifyToken, historyController.getAiMoodRecommendations);
router.get('/ai-mood-history/:userId', verifyToken, historyController.getAiMoodHistory);
router.get('/:userId', verifyToken, historyController.getHistory);

module.exports = router;
