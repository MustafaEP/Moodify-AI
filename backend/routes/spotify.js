const express = require('express');
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyToken');
const MoodHistory = require('../models/MoodHistory');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const { q } = req.query;

    const response = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q, type: 'track', limit: 10 }
    });
   

    res.json(response.data.tracks.items);
  } catch (err) {
    console.error(err);
    res.status(500).json('Spotify API hatası');
  }
});

// Kullanıcının en çok seçtiği mood'a göre öneri
router.get('/recommend/:userId', verifyToken, async (req, res) => {
  try {
    // En çok kullanılan mood'u bul
    const stats = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (stats.length === 0) return res.status(404).json('Mood verisi bulunamadı');

    const mostUsedMood = stats[0]._id;

    // Spotify token al
    const token = await getSpotifyToken();

    // Mood'a göre Spotify'dan şarkı çek
    const response = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q: mostUsedMood, type: 'track', limit: 5 }
    });

    res.json({
      mood: mostUsedMood,
      tracks: response.data.tracks.items
    });

  } catch (err) {
    console.error(err);
    res.status(500).json('Öneri alınamadı');
  }
});

module.exports = router;
