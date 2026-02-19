/**
 * Gemini API JSON yanıtlarını parse etmek için yardımcı fonksiyonlar
 */
const AppError = require('../AppError');
const JSON_BLOCK_REGEX = /```(?:json)?\s*([\s\S]*?)```/;
const FALLBACK_REGEX = /```(?:json)?|```/g;

/**
 * AI yanıtından JSON objesini çıkarır
 * Markdown code block'ları temizler, parse eder
 *
 * @param {string} rawText - Ham AI yanıtı
 * @param {Object} [options] - Seçenekler
 * @param {string} [options.context] - Hata mesajında kullanılacak bağlam (örn: "Mood müzik")
 * @returns {Object} Parse edilmiş obje
 * @throws {AppError} Parse başarısız olduğunda
 */
function parseJsonResponse(rawText, options = {}) {
  const { context = 'AI yanıtı' } = options;

  if (!rawText || typeof rawText !== 'string') {
    throw new AppError(
      `${context}: Boş veya geçersiz yanıt alındı.`,
      502
    );
  }

  let cleanText = rawText.trim();

  const match = cleanText.match(JSON_BLOCK_REGEX);
  if (match) {
    cleanText = match[1].trim();
  } else {
    cleanText = cleanText.replace(FALLBACK_REGEX, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (parseErr) {
    const parseDetail = parseErr.message || 'JSON ayrıştırma hatası';
    throw new AppError(
      `${context}: Geçerli JSON alınamadı (${parseDetail}). AI yanıtı işlenemedi, lütfen tekrar deneyin.`,
      502
    );
  }
}

module.exports = { parseJsonResponse };
