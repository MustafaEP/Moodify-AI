import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendApi, favoritesApi } from '../api'; 

function RegionMusic() {
  const [region, setRegion] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteStates, setFavoriteStates] = useState({});
  const navigate = useNavigate();

  const regions = [
    { 
      name: 'Karadeniz', 
      emoji: '🏔️', 
      description: 'Horon, kemençe ve davul eşliğinde', 
      color: 'from-green-600 to-emerald-600' 
    },
    { 
      name: 'Ege', 
      emoji: '🌊', 
      description: 'Zeybek ve türkülerle', 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      name: 'Trakya', 
      emoji: '🌾', 
      description: 'Balkan esintili müzikler', 
      color: 'from-yellow-500 to-amber-500' 
    },
    { 
      name: 'Doğu Anadolu', 
      emoji: '⛰️', 
      description: 'Saz ve bağlama ile', 
      color: 'from-purple-600 to-violet-600' 
    },
    { 
      name: 'Güneydoğu Anadolu', 
      emoji: '🎯', 
      description: 'Davul zurna ve halay', 
      color: 'from-orange-500 to-red-500' 
    },
    { 
      name: 'Akdeniz', 
      emoji: '🏖️', 
      description: 'Güneyin sıcak melodileri', 
      color: 'from-pink-500 to-rose-500' 
    },
    { 
      name: 'Marmara', 
      emoji: '🌉', 
      description: 'Modern ve geleneksel karışımı', 
      color: 'from-indigo-500 to-blue-600' 
    },
    { 
      name: 'İç Anadolu', 
      emoji: '🏞️', 
      description: 'Türkülerin beşiği', 
      color: 'from-teal-500 to-green-600' 
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!region) {
      setError('Lütfen bir yöre seçiniz');
      return;
    }

    setLoading(true);
    setError('');
    setTracks([]);

    try {
      const res = await recommendApi.regionMusic(region);
      setTracks(res.data.tracks);
    } catch (err) {
      console.error('Yöresel müzik hatası:', err);
      setError(err.response?.data?.message || 'Yöresel müzik önerileri alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionSelect = (regionName) => {
    setRegion(regionName);
    setError('');
  };

  const handleFavorite = async (track) => {
    const trackId = `${track.trackName}_${track.artistName}`;
    
    setFavoriteStates(prev => ({ ...prev, [trackId]: 'loading' }));

    try {
      await favoritesApi.add(track.trackName, track.artistName, track.spotifyUrl);
      
      setFavoriteStates(prev => ({ ...prev, [trackId]: 'success' }));
      
      setTimeout(() => {
        setFavoriteStates(prev => ({ ...prev, [trackId]: 'normal' }));
      }, 2000);
      
    } catch (err) {
      console.error('Favori eklenemedi:', err);
      setFavoriteStates(prev => ({ ...prev, [trackId]: 'error' }));
      
      setTimeout(() => {
        setFavoriteStates(prev => ({ ...prev, [trackId]: 'normal' }));
      }, 3000);
    }
  };

  useEffect(() => {
      const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
    },[navigate]);

  const getFavoriteButton = (track) => {
    const trackId = `${track.trackName}_${track.artistName}`;
    const state = favoriteStates[trackId] || 'normal';
    
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

  const selectedRegion = regions.find(r => r.name === region);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">🎶</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Yöresel Müzik Keşfi
          </h1>
          <p className="text-gray-400">
            Türkiye'nin farklı yörelerinden otantik müzikleri keşfedin
          </p>
        </div>

        {/* Region Selection */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">🗺️</span>
            Yöre Seçin
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {regions.map((regionItem, index) => (
              <button
                key={index}
                onClick={() => handleRegionSelect(regionItem.name)}
                className={`cursor-pointer relative overflow-hidden bg-gradient-to-r ${regionItem.color} p-4 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                  region === regionItem.name ? 'ring-4 ring-white ring-opacity-50' : ''
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {regionItem.emoji}
                  </span>
                  <h3 className="font-bold text-lg text-center">{regionItem.name}</h3>
                  <p className="text-xs text-center opacity-90">{regionItem.description}</p>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                {region === regionItem.name && (
                  <div className="absolute top-2 right-2">
                    <span className="text-white text-lg">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={loading || !region}
              className="cursor-pointer px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Müzikler Aranıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">🎵</span>
                  {region ? `${region} Müziklerini Öner` : 'Müzik Öner'}
                </div>
              )}
            </button>
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
              {selectedRegion && (
                <span className="mr-2">{selectedRegion.emoji}</span>
              )}
              {region} bölgesi müzikleri aranıyor...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && tracks.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {selectedRegion && (
                  <span className="mr-2 text-2xl">{selectedRegion.emoji}</span>
                )}
                <span className="mr-2">🎶</span>
                {region} Bölgesi Müzikleri
              </h2>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {tracks.length} şarkı
              </span>
            </div>

            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div 
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                          {track.trackName}
                        </h3>
                        <p className="text-gray-400 truncate">
                          {track.artistName}
                        </p>
                        {track.albumName && (
                          <p className="text-gray-500 text-xs truncate">
                            Albüm: {track.albumName}
                          </p>
                        )}
                      </div>

                      {/* Audio Preview */}
                      {track.previewUrl && (
                        <div className="hidden sm:block">
                          <audio 
                            controls 
                            className="h-8 bg-gray-600 rounded"
                            style={{ width: '200px' }}
                          >
                            <source src={track.previewUrl} type="audio/mpeg" />
                            Tarayıcınız audio etiketini desteklemiyor.
                          </audio>
                        </div>
                      )}
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

                  {/* Mobile Audio Preview */}
                  {track.previewUrl && (
                    <div className="sm:hidden mt-3">
                      <audio 
                        controls 
                        className="w-full h-8 bg-gray-600 rounded"
                      >
                        <source src={track.previewUrl} type="audio/mpeg" />
                        Tarayıcınız audio etiketini desteklemiyor.
                      </audio>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !region && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Yöre seçin ve keşfe başlayın
            </h3>
            <p className="text-gray-500">
              Türkiye'nin zengin müzik kültürünü keşfetmek için yukarıdan bir yöre seçin
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && region && tracks.length === 0 && !error && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl text-gray-400 mb-2">
              {region} için müzik bulunamadı
            </h3>
            <p className="text-gray-500">
              Bu yöre için şu anda müzik önerisi bulunmuyor. Başka bir yöre deneyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionMusic;