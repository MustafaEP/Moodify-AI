import { useState } from 'react';
import api from '../../utils/axiosInstance';

function AiStructuredPlaylist() {
  const [message, setMessage] = useState('');
  const [moodInfo, setMoodInfo] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteStates, setFavoriteStates] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Lütfen bir mesaj girin');
      return;
    }

    setLoading(true);
    setError('');
    setMoodInfo(null);
    setTracks([]);

    try {
      const res = await api.post('recommend/ai-structured-playlist', { message });
      setMoodInfo(res.data.moodInfo);
      setTracks(res.data.tracks);
    } catch (err) {
      console.error('AI playlist hatası:', err);
      setError(err.response?.data?.message || 'AI playlist oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (track) => {
    const trackId = track.id;
    
    // Butonu disable et
    setFavoriteStates(prev => ({ ...prev, [trackId]: 'loading' }));

    try {
      await api.post('favorites', {
        trackName: track.name,
        artistName: track.artists[0].name,
        spotifyUrl: track.external_urls.spotify
      });
      
      setFavoriteStates(prev => ({ ...prev, [trackId]: 'success' }));
      
      // 2 saniye sonra normal duruma dön
      setTimeout(() => {
        setFavoriteStates(prev => ({ ...prev, [trackId]: 'normal' }));
      }, 2000);
      
    } catch (err) {
      console.error('Favori kaydedilemedi:', err);
      setFavoriteStates(prev => ({ ...prev, [trackId]: 'error' }));
      
      // 3 saniye sonra normal duruma dön
      setTimeout(() => {
        setFavoriteStates(prev => ({ ...prev, [trackId]: 'normal' }));
      }, 3000);
    }
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'excited': '🤩',
      'calm': '😌',
      'energetic': '⚡',
      'romantic': '💖',
      'nostalgic': '🌅',
      'melancholic': '🌧️',
      'peaceful': '🕊️',
      'dreamy': '💭',
      'anxious': '😰',
      'hopeful': '🌈',
      'confident': '💪'
    };

    return moodEmojis[mood?.toLowerCase()] || '🎭';
  };

  const getFavoriteButton = (track) => {
    const state = favoriteStates[track.id] || 'normal';
    
    switch (state) {
      case 'loading':
        return (
          <button 
            disabled 
            className="flex items-center px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm cursor-not-allowed"
          >
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-1"></div>
            Ekleniyor...
          </button>
        );
      case 'success':
        return (
          <button 
            disabled 
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm cursor-not-allowed"
          >
            <span className="mr-1">✅</span>
            Eklendi!
          </button>
        );
      case 'error':
        return (
          <button 
            disabled 
            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-sm cursor-not-allowed"
          >
            <span className="mr-1">❌</span>
            Hata!
          </button>
        );
      default:
        return (
          <button 
            onClick={() => handleFavorite(track)}
            className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
          >
            <span className="mr-1">⭐</span>
            Favori
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Yapay Zeka Destekli Mood Playlist
          </h1>
          <p className="text-gray-400">
            Duygularınızı AI ile müziğe dönüştürün
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-3">
                Bugün nasıl hissediyorsun? Duygularını paylaş...
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Örnek: Bugün çok mutluyum, enerjik şarkılar dinlemek istiyorum! Veya: Biraz hüzünlüyüm, sakin melodik parçalar istiyorum..."
                rows={5}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {message.length}/500
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !message.trim()}
              className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  AI Playlist Oluşturuluyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🎶</span>
                  AI Playlist Öner!
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Mood Info */}
        {moodInfo && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{getMoodEmoji(moodInfo.mood)}</div>
              <h3 className="text-2xl font-bold text-white">
                Tahmin Edilen Mood: <span className="text-purple-400">{moodInfo.mood}</span>
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                    <span className="mr-2">💭</span>
                    Açıklama
                  </h4>
                  <p className="text-gray-300">{moodInfo.reason}</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                    <span className="mr-2">🎵</span>
                    Müzik Türü
                  </h4>
                  <p className="text-gray-300">{moodInfo.genre}</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🏷️</span>
                  Spotify Arama Etiketleri
                </h4>
                <div className="flex flex-wrap gap-2">
                  {moodInfo.suggestedKeywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracks */}
        {tracks.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🎧</span>
              <h3 className="text-2xl font-bold text-white">
                Senin İçin Spotify Önerileri
              </h3>
              <span className="ml-auto bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {tracks.length} şarkı
              </span>
            </div>
            
            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                          {track.name}
                        </h4>
                        <p className="text-gray-400 truncate">
                          {track.artists[0].name}
                        </p>
                        {track.album && (
                          <p className="text-gray-500 text-sm truncate">
                            {track.album.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <a 
                        href={track.external_urls.spotify} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
                      >
                        <span className="mr-1">🎶</span>
                        Dinle
                      </a>
                      
                      {getFavoriteButton(track)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !moodInfo && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Duygularınızı paylaşın
            </h3>
            <p className="text-gray-500">
              AI, hislerinize uygun müzikler önerecek
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AiStructuredPlaylist;