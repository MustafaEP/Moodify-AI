/**
 * Spotify Controller
 * HTTP katmanı: req/res işleme, service çağrısı
 */
const spotifyService = require('../services/spotifyService');

async function search(req, res) {
  const { q } = req.query;
  const tracks = await spotifyService.searchTracks(q);
  res.json(tracks);
}

async function recommend(req, res) {
  const result = await spotifyService.recommendByMood(req.params.userId);
  res.json(result);
}

module.exports = {
  search,
  recommend,
};
