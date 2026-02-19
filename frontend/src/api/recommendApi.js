/**
 * Recommend API Service
 */
import api from '../utils/axiosInstance';

export const recommendApi = {
  moodMusic: (mood) =>
    api.get('recommend/mood-music', { params: { mood } }),

  regionMusic: (region) =>
    api.get('recommend/region-music', { params: { region } }),

  aiStructuredPlaylist: (message) =>
    api.post('recommend/ai-structured-playlist', { message }),
};
