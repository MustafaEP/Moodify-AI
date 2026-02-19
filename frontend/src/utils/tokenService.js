import axios from 'axios';
import config from '../config';

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.warn('Refresh token bulunamadı');
    return;
  }

  try {
    const res = await axios.post(config.apiBaseUrl + '/auth/refresh-token', {
      refreshToken
    });
    localStorage.setItem('token', res.data.token);
    console.log('Token yenilendi');
  } catch (err) {
    console.error('Token yenileme başarısız', err);
  }
}
