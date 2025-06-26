import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Register from './pages/account/Register';
import Login from './pages/account/Login';
import Search from './pages/Search';
import MoodSearch from './pages/MoodSearch';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import ProfileUpdate from './pages/ProfileUpdate';
import AiMoodHistory from './pages/ai/AiMoodHistory';
import AiStructuredPlaylist from './pages/ai/AiStructuredPlaylist';
import RegionMusic from './pages/RegionMusic'

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication Provider
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Dark mode stilleri
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark', 'bg-gray-900', 'text-gray-100');

    const token = localStorage.getItem('authToken') || localStorage.getItem('token');

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);



  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-lg">Yükleniyor...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Navigation Component
const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/search', label: 'Şarkı Ara', icon: '🔍' },
    { path: '/mood-search', label: 'Ruh Hali Arama', icon: '🎭' },
    { path: '/ai-structured-playlist', label: 'AI Playlist', icon: '🤖' },
    { path: '/region-music', label: 'Bölgesel Müzik', icon: '📌' },
    { path: '/favorites', label: 'Favoriler', icon: '⭐' },
    { path: '/ai-mood-history', label: 'AI Geçmiş', icon: '📝' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-2xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text hover:from-purple-300 hover:via-pink-300 hover:to-blue-300 transition-all duration-300">
              <div className="flex items-center space-x-1">
                <span className="text-xl">🤖</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-tight">Moodify</span>
                <span className="text-xs font-medium text-gray-400 -mt-1">AI</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm font-medium group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 text-sm font-medium">
                <span className="group-hover:scale-110 transition-transform duration-200">👤</span>
                <span>Hesap</span>
                <span className="text-xs transition-transform group-hover:rotate-180 duration-300">▼</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-sm">
                <div className="py-2">
                  <Link
                    to="/update-profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <span className="mr-3 group-hover:scale-110 transition-transform duration-200">✏️</span>
                    Profil Güncelle
                  </Link>
                  <div className="border-t border-gray-600 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <span className="mr-3 group-hover:scale-110 transition-transform duration-200">🚪</span>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 pt-4 pb-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-600 my-2"></div>
              <Link
                to="/update-profile"
                className="flex items-center px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">✏️</span>
                <span className="font-medium">Profil Güncelle</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <span className="mr-3 text-lg">🚪</span>
                <span className="font-medium">Çıkış Yap</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <BrowserRouter>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/mood-search" element={<ProtectedRoute><MoodSearch /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/update-profile" element={<ProtectedRoute><ProfileUpdate /></ProtectedRoute>} />
              <Route path="/ai-mood-history" element={<ProtectedRoute><AiMoodHistory /></ProtectedRoute>} />
              <Route path="/ai-structured-playlist" element={<ProtectedRoute><AiStructuredPlaylist /></ProtectedRoute>} />
              <Route path="/region-music" element={<RegionMusic />} />

              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;