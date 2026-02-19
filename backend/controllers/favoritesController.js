/**
 * Favorites Controller
 * Favori ekleme, listeleme, silme ve en çok favorilenen sanatçı iş mantığı
 */
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');

async function add(req, res) {
  try {
    const { trackName, artistName, spotifyUrl } = req.body;
    const newFav = new Favorite({
      userId: req.user.id,
      trackName,
      artistName,
      spotifyUrl,
    });
    await newFav.save();
    res.status(201).json('Favorilere eklendi');
  } catch (err) {
    res.status(500).json(err);
  }
}

async function list(req, res) {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function remove(req, res) {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.status(200).json('Favoriden silindi');
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getTopArtist(req, res) {
  try {
    const { userId } = req.params;

    const result = await Favorite.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$artistName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı için favori sanatçı bulunamadı.' });
    }

    res.json({ topArtist: result[0]._id, count: result[0].count });
  } catch (error) {
    console.error('Top artist hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}

module.exports = {
  add,
  list,
  remove,
  getTopArtist,
};
