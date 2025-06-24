import { useEffect, useState } from 'react';
import api from '../../utils/axiosInstance';
import jwt_decode from 'jwt-decode';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

function AiMoodHistory() {
  const [history, setHistory] = useState([]);
  const [expandedItems, setExpandedItems] = useState({}); // Hangi itemların açık olduğunu takip et
  const [recommendations, setRecommendations] = useState({}); // Her mood history için müzikleri sakla
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);

        const res = await api.get(`history/ai-mood-history/${decoded.id}`);
        setHistory(res.data);
      } catch (err) {
        console.error('Geçmiş alınamadı:', err);
        setError('Geçmiş veriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Müzikleri yükle
  const loadRecommendations = async (moodHistoryId) => {
    if (recommendations[moodHistoryId]) return; // Zaten yüklenmişse tekrar yükleme

    try {
      const response = await api.get(`history/ai-mood-history/recommendation/${moodHistoryId}`);
      setRecommendations(prev => ({
        ...prev,
        [moodHistoryId]: response.data
      }));
    } catch (err) {
      console.error('Müzikler yüklenemedi:', err);
      setRecommendations(prev => ({
        ...prev,
        [moodHistoryId]: []
      }));
    }
  };

  // Item'a tıklandığında aç/kapat
  const toggleExpand = (moodHistoryId) => {
    setExpandedItems(prev => ({
      ...prev,
      [moodHistoryId]: !prev[moodHistoryId]
    }));

    // Eğer açılıyorsa ve müzikler henüz yüklenmemişse yükle
    if (!expandedItems[moodHistoryId] && !recommendations[moodHistoryId]) {
      loadRecommendations(moodHistoryId);
    }
  };

  // Mood sayılarını hesapla
  const moodCounts = history.reduce((acc, item) => {
    acc[item.mood] = (acc[item.mood] || 0) + 1;
    return acc;
  }, {});
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
      'peaceful': '🕊️'
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
  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: getMoodTurkish(mood),
    value: count
  }));

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#F97316'];

  


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Geçmiş veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Mood Tahmin Geçmişi
          </h1>
          <p className="text-gray-400">
            Duygu durumu tahminleriniz ve müzik önerileriniz
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Chart Section */}
        {history.length > 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🥳</span>
              <h2 className="text-2xl font-bold text-white">Ruh Hali Dağılımı</h2>
            </div>
            <div className="w-full h-96">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: '#D1D5DB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Items */}
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div 
                key={item._id} 
                className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden"
              >
                <div 
                  onClick={() => toggleExpand(item._id)}
                  className="p-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-200 select-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getMoodEmoji(item.mood)}</span>
                          <h3 className="text-lg font-semibold text-white">
                            <span className="text-purple-400">{getMoodTurkish(item.mood).toUpperCase()}</span>
                          </h3>
                        </div>
                        
                        <div className="text-gray-400 text-sm mb-1">
                          📅 {formatDate(item.date)}
                        </div>
                        
                        {item.userText && (
                          <div className="text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 mt-2 max-w-2xl border border-gray-600 hover:border-purple-500 transition-all duration-200 hover:shadow-lg">
                            <span className="text-purple-300 text-sm font-medium flex items-center">
                              <span className="mr-1">💬</span>
                              Kullanıcı Metni:
                            </span>
                            <p className="mt-2 text-gray-200 italic leading-relaxed">"{item.userText}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <span className="mr-2">
                        {expandedItems[item._id] ? '🔽' : '▶️'}
                      </span>
                      {expandedItems[item._id] ? 'Müzikleri Gizle' : 'Müzikleri Göster'}
                    </div>
                  </div>
                </div>

                {/* Müzikler bölümü */}
                {expandedItems[item._id] && (
                  <div className="border-t border-gray-700 p-6 bg-gray-750">
                    {recommendations[item._id] ? (
                      recommendations[item._id].length > 0 ? (
                        <div>
                          <div className="flex items-center mb-4">
                            <span className="text-xl mr-2">🎵</span>
                            <h4 className="text-lg font-semibold text-white">Önerilen Müzikler</h4>
                            <span className="ml-auto bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                              {recommendations[item._id].length} şarkı
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {recommendations[item._id].map((track, trackIndex) => (
                              <div 
                                key={track._id} 
                                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-200"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 flex-1">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                      {trackIndex + 1}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-white font-medium truncate">
                                        {track.trackName}
                                      </h5>
                                      <p className="text-gray-400 text-sm truncate">
                                        {track.artistName}
                                      </p>
                                      {track.albumName && (
                                        <p className="text-gray-500 text-xs truncate">
                                          Album: {track.albumName}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    {track.popularity && (
                                      <div className="text-center">
                                        <div className="text-yellow-400 text-xs">⭐</div>
                                        <div className="text-gray-400 text-xs">
                                          {track.popularity}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {track.spotifyUrl && (
                                      <a 
                                        href={track.spotifyUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-all duration-200 hover:scale-105"
                                      >
                                        <span className="mr-1">🎧</span>
                                        Spotify
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">🎭</div>
                          <p className="text-gray-400">Bu mood için müzik önerisi bulunamadı.</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-400">Müzikler yükleniyor...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl text-gray-400 mb-2">
                Henüz AI mood tahmini yapılmamış
              </h3>
              <p className="text-gray-500">
                AI destekli playlist oluşturun ve geçmişinizi burada görün
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiMoodHistory;