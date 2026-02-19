/**
 * Spotify API token yönetimi (Client Credentials flow)
 * Token cache'lenir; süre dolmadan yeniden istek yapılmaz.
 *
 * @module utils/spotifyToken
 */
const axios = require('axios');
const config = require('../config');

/** Token cache - modül seviyesi singleton */
let cachedToken = null;
let tokenExpiresAt = 0;

/** Token'ı süre dolmadan X saniye önce yenile (race condition önleme) */
const REFRESH_BUFFER_SEC = 60;

/**
 * Spotify Client Credentials ile access token alır
 * Cache varsa ve geçerliyse yeniden istek atılmaz
 *
 * @returns {Promise<string>} Bearer token
 * @throws {Error} API veya config hatası
 */
async function getSpotifyToken() {
  const now = Date.now();
  const expiresAtMs = tokenExpiresAt - REFRESH_BUFFER_SEC * 1000;

  if (cachedToken && now < expiresAtMs) {
    return cachedToken;
  }

  const { tokenUrl, clientId, clientSecret } = config?.spotify || {};
  if (!tokenUrl || !clientId || !clientSecret) {
    throw new Error('Spotify config eksik: tokenUrl, clientId, clientSecret');
  }

  const params = new URLSearchParams({ grant_type: 'client_credentials' });
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post(tokenUrl, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    timeout: 10000,
  });

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + (response.data.expires_in * 1000);

  return cachedToken;
}

/**
 * Cache'i temizler (test veya token invalid olduğunda kullanılabilir)
 */
function clearTokenCache() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

module.exports = getSpotifyToken;
module.exports.clearTokenCache = clearTokenCache;
