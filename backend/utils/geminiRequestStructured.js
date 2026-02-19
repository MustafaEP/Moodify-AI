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
 * }>}
 * @throws {AppError} API veya parse hatası
 */
async function getStructuredMoodFromGemini(message) {
  const rawText = await generateContent(PROMPT.structuredMood(message), {
    generationConfig: GENERATION_CONFIG.structured,
  });
  return parseJsonResponse(rawText, { context: 'Duygu analizi' });
}

module.exports = getStructuredMoodFromGemini;
