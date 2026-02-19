/**
 * History Controller
 * Mood geçmişi CRUD, istatistikler, AI öneri geçmişi iş mantığı
 */
const mongoose = require('mongoose');
const MoodHistory = require('../models/MoodHistory');
const MusicRecommendation = require('../models/MusicRecommendation');
const Favorite = require('../models/Favorite');
const AppError = require('../utils/AppError');

async function create(req, res) {
  const { mood, trackName, artistName } = req.body;
  const newEntry = new MoodHistory({
    userId: req.user.id,
    mood,
    trackName,
    artistName,
  });
  await newEntry.save();
  res.status(201).json('Kayıt eklendi');
}

async function getHistory(req, res) {
  const history = await MoodHistory.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(history);
}

async function getStats(req, res) {
  const stats = await MoodHistory.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (stats.length === 0) throw new AppError('Geçmiş bulunamadı', 404);

  res.json(stats[0]);
}

async function getTopArtist(req, res) {
  const stats = await MoodHistory.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
    { $group: { _id: '$artistName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (stats.length === 0) throw new AppError('Sanatçı verisi yok', 404);

  res.json(stats[0]);
}

async function getTopFavoriteArtist(req, res) {
  const stats = await Favorite.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
    { $group: { _id: '$artistName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (stats.length === 0) throw new AppError('Favori sanatçı bulunamadı', 404);

  res.json(stats[0]);
}

async function getAiMoodHistory(req, res) {
  const history = await MoodHistory.find({
    userId: req.params.userId,
    trackName: 'AI Playlist Recommendation',
  }).sort({ date: -1 });

  res.json(history);
}

async function getAiMoodRecommendations(req, res) {
  const recommendations = await MusicRecommendation.find({
    moodHistoryId: req.params.moodHistoryId,
  }).sort({ popularity: -1 });

  res.json(recommendations);
}

module.exports = {
  create,
  getHistory,
  getStats,
  getTopArtist,
  getTopFavoriteArtist,
  getAiMoodHistory,
  getAiMoodRecommendations,
};
