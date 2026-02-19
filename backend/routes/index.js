/**
 * Route Index
 * Tüm API route'larını merkezi olarak export eder.
 * server.js daha temiz kalır.
 */
const express = require('express');
const authRoute = require('./auth');
const protectedRoute = require('./protected');
const spotifyRoute = require('./spotify');
const historyRoute = require('./history');
const userRoute = require('./users');
const favoritesRoute = require('./favorites');
const geminiRoute = require('./gemini');
const recommendRoute = require('./recommend');

const router = express.Router();

// Health check (monitoring, load balancer)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoute);
router.use('/protected', protectedRoute);
router.use('/spotify', spotifyRoute);
router.use('/history', historyRoute);
router.use('/users', userRoute);
router.use('/favorites', favoritesRoute);
router.use('/gemini', geminiRoute);
router.use('/recommend', recommendRoute);

module.exports = router;
