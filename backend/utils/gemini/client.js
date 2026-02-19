/**
 * Gemini API istemci sarmalayıcısı
 * Tüm Gemini çağrıları bu modül üzerinden yapılır; DRY ve tek noktadan kontrol.
 *
 * @module utils/gemini/client
 */
const axios = require('axios');
const config = require('../../config');
const AppError = require('../AppError');
const {
  GEMINI_BASE_URL,
  DEFAULT_MODEL,
  GENERATION_CONFIG,
} = require('./constants');

/**
 * Axios/Gemini hatalarını kullanıcıya uygun AppError'a dönüştürür
 * @private
 */
function wrapGeminiError(err, context = 'Gemini') {
  // Axios response hatası (HTTP 4xx, 5xx)
  const status = err.response?.status;
  const data = err.response?.data;
  const apiMessage = data?.error?.message || data?.message;

  if (status === 429) {
    throw new AppError(
      'AI istek limiti aşıldı. Lütfen birkaç dakika bekleyip tekrar deneyin.',
      429
    );
  }
  if (status === 401 || status === 403) {
    throw new AppError(
      'Geçersiz veya yetkisiz API anahtarı. Lütfen GEMINI_API_KEY ayarını kontrol edin.',
      502
    );
  }
  if (status === 404) {
    throw new AppError(
      `AI modeli bulunamadı. (${apiMessage || 'Model mevcut değil'})`,
      502
    );
  }
  if (status === 400) {
    throw new AppError(
      `AI isteği geçersiz. ${apiMessage || err.message}`,
      400
    );
  }
  if (status >= 500 && status < 600) {
    throw new AppError(
      'AI servisi geçici olarak kullanılamıyor. Lütfen biraz sonra tekrar deneyin.',
      502
    );
  }

  // Timeout
  if (err.code === 'ECONNABORTED') {
    throw new AppError(
      'AI yanıtı zaman aşımına uğradı. Lütfen tekrar deneyin.',
      504
    );
  }

  // Ağ hataları
  if (err.code === 'ENOTFOUND' || err.code === 'ENOTCONN' || err.code === 'ECONNREFUSED') {
    throw new AppError(
      'AI servisine bağlanılamadı. İnternet bağlantınızı kontrol edin.',
      503
    );
  }

  // Genel fallback
  const detail = apiMessage || err.message;
  throw new AppError(
    `${context} hatası: ${detail}`,
    502
  );
}

/**
 * Gemini API'ye istek gönderir
 *
 * @param {string} prompt - LLM'e gönderilecek metin
 * @param {Object} options - İsteğe bağlı ayarlar
 * @param {string} [options.model=DEFAULT_MODEL] - Model adı
 * @param {Object} [options.generationConfig] - Generation config (temperature, maxTokens vb.)
 * @param {number} [options.timeout=15000] - İstek zaman aşımı (ms)
 * @returns {Promise<string>} Ham metin yanıtı
 * @throws {AppError} API hatası veya zaman aşımı
 */
async function generateContent(prompt, options = {}) {
  const {
    model = DEFAULT_MODEL,
    generationConfig = GENERATION_CONFIG.simple,
    timeout = 15000,
  } = options;

  const apiKey = config?.gemini?.apiKey;
  if (!apiKey) {
    throw new AppError(
      'GEMINI_API_KEY ortam değişkeni tanımlı değil. Lütfen .env dosyasını kontrol edin.',
      500
    );
  }

  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  };

  try {
    const response = await axios.post(url, body, {
      timeout,
      headers: { 'Content-Type': 'application/json' },
    });

    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = response?.data?.candidates?.[0]?.finishReason;
      const detail = blockReason
        ? `AI yanıt üretmedi (sebep: ${blockReason})`
        : 'AI geçerli metin yanıtı döndürmedi.';
      throw new AppError(detail, 502);
    }

    return text;
  } catch (err) {
    if (err instanceof AppError) throw err;
    wrapGeminiError(err);
  }
}

module.exports = { generateContent };
