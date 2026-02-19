/**
 * Favorites Controller
 * Favori ekleme, listeleme, silme ve en çok favorilenen sanatçı iş mantığı
 */
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

async function add(req, res) {
  const { trackName, artistName, spotifyUrl } = req.body;
  const newFav = new Favorite({
    userId: req.user.id,
    trackName,
    artistName,
    spotifyUrl,
  });
  await newFav.save();
  res.status(201).json('Favorilere eklendi');
}

async function list(req, res) {
  const favorites = await Favorite.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(favorites);
}

async function remove(req, res) {
  await Favorite.findByIdAndDelete(req.params.id);
  res.status(200).json('Favoriden silindi');
}

async function getTopArtist(req, res) {
  const { userId } = req.params;

  const result = await Favorite.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$artistName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (result.length === 0) {
    throw new AppError('Kullanıcı için favori sanatçı bulunamadı.', 404);
  }

  res.json({ topArtist: result[0]._id, count: result[0].count });
}

module.exports = {
  add,
  list,
  remove,
  getTopArtist,
};
