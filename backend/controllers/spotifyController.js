/**
 * Spotify Controller
 * Spotify arama ve mood bazlı öneri iş mantığı
 */
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyToken');
const MoodHistory = require('../models/MoodHistory');
const mongoose = require('mongoose');
const config = require('../config');
const AppError = require('../utils/AppError');

async function search(req, res) {
  const token = await getSpotifyToken();
  const { q } = req.query;

  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q, type: 'track', limit: 10 },
  });

  res.json(response.data.tracks.items);
}

async function recommend(req, res) {
  const stats = await MoodHistory.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (stats.length === 0) throw new AppError('Mood verisi bulunamadı', 404);

  const mostUsedMood = stats[0]._id;
  const token = await getSpotifyToken();

  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: mostUsedMood, type: 'track', limit: 5 },
  });

  res.json({
    mood: mostUsedMood,
    tracks: response.data.tracks.items,
  });
}

module.exports = {
  search,
  recommend,
};
