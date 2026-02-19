/**
 * User Controller
 * Kullanıcı profil, güncelleme, silme ve şifre doğrulama iş mantığı
 */
const User = require('../models/User');
const MoodHistory = require('../models/MoodHistory');
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

async function getProfile(req, res) {
  const user = await User.findById(req.params.userId).select('username email');

  if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

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
}

async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.params.userId);
  await MoodHistory.deleteMany({ userId: req.params.userId });
  await Favorite.deleteMany({ userId: req.params.userId });

  res.status(200).json('Hesap ve tüm veriler silindi');
}

async function updateUser(req, res) {
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
}

async function verifyPassword(req, res) {
  const { currentPassword } = req.body;
  const user = await User.findById(req.params.userId);

  if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError('Şifre hatalı', 400);

  res.status(200).json('Şifre doğrulandı');
}

module.exports = {
  getProfile,
  deleteUser,
  updateUser,
  verifyPassword,
};
