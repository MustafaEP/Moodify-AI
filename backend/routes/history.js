const express = require('express');
const mongoose = require('mongoose');
const MoodHistory = require('../models/MoodHistory');
const verifyToken = require('../middleware/verifyToken');
const MusicRecommendation = require('../models/MusicRecommendation');
const Favorite = require('../models/Favorite');

const router = express.Router();

// Tıklama kaydet
router.post('/', verifyToken, async (req, res) => {
  try {
    const { mood, trackName, artistName } = req.body;
    const newEntry = new MoodHistory({
      userId: req.user.id,
      mood,
      trackName,
      artistName
    });
    await newEntry.save();
    res.status(201).json('Kayıt eklendi');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Kullanıcı geçmişi
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const history = await MoodHistory.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Kullanıcının en çok seçtiği mood
router.get('/stats/:userId', verifyToken, async (req, res) => {
  try {
    const stats = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (stats.length === 0) return res.status(404).json('Geçmiş bulunamadı');

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// En çok dinlenen sanatçı
router.get('/top-artist/:userId', verifyToken, async (req, res) => {
  try {
    const stats = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: "$artistName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (stats.length === 0) return res.status(404).json('Sanatçı verisi yok');

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// En çok favoriye eklenen sanatçı
router.get('/top-favorite-artist/:userId', verifyToken, async (req, res) => {
  try {
    const stats = await Favorite.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: "$artistName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (stats.length === 0) return res.status(404).json('Favori sanatçı bulunamadı');

    res.json(stats[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

// Kullanıcının AI mood tahmin geçmişi
router.get('/ai-mood-history/:userId', verifyToken, async (req, res) => {
  try {
    const history = await MoodHistory.find({
      userId: req.params.userId,
      trackName: 'AI Playlist Recommendation'
    }).sort({ date: -1 })

    res.json(history)
  } catch (err) {
    console.error(err)
    res.status(500).json('Geçmiş alınamadı')
  }
})

router.get('/ai-mood-history/recommendation/:moodHistoryId', verifyToken, async(req, res) => {
  try {
    const recommendations = await MusicRecommendation.find({
      moodHistoryId: req.params.moodHistoryId // _id yerine moodHistoryId olmalı
    }).sort({ popularity: -1 }); // popularity'e göre sırala
    res.json(recommendations);
  } catch (err) {
    console.error(err)
    res.status(500).json('Müzikler alınamadı')
  }
});



module.exports = router;
