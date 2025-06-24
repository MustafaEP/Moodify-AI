import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

function Search() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState({});
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Lütfen arama terimi girin');
      return;
    }

    setLoading(true);
    setError('');
    setTracks([]);

    try {
      const res = await api.get(`spotify/search?q=${encodeURIComponent(query)}`);
      setTracks(res.data);
      setSearched(true);
    } catch (err) {
      console.error('Arama hatası:', err);
      setError(err.response?.data?.message || 'Arama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFavorite = async (track) => {
    const trackId = track.id;
    
    // Butonu disable et
    setFavoriteStates(prev => ({ ...prev, [trackId]: 'loading' }));

    try {
      const token = localStorage.getItem('token');
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
      console.error('Favori eklenemedi:', err);
      setFavoriteStates(prev => ({ ...prev, [trackId]: 'error' }));
      
      // 3 saniye sonra normal duruma dön
      setTimeout(() => {
        setFavoriteStates(prev => ({ ...prev, [trackId]: 'normal' }));
      }, 3000);
    }
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

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 80) return 'text-green-400';
    if (popularity >= 60) return 'text-yellow-400';
    if (popularity >= 40) return 'text-orange-400';
    return 'text-red-400';
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  },[navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Şarkı Arama
          </h1>
          <p className="text-gray-400">
            Spotify'dan milyonlarca şarkı arasında arama yapın
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Şarkı, sanatçı veya albüm adı yazın..."
                disabled={loading}
                className="w-full px-4 py-3 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🎵
              </span>
              {query && !loading && (
                <button
                  onClick={() => {
                    setQuery('');
                    setTracks([]);
                    setSearched(false);
                    setError('');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Aranıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">🔍</span>
                  Ara
                </div>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-gray-400 text-sm">
            💡 İpucu: Enter tuşuna basarak da arama yapabilirsiniz
          </div>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Şarkılar aranıyor...</p>
          </div>
        )}

        {!loading && searched && tracks.length === 0 && !error && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-500">
              "{query}" için eşleşen şarkı bulunamadı. Farklı terimlerle deneyin.
            </p>
          </div>
        )}

        {tracks.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">🎧</span>
                Arama Sonuçları
              </h2>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
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
                      {/* Track Image */}
                      <div className="flex-shrink-0">
                        {track.album?.images?.[2]?.url ? (
                          <img 
                            src={track.album.images[2].url} 
                            alt={track.album.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                          {track.name}
                        </h3>
                        <p className="text-gray-400 truncate">
                          {track.artists[0].name}
                        </p>
                        {track.album && (
                          <p className="text-gray-500 text-xs truncate">
                            Albüm: {track.album.name}
                          </p>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="hidden sm:flex flex-col items-end space-y-1">
                        {track.duration_ms && (
                          <span className="text-gray-400 text-sm">
                            ⏱️ {formatDuration(track.duration_ms)}
                          </span>
                        )}
                        {track.popularity && (
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-sm mr-1">⭐</span>
                            <span className={`text-sm ${getPopularityColor(track.popularity)}`}>
                              {track.popularity}
                            </span>
                          </div>
                        )}
                        {track.explicit && (
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                            E
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      {track.external_urls?.spotify && (
                        <a 
                          href={track.external_urls.spotify} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
                        >
                          <span className="mr-1">🎧</span>
                          Spotify
                        </a>
                      )}
                      
                      {getFavoriteButton(track)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !searched && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎼</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Arama yapmaya hazır
            </h3>
            <p className="text-gray-500">
              Favori şarkınızı bulun ve favorilerinize ekleyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;