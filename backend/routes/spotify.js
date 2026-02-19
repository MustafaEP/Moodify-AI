/**
 * Spotify Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

router.get('/search', asyncHandler(spotifyController.search));
router.get('/recommend/:userId', verifyToken, asyncHandler(spotifyController.recommend));

module.exports = router;
