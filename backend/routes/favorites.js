const express = require('express');
const Favorite = require('../models/Favorite');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Favoriye ekle
router.post('/', verifyToken, async (req, res) => {
  try {
    const { trackName, artistName, spotifyUrl } = req.body;
    const newFav = new Favorite({
      userId: req.user.id,
      trackName,
      artistName,
      spotifyUrl
    });
    await newFav.save();
    res.status(201).json('Favorilere eklendi');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Favori listesi
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Favoriden sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.status(200).json('Favoriden silindi');
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
