/**
 * History API Service
 */
import api from '../utils/axiosInstance';

export const historyApi = {
  getAiMoodHistory: (userId) =>
    api.get(`history/ai-mood-history/${userId}`),

  getAiMoodRecommendations: (moodHistoryId) =>
    api.get(`history/ai-mood-history/recommendation/${moodHistoryId}`),
};
