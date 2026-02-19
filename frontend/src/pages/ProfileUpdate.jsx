import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api';
import { LoadingPage, Alert, SubmitButton } from '../components';

function ProfileUpdate() {
  const [form, setForm] = useState({ username: '', email: '', password: '', currentPassword: '' });
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({ new: false, current: false });
  const [originalData, setOriginalData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const decoded = jwt_decode(token);
        setUserId(decoded.id);

        const res = await userApi.getProfile(decoded.id);
        const userData = {
          username: res.data.username,
          email: res.data.email,
          password: '',
          currentPassword: ''
        };
        
        setForm(userData);
        setOriginalData({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.error('Kullanıcı bilgileri alınamadı:', err);
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Input değiştiğinde hata mesajını temizle
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      setError('Kullanıcı adı boş olamaz');
      return false;
    }
    
    if (form.username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır');
      return false;
    }

    if (!form.email.trim()) {
      setError('Email adresi boş olamaz');
      return false;
    }

    if (form.password && form.password.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır');
      return false;
    }

    if (form.password && !form.currentPassword) {
      setError('Şifreyi değiştirmek için mevcut şifrenizi girmelisiniz');
      return false;
    }

    return true;
  };

  const hasChanges = () => {
    return (
      form.username !== originalData.username ||
      form.email !== originalData.email ||
      form.password.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!hasChanges()) {
      setError('Herhangi bir değişiklik yapılmadı');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      // Eğer yeni şifre girilmişse mevcut şifreyi kontrol et
      if (form.password) {
        const verify = await userApi.verifyPassword(userId, form.currentPassword);

        if (verify.status !== 200) {
          setError('Mevcut şifre hatalı');
          setUpdating(false);
          return;
        }
      }

      // Güncelleme isteği
      await userApi.updateUser(userId, form);

      setSuccess('Profil başarıyla güncellendi! Ana sayfaya yönlendiriliyorsunuz...');
      
      // 2 saniye sonra dashboard'a yönlendir
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Profil güncellenemedi:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Bu email adresi zaten kullanılıyor');
      } else {
        setError('Profil güncellenirken bir hata oluştu');
      }
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    setForm({
      ...originalData,
      password: '',
      currentPassword: ''
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <LoadingPage message="Kullanıcı bilgileri yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">✏️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Profil Bilgilerini Güncelle
          </h1>
          <p className="text-gray-400">
            Hesap bilgilerinizi düzenleyin
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
          <Alert type="success" message={success} />
          <Alert type="error" message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Kullanıcı adınız"
                  required
                  disabled={updating}
                  minLength={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  👤
                </span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  required
                  disabled={updating}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  📧
                </span>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🔒</span>
                Şifre Değiştir (İsteğe Bağlı)
              </h3>

              {/* New Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPasswords.new ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="En az 6 karakter (boş bırakabilirsiniz)"
                    disabled={updating}
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={updating}
                  >
                    {showPasswords.new ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Mevcut Şifre
                  {form.password && <span className="text-red-400 ml-1">*</span>}
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Değişiklik yapmak için mevcut şifrenizi girin"
                    disabled={updating}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={updating}
                  >
                    {showPasswords.current ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SubmitButton
                  loading={updating}
                  disabled={!hasChanges()}
                  loadingText="Güncelleniyor..."
                  className="!w-full"
                >
                  <span className="mr-2">💾</span>
                  Değişiklikleri Kaydet
                </SubmitButton>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={updating}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2">🔄</span>
                  Sıfırla
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={updating}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2">↩️</span>
                  Geri Dön
                </div>
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <div className="flex items-start">
              <span className="text-blue-400 mr-2 mt-0.5">💡</span>
              <div className="text-blue-200 text-sm">
                <p className="font-medium mb-1">Güvenlik İpuçları:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300">
                  <li>Şifre değiştirmek istemiyorsanız yeni şifre alanını boş bırakabilirsiniz</li>
                  <li>Güçlü bir şifre için en az 8 karakter kullanın</li>
                  <li>Şifrenizde sayı ve büyük harf bulundurun</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;