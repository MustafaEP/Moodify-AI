/**
 * Mood bazlı müzik önerisi - Gemini ile şarkı listesi
 * @module utils/geminiRequestMood
 */
const { generateContent } = require('./gemini/client');
const { parseJsonResponse } = require('./gemini/parseResponse');
const { PROMPT } = require('./gemini/prompts');
const { GENERATION_CONFIG } = require('./gemini/constants');

/**
 * Verilen mood'a uygun müzik önerileri alır
 *
 * @param {string} mood - Duygu adı (örn: happy, sad)
 * @returns {Promise<{mood: string, songs: Array<{trackName: string, artistName: string}>}>}
 * @throws {AppError} API veya parse hatası
 */
async function getMoodMusicSuggestions(mood) {
  const rawText = await generateContent(PROMPT.moodMusic(mood), {
    generationConfig: GENERATION_CONFIG.mood,
  });
  return parseJsonResponse(rawText, { context: 'Mood müzik önerisi' });
}

module.exports = getMoodMusicSuggestions;
