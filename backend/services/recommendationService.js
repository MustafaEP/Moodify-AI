/**
 * Recommendation Service
 *
 * AI destekli playlist, mood ve bölge bazlı müzik önerisi iş mantığı.
 * Model, utils ve harici API çağrılarını orkestre eder.
 * Controller sadece req/res ile ilgilenir; iş mantığı burada.
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

async function getAiPlaylist(userId) {
  const topMood = await MoodHistory.aggregate([
    { $match: { userId } },
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

  return { mood, tracks: response.data.tracks.items };
}

async function getAiStructuredPlaylist(userId, message) {
  const moodData = await getStructuredMoodFromGemini(message);
  
  const moodInfo = {
    mood: moodData.mood || 'calm',
    reason: moodData.reason || 'Kullanıcının duygu durumu analiz edildi.',
    genre: moodData.genre || 'pop',
    suggestedKeywords: Array.isArray(moodData.suggestedKeywords) 
      ? moodData.suggestedKeywords 
      : [moodData.mood || 'chill'],
  };
  
  
  const token = await getSpotifyToken();
  const query = moodInfo.suggestedKeywords.join(' ') || moodInfo.mood || 'chill';

  const response = await axios.get(`${config.spotify.apiUrl}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: 'track', limit: 10 },
  });

  const tracks = response.data.tracks.items;

  const moodHistory = await MoodHistory.create({
    userId,
    mood: moodInfo.mood,
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

  return { moodInfo, tracks };
}

async function getMoodMusic(mood) {
  if (!mood) throw new AppError('Duygu adı gerekli', 400);

  const result = await getMoodMusicSuggestions(mood);
  const tracksWithSpotify = await Promise.all(
    result.songs.map(async (song) => {
      const spotifyData = await searchTrackOnSpotify(song.trackName, song.artistName);
      return { ...song, ...spotifyData };
    })
  );

  return { mood: result.mood, tracks: tracksWithSpotify };
}

async function getRegionMusic(region) {
  if (!region) throw new AppError('Yöre adı gerekli', 400);

  const result = await getRegionMusicSuggestions(region);
  const tracksWithSpotify = await Promise.all(
    result.songs.map(async (song) => {
      const spotifyData = await searchTrackOnSpotify(song.trackName, song.artistName);
      return { ...song, ...spotifyData };
    })
  );

  return { region: result.region, tracks: tracksWithSpotify };
}

module.exports = {
  getAiPlaylist,
  getAiStructuredPlaylist,
  getMoodMusic,
  getRegionMusic,
};
