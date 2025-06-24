import { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 
import api from '../utils/axiosInstance';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const decoded = jwt_decode(token);
        const userId = decoded.id;
        const res = await api.get(`users/profile/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Profil bilgileri alınamadı:', err);
        setError('Profil bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
      'mutlu': '😊',
      'üzgün': '😢',
      'öfkeli': '😠',
      'heyecanlı': '🤩',
      'sakin': '😌',
      'enerjik': '⚡',
      'romantik': '💖',
      'nostaljik': '🌅',
      'parti': '🎉',
      'odaklanma': '🎯'
    };
    return moodEmojis[mood?.toLowerCase()] || '🎭';
  };

  const getMoodTurkish = (mood) => {
    const moodTranslations = {
      'happy': 'Mutlu',
      'sad': 'Üzgün',
      'angry': 'Kızgın',
      'excited': 'Heyecanlı',
      'calm': 'Sakin',
      'energetic': 'Enerjik',
      'romantic': 'Romantik',
      'nostalgic': 'Nostaljik',
      'melancholic': 'Melankolik',
      'peaceful': 'Huzurlu',
      'dreamy': 'Hayalperest',
      'anxious': 'Endişeli',
      'hopeful': 'Umutlu',
      'confident': 'Kendinden Emin'
    };

    return moodTranslations[mood?.toLowerCase()] || 'Bilinmeyen Ruh Hali';
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  const quickActions = [
    {
      title: 'Şarkı Ara',
      description: 'Spotify\'dan şarkı ara',
      icon: '🔍',
      color: 'from-blue-500 to-cyan-500',
      link: '/search'
    },
    {
      title: 'Ruh Hali Arama',
      description: 'Mood\'a göre şarkı bul',
      icon: '🎭',
      color: 'from-purple-500 to-pink-500',
      link: '/mood-search'
    },
    {
      title: 'AI Playlist',
      description: 'Yapay zeka ile liste oluştur',
      icon: '🤖',
      color: 'from-green-500 to-teal-500',
      link: '/ai-structured-playlist'
    },
    {
      title: 'Favorilerim',
      description: 'Favori şarkılarını görüntüle',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      link: '/favorites'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl text-red-400 mb-2">Hata Oluştu</h3>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getWelcomeMessage()}, {profile?.username}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Müzik yolculuğunuza devam edin
          </p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Toplam Şarkı</p>
                <p className="text-3xl font-bold text-white">{profile?.totalTracks || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">En Çok Mood</p>
                <p className="text-lg font-bold text-white flex items-center">
                  <span className="mr-2">{getMoodEmoji(profile?.topMood)}</span>
                  {getMoodTurkish(profile?.topMood) || 'Belirsiz'}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">En Çok Sanatçı</p>
                <p className="text-lg font-bold text-white truncate" title={profile?.topArtist}>
                  {profile?.topArtist || 'Belirsiz'}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎤</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Hesap Durumu</p>
                <p className="text-lg font-bold text-green-400">Aktif</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Profil Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Kullanıcı Adı</p>
                  <p className="text-white font-semibold">{profile?.username}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{profile?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/update-profile'}
              className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              Profili Düzenle
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2">🚀</span>
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.link}
                className={`cursor-pointer relative overflow-hidden bg-gradient-to-r ${action.color} p-6 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                    {action.icon}
                  </span>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;