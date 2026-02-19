/**
 * Spotify track araması - şarkı adı ve sanatçı ile arama
 * @module utils/spotifySearch
 */
const axios = require('axios');
const getSpotifyToken = require('./spotifyToken');
const config = require('../config');

/** Hata durumunda dönen varsayılan obje */
const EMPTY_TRACK_RESULT = {
  spotifyUrl: null,
  previewUrl: null,
  artistName: null,
  durationMs: null,
  popularity: null,
};

/**
 * Şarkı adı ve sanatçı ile Spotify'da track arar
 *
 * @param {string} trackName - Şarkı adı
 * @param {string} artistName - Sanatçı adı
 * @returns {Promise<{
 *   spotifyUrl: string|null,
 *   previewUrl: string|null,
 *   artistName: string|null,
 *   durationMs: number|null,
 *   popularity: number|null
 * }>}
 */
async function searchTrackOnSpotify(trackName, artistName) {
  try {
    const token = await getSpotifyToken();
    const apiUrl = config?.spotify?.apiUrl || 'https://api.spotify.com/v1';
    const query = [trackName, artistName].filter(Boolean).join(' ');

    if (!query) {
      return { ...EMPTY_TRACK_RESULT };
    }

    const response = await axios.get(`${apiUrl}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 1 },
      timeout: 8000,
    });

    const items = response?.data?.tracks?.items ?? [];
    if (items.length === 0) {
      return { ...EMPTY_TRACK_RESULT };
    }

    const track = items[0];
    return {
      spotifyUrl: track.external_urls?.spotify ?? null,
      previewUrl: track.preview_url ?? null,
      artistName: track.artists?.[0]?.name ?? null,
      durationMs: track.duration_ms ?? null,
      popularity: track.popularity ?? null,
    };
  } catch (err) {
    console.error('[Spotify] Arama hatası:', err.message);
    return { spotifyUrl: null, previewUrl: null };
  }
}

module.exports = searchTrackOnSpotify;
