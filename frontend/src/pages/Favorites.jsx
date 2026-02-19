import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '../api';
import { LoadingPage, Alert } from '../components';


function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStates, setDeleteStates] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const decoded = jwt_decode(token);
        const userId = decoded.id;

        const res = await favoritesApi.getList(userId);
        setFavorites(res.data);
      } catch (err) {
        console.error('Favoriler yüklenemedi:', err);
        setError('Favoriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleDelete = async (id, trackName) => {
    // Onay dialogu
    if (!window.confirm(`"${trackName}" şarkısını favorilerden kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    // Delete butonunu disable et
    setDeleteStates(prev => ({ ...prev, [id]: 'deleting' }));

    try {
      await favoritesApi.remove(id);

      // Başarılı silme animasyonu
      setDeleteStates(prev => ({ ...prev, [id]: 'deleted' }));
      
      // Kısa bir gecikme sonrası listeden kaldır
      setTimeout(() => {
        setFavorites(favorites.filter(fav => fav._id !== id));
        setDeleteStates(prev => ({ ...prev, [id]: 'normal' }));
      }, 1000);

    } catch (err) {
      console.error('Favori silinemedi:', err);
      setDeleteStates(prev => ({ ...prev, [id]: 'error' }));
      
      // 3 saniye sonra normal duruma dön
      setTimeout(() => {
        setDeleteStates(prev => ({ ...prev, [id]: 'normal' }));
      }, 3000);
    }
  };

  // Arama fonksiyonu
  const filteredFavorites = favorites.filter(fav =>
    fav.trackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDeleteButton = (favorite) => {
    const state = deleteStates[favorite._id] || 'normal';
    
    switch (state) {
      case 'deleting':
        return (
          <button 
            disabled 
            className="flex items-center px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm cursor-not-allowed"
          >
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-1"></div>
            Siliniyor...
          </button>
        );
      case 'deleted':
        return (
          <button 
            disabled 
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm cursor-not-allowed"
          >
            <span className="mr-1">✅</span>
            Silindi!
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
            onClick={() => handleDelete(favorite._id, favorite.trackName)}
            className="cursor-pointer flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
            title="Favorilerden kaldır"
          >
            <span className="mr-1">🗑️</span>
            Sil
          </button>
        );
    }
  };

  if (loading) {
    return <LoadingPage message="Favoriler yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Favori Şarkılarım
          </h1>
          <p className="text-gray-400">
            Beğendiğiniz şarkıları buradan yönetin
          </p>
        </div>

        <Alert type="error" message={error} />

        {/* Search Bar */}
        {favorites.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Şarkı veya sanatçı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                {filteredFavorites.length} sonuç bulundu
              </p>
            )}
          </div>
        )}

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">🎵</span>
                Favori Listesi
              </h2>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {filteredFavorites.length} şarkı
              </span>
            </div>

            {filteredFavorites.length > 0 ? (
              <div className="space-y-4">
                {filteredFavorites.map((favorite, index) => (
                  <div 
                    key={favorite._id}
                    className={`bg-gray-700 rounded-lg p-4 transition-all duration-200 ${
                      deleteStates[favorite._id] === 'deleted' 
                        ? 'opacity-50 scale-95' 
                        : 'hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                            {favorite.trackName}
                          </h3>
                          <p className="text-gray-400 truncate">
                            {favorite.artistName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            📅 {new Date(favorite.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {favorite.spotifyUrl && (
                          <a 
                            href={favorite.spotifyUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
                          >
                            <span className="mr-1">🎧</span>
                            Spotify
                          </a>
                        )}
                        
                        {getDeleteButton(favorite)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-xl text-gray-400 mb-2">
                  Arama sonucu bulunamadı
                </h3>
                <p className="text-gray-500">
                  "{searchTerm}" için eşleşen şarkı bulunamadı
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Aramayı Temizle
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl text-gray-400 mb-2">
              Henüz favori şarkınız yok
            </h3>
            <p className="text-gray-500 mb-6">
              Beğendiğiniz şarkıları favorilere ekleyerek burada görüntüleyebilirsiniz
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/search'}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                🔍 Şarkı Ara
              </button>
              <button
                onClick={() => window.location.href = '/ai-playlist'}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors font-medium"
              >
                🤖 AI Playlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;