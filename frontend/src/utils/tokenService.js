import { authApi } from '../api';

export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    console.warn('Refresh token bulunamadı');
    return;
  }

  try {
    const res = await authApi.refreshToken(refreshTokenValue);
    localStorage.setItem('token', res.data.token);
    console.log('Token yenilendi');
  } catch (err) {
    console.error('Token yenileme başarısız', err);
  }
}
