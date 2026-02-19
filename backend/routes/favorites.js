/**
 * Favorites Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const favoritesController = require('../controllers/favoritesController');

const router = express.Router();

router.post('/', verifyToken, asyncHandler(favoritesController.add));
router.get('/top-artist/:userId', asyncHandler(favoritesController.getTopArtist));
router.get('/:userId', verifyToken, asyncHandler(favoritesController.list));
router.delete('/:id', verifyToken, asyncHandler(favoritesController.remove));

module.exports = router;
