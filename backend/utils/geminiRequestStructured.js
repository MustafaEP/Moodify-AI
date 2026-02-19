/**
 * Yapılandırılmış duygu analizi - mood, reason, genre, keywords
 * @module utils/geminiRequestStructured
 */
const { generateContent } = require('./gemini/client');
const { parseJsonResponse } = require('./gemini/parseResponse');
const { PROMPT } = require('./gemini/prompts');
const { GENERATION_CONFIG } = require('./gemini/constants');

/**
 * Kullanıcı mesajından detaylı duygu analizi yapar
 *
 * @param {string} message - Kullanıcının yazdığı mesaj
 * @returns {Promise<{
 *   mood: string,
 *   reason: string,
 *   genre: string,
 *   suggestedKeywords: string[]
 * }|null>}
 */
async function getStructuredMoodFromGemini(message) {
  try {
    const rawText = await generateContent(PROMPT.structuredMood(message), {
      generationConfig: GENERATION_CONFIG.structured,
    });
    return parseJsonResponse(rawText);
  } catch (err) {
    console.error('[Gemini] Structured mood hatası:', err.message);
    return null;
  }
}

module.exports = getStructuredMoodFromGemini;
