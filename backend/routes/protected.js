/**
 * Protected Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const protectedController = require('../controllers/protectedController');

const router = express.Router();

router.get('/profile', verifyToken, protectedController.getProfile);

module.exports = router;
