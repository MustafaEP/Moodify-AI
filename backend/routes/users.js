/**
 * Users Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/profile/:userId', verifyToken, asyncHandler(userController.getProfile));
router.delete('/delete/:userId', verifyToken, asyncHandler(userController.deleteUser));
router.put('/update/:userId', verifyToken, asyncHandler(userController.updateUser));
router.post('/verify-password/:userId', verifyToken, asyncHandler(userController.verifyPassword));

module.exports = router;
