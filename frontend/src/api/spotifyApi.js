/**
 * Spotify API Service
 */
import api from '../utils/axiosInstance';

export const spotifyApi = {
  search: (query) =>
    api.get(`spotify/search`, { params: { q: query } }),
};
