const express = require('express')
const router = express.Router()
const MoodHistory = require('../models/MoodHistory')
const verifyToken = require('../middleware/verifyToken')
const getSpotifyToken = require('../utils/spotifyToken')
const axios = require('axios')
const getMoodFromGemini = require('../utils/geminiRequest')
const getStructuredMoodFromGemini = require('../utils/geminiRequestStructured');
const MusicRecommendation = require('../models/MusicRecommendation')
const getRegionMusicSuggestions = require('../utils/geminiRegionRequest');
const searchTrackOnSpotify = require('../utils/spotifySearch');
const getMoodMusicSuggestions = require('../utils/geminiRequestMood');

// Mood'a göre AI Playlist Önerisi
router.get('/ai-playlist/:userId', verifyToken, async (req, res) => {
  try {
    // En sık kullanılan mood'u bul
    const topMood = await MoodHistory.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ])

    if (topMood.length === 0) {
      return res.status(404).json({ message: 'Henüz mood geçmişi yok' })
    }

    const mood = topMood[0]._id

    // Spotify’dan öneri al
    const token = await getSpotifyToken()
    const response = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q: mood, type: 'track', limit: 8 }
    })

    const tracks = response.data.tracks.items

    res.json({ mood, tracks })

  } catch (err) {
    console.error(err)
    res.status(500).json('AI Playlist önerisi alınamadı')
  }
});

//Yapay Zeka Destekli Mood Playlist Backend
router.post('/ai-structured-playlist', verifyToken, async (req, res) => {
  const { message } = req.body;
 
  try {
    const moodData = await getStructuredMoodFromGemini(message);
    if (!moodData) return res.status(500).json('AI yanıtı alınamadı');
 
    const token = await getSpotifyToken();
 
    const query = moodData.suggestedKeywords.join(' ') || moodData.mood;
 
    const response = await axios.get(`${process.env.SPOTIFY_API_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 10 }
    });
 
    const tracks = response.data.tracks.items;

    // MoodHistory oluştur
    const moodHistory = await MoodHistory.create({
      userId: req.user.id,
      mood: moodData.mood,
      trackName: 'AI Playlist Recommendation',
      artistName: 'AI',
      userText: message,
      spotifyUrl: '-',
      date: new Date(),
      isAIRecommendation: true
    });

    // Müzik önerilerini kaydet
    if (tracks && tracks.length > 0) {
      const recommendations = tracks.map(track => ({
        moodHistoryId: moodHistory._id,
        spotifyTrackId: track.id,
        trackName: track.name,
        artistName: track.artists[0]?.name || 'Unknown Artist',
        albumName: track.album?.name || '',
        trackDuration: track.duration_ms,
        popularity: track.popularity,
        spotifyUrl: track.external_urls?.spotify || ''
      }));

      await MusicRecommendation.insertMany(recommendations);
    }
      


    res.json({
      moodInfo: moodData,
      tracks: tracks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('AI playlist yapılamadı');
  }
});

//Mooda göre müzik öneren Spotify
router.get('/mood-music', async (req, res) => {
  const { mood } = req.query;
  if (!mood) return res.status(400).json({ message: 'Duygu adı gerekli' });

  const result = await getMoodMusicSuggestions(mood);
  if (!result) return res.status(500).json({ message: 'Gemini yanıtı alınamadı' });

  // Spotify linkleri ekleniyor
  const tracksWithSpotify = await Promise.all(result.songs.map(async (song) => {
    const spotifyData = await searchTrackOnSpotify(song.trackName, song.artistName);
    return {
      ...song,
      ...spotifyData
    };
  }));

  res.json({
    mood: result.mood,
    tracks: tracksWithSpotify
  });
});

//Bölgeye göre müzik öneren Spotify
router.get('/region-music', async (req, res) => {
  const { region } = req.query;
  if (!region) return res.status(400).json({ message: 'Yöre adı gerekli' });

  const result = await getRegionMusicSuggestions(region);
  if (!result) return res.status(500).json({ message: 'Gemini yanıtı alınamadı' });

  // Spotify linkleri ekleyelim
  const tracksWithSpotify = await Promise.all(result.songs.map(async (song) => {
    const spotifyData = await searchTrackOnSpotify(song.trackName, song.artistName);
    return {
      ...song,
      ...spotifyData
    };
  }));

  res.json({
    region: result.region,
    tracks: tracksWithSpotify
  });
});


module.exports = router
