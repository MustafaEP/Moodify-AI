/**
 * Spotify Service
 *
 * Spotify API ile arama ve mood bazlı öneri iş mantığı.
 * Utils ve model ile entegre çalışır.
 */
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyToken');
const MoodHistory = require('../models/MoodHistory');
const mongoose = require('mongoose');
const config = require('../config');
const AppError = require('../utils/AppError');

async function searchTracks(query, limit = 10) {
  const token = await getSpotifyToken();
  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: 'track', limit },
  });
  return response.data.tracks.items;
}

async function recommendByMood(userId) {
  const stats = await MoodHistory.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (stats.length === 0) throw new AppError('Mood verisi bulunamadı', 404);

  const mostUsedMood = stats[0]._id;
  const tracks = await searchTracks(mostUsedMood, 5);

  return { mood: mostUsedMood, tracks };
}

module.exports = {
  searchTracks,
  recommendByMood,
};
