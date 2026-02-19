/**
 * History Controller
 * Mood geçmişi CRUD, istatistikler, AI öneri geçmişi iş mantığı
 */
const mongoose = require('mongoose');
const MoodHistory = require('../models/MoodHistory');
const MusicRecommendation = require('../models/MusicRecommendation');
const Favorite = require('../models/Favorite');

async function create(req, res) {
  try {
    const { mood, trackName, artistName } = req.body;
    const newEntry = new MoodHistory({
      userId: req.user.id,
      mood,
      trackName,
      artistName,
    });
    await newEntry.save();
    res.status(201).json('Kayıt eklendi');
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getHistory(req, res) {
  try {
    const history = await MoodHistory.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getStats(req, res) {
  try {
    const stats = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (stats.length === 0) return res.status(404).json('Geçmiş bulunamadı');

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getTopArtist(req, res) {
  try {
    const stats = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: '$artistName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (stats.length === 0) return res.status(404).json('Sanatçı verisi yok');

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getTopFavoriteArtist(req, res) {
  try {
    const stats = await Favorite.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: '$artistName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (stats.length === 0) return res.status(404).json('Favori sanatçı bulunamadı');

    res.json(stats[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

async function getAiMoodHistory(req, res) {
  try {
    const history = await MoodHistory.find({
      userId: req.params.userId,
      trackName: 'AI Playlist Recommendation',
    }).sort({ date: -1 });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json('Geçmiş alınamadı');
  }
}

async function getAiMoodRecommendations(req, res) {
  try {
    const recommendations = await MusicRecommendation.find({
      moodHistoryId: req.params.moodHistoryId,
    }).sort({ popularity: -1 });

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json('Müzikler alınamadı');
  }
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
