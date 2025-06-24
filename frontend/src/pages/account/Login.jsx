import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../App'; // AuthContext'i import et

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // useAuth hook'unu kullan
  
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Input değiştiğinde hata mesajını temizle
    if (error) setError('');
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      
      // Token'ı hem localStorage'a kaydet hem de AuthContext'e bildir
      localStorage.setItem('token', res.data.token);
      login(res.data.token); // Bu otomatik olarak kullanıcıyı dashboard'a yönlendirecek
      
      // Başarı mesajı (opsiyonel, çünkü zaten yönlendirilecek)
      console.log("Giriş başarılı: " + res.data.username);
      
    } catch (error) {
      console.error('Giriş hatası:', error);
      
      // Hata mesajını kullanıcı dostu hale getir
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError('Email veya şifre hatalı');
      } else if (error.response?.status === 500) {
        setError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError('Giriş yapılırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h2>
          <p className="text-gray-400">Hesabınıza giriş yapın</p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  placeholder="ornek@email.com" 
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  📧
                </span>
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  placeholder="••••••••" 
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !form.email || !form.password}
              className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Giriş Yap
                </div>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">veya</span>
              </div>
            </div>
          </div>
          
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Hesabınız yok mu?{' '}
              <Link 
                to="/register" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
              >
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Moodify AI. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;