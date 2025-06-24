import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import api from '../utils/axiosInstance';

function MoodSearch() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [actionStates, setActionStates] = useState({});
  const navigate = useNavigate(); 

  const token = localStorage.getItem('token');

  const moods = [
    { key: 'happy', label: 'Mutlu', emoji: '😊', color: 'from-yellow-500 to-orange-500', search: 'happy upbeat joyful' },
    { key: 'sad', label: 'Üzgün', emoji: '😢', color: 'from-blue-500 to-indigo-500', search: 'sad melancholic emotional' },
    { key: 'energetic', label: 'Enerjik', emoji: '⚡', color: 'from-red-500 to-pink-500', search: 'energetic workout motivation' },
    { key: 'calm', label: 'Sakin', emoji: '🌙', color: 'from-green-500 to-teal-500', search: 'calm peaceful relaxing' },
    { key: 'romantic', label: 'Romantik', emoji: '💖', color: 'from-pink-500 to-rose-500', search: 'romantic love ballad' },
    { key: 'party', label: 'Parti', emoji: '🎉', color: 'from-purple-500 to-violet-500', search: 'party dance electronic' },
    { key: 'focus', label: 'Odaklanma', emoji: '🎯', color: 'from-gray-500 to-slate-500', search: 'focus concentration study' },
    { key: 'nostalgic', label: 'Nostaljik', emoji: '🌅', color: 'from-amber-500 to-yellow-500', search: 'nostalgic retro classic' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  },[navigate]);

  const handleMoodSearch = async (moodData) => {
    setLoading(true);
    setError('');
    setTracks([]);
    setSelectedMood(moodData.label);

    try {
      const res = await api.get(`recommend/mood-music?mood=${encodeURIComponent(moodData.search)}`);
      console.log(res);
      setTracks(res.data.tracks);
    } catch (err) {
      console.error('Mood arama hatası:', err);
      setError('Şarkı arama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };



  const handleFavorite = async (track) => {
    const actionKey = `fav_${track.id}`;
    setActionStates(prev => ({ ...prev, [actionKey]: 'loading' }));

    try {
      await api.post('favorites', {
        trackName: track.trackName,
        artistName: track.artistName,
        spotifyUrl: track.spotifyUrl
      });

      setActionStates(prev => ({ ...prev, [actionKey]: 'success' }));
      
      setTimeout(() => {
        setActionStates(prev => ({ ...prev, [actionKey]: 'normal' }));
      }, 2000);

    } catch (err) {
      console.error('Favori ekleme hatası:', err);
      setActionStates(prev => ({ ...prev, [actionKey]: 'error' }));
      
      setTimeout(() => {
        setActionStates(prev => ({ ...prev, [actionKey]: 'normal' }));
      }, 3000);
    }
  };

  const getFavoriteButton = (track) => {
    const actionKey = `fav_${track.id}`;
    const state = actionStates[actionKey] || 'normal';
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">🎶</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Ruh Haline Göre Şarkı Bul
          </h1>
          <p className="text-gray-400">
            Duygu durumunuza uygun şarkıları keşfedin
          </p>
        </div>

        {/* Mood Selection */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">🎭</span>
            Ruh Halinizi Seçin
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.key}
                onClick={() => handleMoodSearch(mood)}
                disabled={loading}
                className={`cursor-pointer relative overflow-hidden bg-gradient-to-r ${mood.color} p-6 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {mood.emoji}
                  </span>
                  <span className="text-lg font-bold">{mood.label}</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">
              {selectedMood} ruh haline uygun şarkılar aranıyor...
            </p>
          </div>
        )}
        {console.log(tracks)}
        {/* Results */}
        {!loading && tracks.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">🎵</span>
                {selectedMood} Şarkıları
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
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                          {track.trackName}
                        </h3>
                        <p className="text-gray-400 truncate">
                          {track.artistName}
                        </p>
                        {/* {track.album && (
                          <p className="text-gray-500 text-xs truncate">
                            Albüm: {track.album.name}
                          </p>
                        )} */}
                      </div>

                      {/* Track Info */}
                      <div className="hidden sm:flex flex-col items-end space-y-1">
                        {track.durationMs && (
                          <span className="text-gray-400 text-sm">
                            ⏱️ {formatDuration(track.durationMs)}
                          </span>
                        )}
                        {track.popularity && (
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-sm mr-1">⭐</span>
                            <span className="text-gray-400 text-sm">
                              {track.popularity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      {track.spotifyUrl && (
                        <a 
                          href={track.spotifyUrl} 
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
        {!loading && !selectedMood && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Ruh halinizi seçin
            </h3>
            <p className="text-gray-500">
              Yukarıdaki ruh hali butonlarından birini seçerek başlayın
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && selectedMood && tracks.length === 0 && !error && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-gray-500">
              {selectedMood} ruh hali için şarkı bulunamadı. Başka bir ruh hali deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodSearch;