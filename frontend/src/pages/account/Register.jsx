import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Input değiştiğinde hata mesajını temizle
    if (error) setError('');
    if (success) setSuccess('');
  };
  
  const validateForm = () => {
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    if (form.username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır');
      return false;
    }
    return true;
  };
    
  const getPasswordStrengthSteps = (password) => {
    const steps = [false, false, false, false];

    if (password.length >= 6) steps[0] = true;
    if (password.length >= 8) steps[1] = true;
    if (/[A-Z]/.test(password)) steps[2] = true;
    if (/[0-9]/.test(password)) steps[3] = true;

    return steps;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { confirmPassword, ...submitData } = form; // confirmPassword'u çıkar
      await axios.post('http://localhost:5000/api/auth/register', submitData);
      
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      
      // 2 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Kayıt hatası:', error);
      
      // Hata mesajını kullanıcı dostu hale getir
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Bu email adresi zaten kullanılıyor');
      } else if (error.response?.status === 500) {
        setError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError('Kayıt olurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const isFormValid = form.username && form.email && form.password && form.confirmPassword;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Hesap Oluştur</h2>
          <p className="text-gray-400">Müzik dünyasına katılın</p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-lg text-green-200 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                {success}
              </div>
            </div>
          )}
          
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
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input 
                  id="username"
                  type="text" 
                  name="username" 
                  placeholder="Kullanıcı adınız" 
                  value={form.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                  placeholder="En az 6 karakter" 
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={6}
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
            
            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <input 
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword" 
                  placeholder="Şifrenizi tekrar girin" 
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            {/* Password Strength Indicator */}
            {form.password && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Şifre Gücü:</div>
                <div className="flex space-x-1">
                  {getPasswordStrengthSteps(form.password).map((stepPassed, idx) => (
                    <div
                      key={idx}
                      className={`h-1 w-1/4 rounded transition-colors duration-200 ${
                        stepPassed ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !isFormValid}
              className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Kayıt oluşturuluyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Hesap Oluştur
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
          
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Zaten hesabınız var mı?{' '}
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Kayıt olarak <span className="text-purple-400">Kullanım Şartları</span>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;