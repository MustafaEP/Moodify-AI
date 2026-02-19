/**
 * AuthContext - Kimlik doğrulama state yönetimi
 *
 * isAuthenticated, login, logout ve loading değerlerini sağlar.
 * Token localStorage'da 'token' anahtarı ile tutulur.
 */
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth AuthProvider içinde kullanılmalıdır');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dark mode stilleri
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark', 'bg-gray-900', 'text-gray-100');

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (token && token !== 'undefined' && token !== 'null') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
