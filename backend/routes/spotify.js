/**
 * Spotify Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const spotifyController = require('../controllers/spotifyController');

const router = express.Router();

router.get('/search', spotifyController.search);
router.get('/recommend/:userId', verifyToken, spotifyController.recommend);

module.exports = router;
