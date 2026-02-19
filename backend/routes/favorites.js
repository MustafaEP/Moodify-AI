/**
 * Favorites Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const favoritesController = require('../controllers/favoritesController');

const router = express.Router();

router.post('/', verifyToken, favoritesController.add);
router.get('/top-artist/:userId', favoritesController.getTopArtist);
router.get('/:userId', verifyToken, favoritesController.list);
router.delete('/:id', verifyToken, favoritesController.remove);

module.exports = router;
