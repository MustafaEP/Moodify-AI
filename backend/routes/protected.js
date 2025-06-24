const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Örnek korumalı endpoint
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: `Merhaba ${req.user.email}, MoodMelody AI profiline hoş geldin!`,
    user: req.user
  });
});

module.exports = router;
