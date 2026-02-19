/**
 * Recommend Controller
 * AI destekli playlist önerisi, mood ve bölge bazlı müzik önerisi iş mantığı
 */
const MoodHistory = require('../models/MoodHistory');
const MusicRecommendation = require('../models/MusicRecommendation');
const getSpotifyToken = require('../utils/spotifyToken');
const axios = require('axios');
const getStructuredMoodFromGemini = require('../utils/geminiRequestStructured');
const getRegionMusicSuggestions = require('../utils/geminiRegionRequest');
const searchTrackOnSpotify = require('../utils/spotifySearch');
const getMoodMusicSuggestions = require('../utils/geminiRequestMood');
const config = require('../config');

async function aiPlaylist(req, res) {
  try {
    const topMood = await MoodHistory.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (topMood.length === 0) {
      return res.status(404).json({ message: 'Henüz mood geçmişi yok' });
    }

    const mood = topMood[0]._id;

    const token = await getSpotifyToken();
    const response = await axios.get(`${config.spotify.apiUrl}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: mood, type: 'track', limit: 8 },
    });

    const tracks = response.data.tracks.items;

    res.json({ mood, tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json('AI Playlist önerisi alınamadı');
  }
}

async function aiStructuredPlaylist(req, res) {
  try {
    const { message } = req.body;
    const moodData = await getStructuredMoodFromGemini(message);
    if (!moodData) return res.status(500).json('AI yanıtı alınamadı');

    const token = await getSpotifyToken();
    const query = moodData.suggestedKeywords.join(' ') || moodData.mood;

    const response = await axios.get(`${config.spotify.apiUrl}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 10 },
    });

    const tracks = response.data.tracks.items;

    const moodHistory = await MoodHistory.create({
      userId: req.user.id,
      mood: moodData.mood,
      trackName: 'AI Playlist Recommendation',
      artistName: 'AI',
      userText: message,
      spotifyUrl: '-',
      date: new Date(),
      isAIRecommendation: true,
    });

    if (tracks && tracks.length > 0) {
      const recommendations = tracks.map((track) => ({
        moodHistoryId: moodHistory._id,
        spotifyTrackId: track.id,
        trackName: track.name,
        artistName: track.artists[0]?.name || 'Unknown Artist',
        albumName: track.album?.name || '',
        trackDuration: track.duration_ms,
        popularity: track.popularity,
        spotifyUrl: track.external_urls?.spotify || '',
      }));

      await MusicRecommendation.insertMany(recommendations);
    }

    res.json({
      moodInfo: moodData,
      tracks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('AI playlist yapılamadı');
  }
}

async function moodMusic(req, res) {
  try {
    const { mood } = req.query;
    if (!mood) return res.status(400).json({ message: 'Duygu adı gerekli' });

    const result = await getMoodMusicSuggestions(mood);
    if (!result) return res.status(500).json({ message: 'Gemini yanıtı alınamadı' });

    const tracksWithSpotify = await Promise.all(
      result.songs.map(async (song) => {
        const spotifyData = await searchTrackOnSpotify(song.trackName, song.artistName);
        return { ...song, ...spotifyData };
      })
    );

    res.json({
      mood: result.mood,
      tracks: tracksWithSpotify,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Bir şeyler ters gitti');
  }
}

async function regionMusic(req, res) {
  try {
    const { region } = req.query;
    if (!region) return res.status(400).json({ message: 'Yöre adı gerekli' });

    const result = await getRegionMusicSuggestions(region);
    if (!result) return res.status(500).json({ message: 'Gemini yanıtı alınamadı' });

    const tracksWithSpotify = await Promise.all(
      result.songs.map(async (song) => {
        const spotifyData = await searchTrackOnSpotify(song.trackName, song.artistName);
        return { ...song, ...spotifyData };
      })
    );

    res.json({
      region: result.region,
      tracks: tracksWithSpotify,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Bir şeyler ters gitti');
  }
}

module.exports = {
  aiPlaylist,
  aiStructuredPlaylist,
  moodMusic,
  regionMusic,
};
