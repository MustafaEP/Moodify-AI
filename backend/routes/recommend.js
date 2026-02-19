/**
 * Recommend Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const recommendController = require('../controllers/recommendController');

const router = express.Router();

router.get('/ai-playlist/:userId', verifyToken, recommendController.aiPlaylist);
router.post('/ai-structured-playlist', verifyToken, recommendController.aiStructuredPlaylist);
router.get('/mood-music', recommendController.moodMusic);
router.get('/region-music', recommendController.regionMusic);

module.exports = router;
