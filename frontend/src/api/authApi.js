/**
 * Auth API Service
 * Login, register işlemleri (axiosInstance token ekler, public endpoint'ler için ham axios kullanılabilir)
 */
import axios from 'axios';
import config from '../config';

const baseUrl = config.apiBaseUrl + '/auth';

export const authApi = {
  login: (email, password) =>
    axios.post(baseUrl + '/login', { email, password }),

  register: (data) =>
    axios.post(baseUrl + '/register', data),

  refreshToken: (refreshToken) =>
    axios.post(baseUrl + '/refresh-token', { refreshToken }),
};
