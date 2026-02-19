/**
 * Users Routes
 * HTTP katmanı: URL → middleware → controller
 */
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/profile/:userId', verifyToken, userController.getProfile);
router.delete('/delete/:userId', verifyToken, userController.deleteUser);
router.put('/update/:userId', verifyToken, userController.updateUser);
router.post('/verify-password/:userId', verifyToken, userController.verifyPassword);

module.exports = router;
