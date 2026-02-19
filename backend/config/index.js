/**
 * Merkezi Konfigürasyon Modülü
 *
 * Tüm ortam değişkenleri burada toplanır.
 * - Varsayılan değerler tanımlanabilir
 * - Uygulama başlarken kritik değişkenler kontrol edilebilir
 * - process.env tek noktadan erişim
 */

require('dotenv').config();

const config = {
  // Sunucu
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Veritabanı
  mongoUri: process.env.MONGO_URI,

  // JWT Kimlik Doğrulama
  jwtSecret: process.env.JWT_SECRET,

  // Spotify API
  spotify: {
    tokenUrl: process.env.SPOTIFY_TOKEN_URL,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    apiUrl: process.env.SPOTIFY_API_URL || 'https://api.spotify.com/v1',
  },

  // Google Gemini API
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};

/**
 * Uygulama başlarken kritik değişkenleri kontrol eder.
 * Eksik varsa uyarı verir (production'da hata fırlatılabilir).
 */
function validateConfig() {
  const required = [
    { key: 'mongoUri', name: 'MONGO_URI' },
    { key: 'jwtSecret', name: 'JWT_SECRET' },
  ];

  const missing = required.filter((r) => !config[r.key]);

  if (missing.length > 0) {
    console.warn(
      '[Config] Eksik ortam değişkenleri (.env dosyasını kontrol edin):',
      missing.map((m) => m.name).join(', ')
    );
  }
}

validateConfig();

module.exports = config;
