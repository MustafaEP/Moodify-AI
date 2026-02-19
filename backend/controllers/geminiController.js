/**
 * Gemini Controller
 * HTTP katmanı: req/res işleme, service çağrısı
 */
const geminiService = require('../services/geminiService');

async function predictAndRecommend(req, res) {
  const { message } = req.body;
  const result = await geminiService.predictAndRecommend(req.user.id, message);
  res.json(result);
}

async function musicsFromMood(req, res) {
  const { mood } = req.body;
  const result = await geminiService.musicsFromMood(req.user.id, mood);
  res.json(result);
}

module.exports = {
  predictAndRecommend,
  musicsFromMood,
};
