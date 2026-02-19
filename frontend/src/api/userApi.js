/**
 * User API Service
 */
import api from '../utils/axiosInstance';

export const userApi = {
  getProfile: (userId) =>
    api.get(`users/profile/${userId}`),

  updateUser: (userId, data) =>
    api.put(`users/update/${userId}`, data),

  verifyPassword: (userId, currentPassword) =>
    api.post(`users/verify-password/${userId}`, { currentPassword }),
};
