/**
 * Yöresel müzik önerisi - Gemini ile bölge bazlı şarkı listesi
 * @module utils/geminiRegionRequest
 */
const { generateContent } = require('./gemini/client');
const { parseJsonResponse } = require('./gemini/parseResponse');
const { PROMPT } = require('./gemini/prompts');
const { GENERATION_CONFIG } = require('./gemini/constants');

/**
 * Verilen yöre/bölgeye ait geleneksel müzik önerileri alır
 *
 * @param {string} region - Yöre adı (örn: Karadeniz, Ege)
 * @returns {Promise<{region: string, songs: Array<{trackName: string, artistName: string}>}|null>}
 */
async function getRegionMusicSuggestions(region) {
  try {
    const rawText = await generateContent(PROMPT.regionMusic(region), {
      generationConfig: GENERATION_CONFIG.region,
    });
    return parseJsonResponse(rawText);
  } catch (err) {
    console.error('[Gemini] Yöresel müzik hatası:', err.message);
    return null;
  }
}

module.exports = getRegionMusicSuggestions;
