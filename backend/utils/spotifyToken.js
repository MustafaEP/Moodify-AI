const axios = require('axios');

let token = null;
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  const now = Date.now();
  if (token && now < tokenExpiresAt) {
    return token;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const response = await axios.post(process.env.SPOTIFY_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')
    }
  });

  token = response.data.access_token;
  tokenExpiresAt = now + (response.data.expires_in * 1000);
  return token;
}

module.exports = getSpotifyToken;
