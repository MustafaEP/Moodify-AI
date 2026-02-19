/**
 * Recommend Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const recommendController = require('../controllers/recommendController');

const router = express.Router();

router.get('/ai-playlist/:userId', verifyToken, asyncHandler(recommendController.aiPlaylist));
router.post('/ai-structured-playlist', verifyToken, asyncHandler(recommendController.aiStructuredPlaylist));
router.get('/mood-music', asyncHandler(recommendController.moodMusic));
router.get('/region-music', asyncHandler(recommendController.regionMusic));

module.exports = router;
