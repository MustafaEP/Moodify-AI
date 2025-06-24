import axios from 'axios'
import jwt_decode from 'jwt-decode'

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/',
});

// Token ekleme interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 hatasında token yenileme interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('Refresh token yok');
        return Promise.reject(error);
      }

      try {
        const res = await axios.post('http://localhost:5000/api/auth/refresh-token', {
          refreshToken
        });

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);
        originalRequest.headers['Authorization'] = newToken;

        return instance(originalRequest);
      } catch (err) {
        console.error('Refresh başarısız', err);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
