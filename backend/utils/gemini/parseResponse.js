/**
 * Gemini API JSON yanıtlarını parse etmek için yardımcı fonksiyonlar
 */
const JSON_BLOCK_REGEX = /```(?:json)?\s*([\s\S]*?)```/;
const FALLBACK_REGEX = /```(?:json)?|```/g;

/**
 * AI yanıtından JSON objesini çıkarır
 * Markdown code block'ları temizler, parse eder
 *
 * @param {string} rawText - Ham AI yanıtı
 * @returns {Object|null} Parse edilmiş obje veya null
 */
function parseJsonResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  let cleanText = rawText.trim();

  const match = cleanText.match(JSON_BLOCK_REGEX);
  if (match) {
    cleanText = match[1].trim();
  } else {
    cleanText = cleanText.replace(FALLBACK_REGEX, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch {
    return null;
  }
}

module.exports = { parseJsonResponse };
