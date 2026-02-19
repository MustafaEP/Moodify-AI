/**
 * Gemini API istemci sarmalayıcısı
 * Tüm Gemini çağrıları bu modül üzerinden yapılır; DRY ve tek noktadan kontrol.
 *
 * @module utils/gemini/client
 */
const axios = require('axios');
const config = require('../../config');
const {
  GEMINI_BASE_URL,
  DEFAULT_MODEL,
  GENERATION_CONFIG,
} = require('./constants');

/**
 * Gemini API'ye istek gönderir
 *
 * @param {string} prompt - LLM'e gönderilecek metin
 * @param {Object} options - İsteğe bağlı ayarlar
 * @param {string} [options.model=DEFAULT_MODEL] - Model adı
 * @param {Object} [options.generationConfig] - Generation config (temperature, maxTokens vb.)
 * @param {number} [options.timeout=15000] - İstek zaman aşımı (ms)
 * @returns {Promise<string>} Ham metin yanıtı
 * @throws {Error} API hatası veya zaman aşımı
 */
async function generateContent(prompt, options = {}) {
  const {
    model = DEFAULT_MODEL,
    generationConfig = GENERATION_CONFIG.simple,
    timeout = 15000,
  } = options;

  const apiKey = config?.gemini?.apiKey;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY ortam değişkeni tanımlı değil');
  }

  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  };

  const response = await axios.post(url, body, {
    timeout,
    headers: { 'Content-Type': 'application/json' },
  });

  const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API geçerli metin yanıtı döndürmedi');
  }

  return text;
}

module.exports = { generateContent };
