const mongoose = require('mongoose')

const MoodHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  mood: String,
  trackName: String,
  userText: String,
  artistName: String,
  spotifyUrl: String,
  date: { type: Date, default: Date.now },
  isAIRecommendation: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('MoodHistory', MoodHistorySchema)
