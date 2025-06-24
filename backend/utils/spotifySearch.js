const axios = require('axios');
const getSpotifyToken = require('./spotifyToken');

const searchTrackOnSpotify = async (trackName, artistName) => {
  try {
    const token = await getSpotifyToken();

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: `${trackName} ${artistName}`,
        type: 'track',
        limit: 1
      }
    });

    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      return {
        spotifyUrl: tracks[0].external_urls.spotify,
        previewUrl: tracks[0].preview_url,
        artistName: tracks[0].artists[0].name,
        durationMs: tracks[0].duration_ms,
        popularity: tracks[0].popularity
      };
    }

    return {
      spotifyUrl: null,
      previewUrl: null,
      artistName: null,
      durationMs: null,
      popularity: null
    };

  } catch (err) {
    console.error('Spotify arama hatası:', err.message);
    return {
      spotifyUrl: null,
      previewUrl: null
    };
  }
};

module.exports = searchTrackOnSpotify;
