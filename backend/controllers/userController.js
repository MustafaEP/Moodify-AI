/**
 * User Controller
 * Kullanıcı profil, güncelleme, silme ve şifre doğrulama iş mantığı
 */
const User = require('../models/User');
const MoodHistory = require('../models/MoodHistory');
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.params.userId).select('username email');

    if (!user) return res.status(404).json('Kullanıcı bulunamadı');

    const totalTracks = await MoodHistory.countDocuments({ userId: req.params.userId });

    const topMood = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const topArtist = await MoodHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      { $group: { _id: '$artistName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res.json({
      username: user.username,
      email: user.email,
      totalTracks,
      topMood: topMood[0]?._id || 'Henüz yok',
      topArtist: topArtist[0]?._id || 'Henüz yok',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Profil bilgileri alınamadı');
  }
}

async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.userId);
    await MoodHistory.deleteMany({ userId: req.params.userId });
    await Favorite.deleteMany({ userId: req.params.userId });

    res.status(200).json('Hesap ve tüm veriler silindi');
  } catch (err) {
    console.error(err);
    res.status(500).json('Hesap silme başarısız');
  }
}

async function updateUser(req, res) {
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
}

async function verifyPassword(req, res) {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.params.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json('Şifre hatalı');

    res.status(200).json('Şifre doğrulandı');
  } catch (err) {
    res.status(500).json('Doğrulama hatası');
  }
}

module.exports = {
  getProfile,
  deleteUser,
  updateUser,
  verifyPassword,
};
