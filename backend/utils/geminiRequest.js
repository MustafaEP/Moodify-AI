/**
 * Basit mood çıkarımı - kullanıcı mesajından tek kelime mood döner
 * @module utils/geminiRequest
 */
const { generateContent } = require('./gemini/client');
const { PROMPT } = require('./gemini/prompts');
const { DEFAULT_FALLBACK_MOOD, GENERATION_CONFIG } = require('./gemini/constants');

/**
 * Kullanıcı mesajından ruh halini (mood) çıkarır
 *
 * @param {string} message - Kullanıcının yazdığı mesaj
 * @returns {Promise<string>} Mood kelimesi (happy, sad, calm, energetic) veya varsayılan
 */
async function getMoodFromGemini(message) {
  try {
    const text = await generateContent(PROMPT.simpleMood(message), {
      generationConfig: GENERATION_CONFIG.simple,
    });
    return text.trim();
  } catch (err) {
    console.error('[Gemini] Basit mood hatası:', err.message);
    return DEFAULT_FALLBACK_MOOD;
  }
}

module.exports = getMoodFromGemini;
