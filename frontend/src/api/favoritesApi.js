/**
 * Favorites API Service
 */
import api from '../utils/axiosInstance';

export const favoritesApi = {
  getList: (userId) =>
    api.get(`favorites/${userId}`),

  add: (trackName, artistName, spotifyUrl) =>
    api.post('favorites', { trackName, artistName, spotifyUrl }),

  remove: (id) =>
    api.delete(`favorites/${id}`),

  getTopArtist: (userId) =>
    api.get(`favorites/top-artist/${userId}`),
};
