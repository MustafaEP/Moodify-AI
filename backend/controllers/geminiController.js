/**
 * Gemini Controller
 * Gemini AI ile mood tahmini ve müzik önerisi iş mantığı
 */
const getMoodFromGemini = require('../utils/geminiRequest');
const MoodHistory = require('../models/MoodHistory');
const axios = require('axios');
const getSpotifyToken = require('../utils/spotifyToken');
const config = require('../config');

async function predictAndRecommend(req, res) {
  const { message } = req.body;
  const mood = await getMoodFromGemini(message);

  const token = await getSpotifyToken();
  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: mood, type: 'track', limit: 5 },
  });

  const tracks = response.data.tracks.items;

  await MoodHistory.create({
    userId: req.user.id,
    mood,
    trackName: 'Gemini AI Mood Prediction',
    artistName: 'AI',
    spotifyUrl: '-',
  });

  res.json({ mood, tracks });
}

async function musicsFromMood(req, res) {
  const { mood: moodInput } = req.body;
  const moodPredicted = await getMoodFromGemini(moodInput);

  const token = await getSpotifyToken();
  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: moodPredicted, type: 'track', limit: 5 },
  });

  const tracks = response.data.tracks.items;

  await MoodHistory.create({
    userId: req.user.id,
    mood: moodPredicted,
    trackName: 'Gemini AI Mood Prediction',
    artistName: 'AI',
    spotifyUrl: '-',
  });

  res.json({ mood: moodPredicted, tracks });
}

module.exports = {
  predictAndRecommend,
  musicsFromMood,
};
