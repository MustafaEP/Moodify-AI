const express = require('express')
const router = express.Router()
const getMoodFromGemini = require('../utils/geminiRequest')
const MoodHistory = require('../models/MoodHistory')
const verifyToken = require('../middleware/verifyToken')
const axios = require('axios')
const getSpotifyToken = require('../utils/spotifyToken')

// Kullanım Dışı Gemini 1.5 ile müzik öneri sistemi
router.post('/predict-and-recommend', verifyToken, async (req, res) => {
  const { message } = req.body

  try {
    const mood = await getMoodFromGemini(message)

    // Spotify’dan mood’a göre şarkı öner
    const token = await getSpotifyToken()
    const response = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q: mood, type: 'track', limit: 5 }
    })

    const tracks = response.data.tracks.items

    // Mood tahminini geçmişe kaydet
    await MoodHistory.create({
      userId: req.user.id,
      mood,
      trackName: 'Gemini AI Mood Prediction',
      artistName: 'AI',
      spotifyUrl: '-'
    })

    res.json({ mood, tracks })

  } catch (err) {
    console.error(err)
    res.status(500).json('Bir şeyler ters gitti')
  }
})

// Tahmin + öneri + geçmiş kaydı
router.post('/musics-from-mood', verifyToken, async (req, res) => {
  const { mood } = req.body

  try {
    const mood = await getMoodFromGemini(mood)

    // Spotify’dan mood’a göre şarkı öner
    const token = await getSpotifyToken()
    const response = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q: mood, type: 'track', limit: 5 }
    })

    const tracks = response.data.tracks.items

    // Mood tahminini geçmişe kaydet
    await MoodHistory.create({
      userId: req.user.id,
      mood,
      trackName: 'Gemini AI Mood Prediction',
      artistName: 'AI',
      spotifyUrl: '-'
    })

    res.json({ mood, tracks })

  } catch (err) {
    console.error(err)
    res.status(500).json('Bir şeyler ters gitti')
  }
})

module.exports = router
