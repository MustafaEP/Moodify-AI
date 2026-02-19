/**
 * Gemini API sabitleri
 * Model, endpoint ve varsayılan generation parametreleri tek noktadan yönetilir.
 */
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1';
const DEFAULT_MODEL = 'gemini-2.5-flash';

const VALID_MOODS = [
  'happy', 'sad', 'calm', 'energetic', 'angry',
  'dreamy', 'nostalgic', 'romantic', 'anxious', 'hopeful',
  'confident', 'melancholic'
];

const DEFAULT_FALLBACK_MOOD = 'calm';

const GENERATION_CONFIG = {
  simple: { temperature: 0.3, maxOutputTokens: 500 },
  mood:   { temperature: 0.3, maxOutputTokens: 500 },
  region: { temperature: 0.3, maxOutputTokens: 500 },
  structured: { temperature: 0.4, maxOutputTokens: 200, topK: 1 },
};

module.exports = {
  GEMINI_BASE_URL,
  DEFAULT_MODEL,
  VALID_MOODS,
  DEFAULT_FALLBACK_MOOD,
  GENERATION_CONFIG,
};
