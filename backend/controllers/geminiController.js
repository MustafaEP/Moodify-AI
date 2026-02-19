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
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json('Bir şeyler ters gitti');
  }
}

async function musicsFromMood(req, res) {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json('Bir şeyler ters gitti');
  }
}

module.exports = {
  predictAndRecommend,
  musicsFromMood,
};
