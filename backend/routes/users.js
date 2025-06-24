const express = require('express');
const User = require('../models/User');
const MoodHistory = require('../models/MoodHistory');
const verifyToken = require('../middleware/verifyToken');
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Kullanıcı profil bilgileri ve istatistik
router.get('/profile/:userId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username email');

    if (!user) return res.status(404).json('Kullanıcı bulunamadı');

    const totalTracks = await MoodHistory.countDocuments({ userId: req.params.userId });

    const topMood = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const topArtist = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: "$artistName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      username: user.username,
      email: user.email,
      totalTracks,
      topMood: topMood[0]?._id || 'Henüz yok',
      topArtist: topArtist[0]?._id || 'Henüz yok'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Profil bilgileri alınamadı');
  }
});


// Kullanıcı hesabı ve bağlı verileri sil
router.delete('/delete/:userId', verifyToken, async (req, res) => {
  try {
    // Kullanıcı sil
    await User.findByIdAndDelete(req.params.userId);
    // Mood geçmişi sil
    await MoodHistory.deleteMany({ userId: req.params.userId });
    // Favoriler sil
    await Favorite.deleteMany({ userId: req.params.userId });

    res.status(200).json('Hesap ve tüm veriler silindi');
  } catch (err) {
    console.error(err);
    res.status(500).json('Hesap silme başarısız');
  }
});

// Kullanıcı bilgilerini güncelle
router.put('/update/:userId', verifyToken, async (req, res) => {
  try {
    const updates = {};

    if (req.body.username) updates.username = req.body.username;
    if (req.body.email) updates.email = req.body.email;

    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      updates.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json('Güncelleme başarısız');
  }
});

// Mevcut şifre kontrolü
router.post('/verify-password/:userId', verifyToken, async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.params.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json('Şifre hatalı');

    res.status(200).json('Şifre doğrulandı');
  } catch (err) {
    res.status(500).json('Doğrulama hatası');
  }
});


module.exports = router;
