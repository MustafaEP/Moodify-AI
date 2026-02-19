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
const AppError = require('../utils/AppError');

async function aiPlaylist(req, res) {
  const topMood = await MoodHistory.aggregate([
    { $match: { userId: req.user.id } },
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (topMood.length === 0) {
    throw new AppError('Henüz mood geçmişi yok', 404);
  }

  const mood = topMood[0]._id;

  const token = await getSpotifyToken();
  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: mood, type: 'track', limit: 8 },
  });

  const tracks = response.data.tracks.items;

  res.json({ mood, tracks });
}

async function aiStructuredPlaylist(req, res) {
  const { message } = req.body;
  const moodData = await getStructuredMoodFromGemini(message);
  if (!moodData) throw new AppError('AI yanıtı alınamadı', 500);

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
}

async function moodMusic(req, res) {
  const { mood } = req.query;
  if (!mood) throw new AppError('Duygu adı gerekli', 400);

  const result = await getMoodMusicSuggestions(mood);
  if (!result) throw new AppError('Gemini yanıtı alınamadı', 500);

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
}

async function regionMusic(req, res) {
  const { region } = req.query;
  if (!region) throw new AppError('Yöre adı gerekli', 400);

  const result = await getRegionMusicSuggestions(region);
  if (!result) throw new AppError('Gemini yanıtı alınamadı', 500);

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
}

module.exports = {
  aiPlaylist,
  aiStructuredPlaylist,
  moodMusic,
  regionMusic,
};
