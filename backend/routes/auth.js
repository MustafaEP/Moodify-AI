/**
 * Auth Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/validate-token', verifyToken, authController.validateToken);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
