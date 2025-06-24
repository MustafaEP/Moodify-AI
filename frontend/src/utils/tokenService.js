import axios from 'axios'

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.warn('Refresh token bulunamadı');
    return;
  }

  try {
    const res = await axios.post('http://localhost:5000/api/auth/refresh-token', {
      refreshToken
    });
    localStorage.setItem('token', res.data.token);
    console.log('Token yenilendi');
  } catch (err) {
    console.error('Token yenileme başarısız', err);
  }
}
