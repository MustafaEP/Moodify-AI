const mongoose = require('mongoose')

const MusicRecommendationSchema = new mongoose.Schema({
  moodHistoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'MoodHistory'
  },
  spotifyTrackId: {
    type: String,
    required: true
  },
  trackName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  albumName: String,
  trackDuration: Number, // milliseconds
  popularity: Number, // 0-100
  spotifyUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Index'ler performans için
MusicRecommendationSchema.index({ moodHistoryId: 1 })
MusicRecommendationSchema.index({ spotifyTrackId: 1 })

module.exports = mongoose.model('MusicRecommendation', MusicRecommendationSchema)