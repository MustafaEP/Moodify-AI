/**
 * Gemini Service
 *
 * Gemini AI ile mood tahmini ve Spotify entegrasyonu.
 * Mood geçmişi kaydı burada yapılır.
 */
const getMoodFromGemini = require('../utils/geminiRequest');
const MoodHistory = require('../models/MoodHistory');
const spotifyService = require('./spotifyService');

async function predictAndRecommend(userId, message) {
  const mood = await getMoodFromGemini(message);
  const tracks = await spotifyService.searchTracks(mood, 5);

  await MoodHistory.create({
    userId,
    mood,
    trackName: 'Gemini AI Mood Prediction',
    artistName: 'AI',
    spotifyUrl: '-',
  });

  return { mood, tracks };
}

async function musicsFromMood(userId, moodInput) {
  const moodPredicted = await getMoodFromGemini(moodInput);
  const tracks = await spotifyService.searchTracks(moodPredicted, 5);

  await MoodHistory.create({
    userId,
    mood: moodPredicted,
    trackName: 'Gemini AI Mood Prediction',
    artistName: 'AI',
    spotifyUrl: '-',
  });

  return { mood: moodPredicted, tracks };
}

module.exports = {
  predictAndRecommend,
  musicsFromMood,
};
