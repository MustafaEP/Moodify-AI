const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  trackName: { type: String, required: true },
  artistName: { type: String, required: true },
  spotifyUrl: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
