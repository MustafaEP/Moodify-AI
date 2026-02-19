/**
 * Merkezi Konfigürasyon Modülü
 *
 * Vite ortam değişkenleri (import.meta.env.VITE_*) burada toplanır.
 * - Tek noktadan erişim
 * - Varsayılan değerler
 *
 * Not: Vite'da client'a expose edilecek değişkenler VITE_ prefix'i ile tanımlanmalı.
 */
const config = {
  // API base URL (backend)
  apiBaseUrl:
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

  // Ortam (development, production)
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

export default config;
