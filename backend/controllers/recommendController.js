/**
 * Recommend Controller
 * HTTP katmanı: req/res işleme, service çağrısı
 */
const recommendationService = require('../services/recommendationService');

async function aiPlaylist(req, res) {
  const result = await recommendationService.getAiPlaylist(req.user.id);
  res.json(result);
}

async function aiStructuredPlaylist(req, res) {
  const { message } = req.body;
  console.log("message: ", message);
  const result = await recommendationService.getAiStructuredPlaylist(req.user.id, message);
  console.log("result: ", result);
  res.json(result);
}

async function moodMusic(req, res) {
  const { mood } = req.query;
  const result = await recommendationService.getMoodMusic(mood);
  res.json(result);
}

async function regionMusic(req, res) {
  const { region } = req.query;
  const result = await recommendationService.getRegionMusic(region);
  res.json(result);
}

module.exports = {
  aiPlaylist,
  aiStructuredPlaylist,
  moodMusic,
  regionMusic,
};
