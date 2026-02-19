/**
 * Auth Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/validate-token', verifyToken, authController.validateToken);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
