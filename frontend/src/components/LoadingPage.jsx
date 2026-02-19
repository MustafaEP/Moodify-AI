/**
 * LoadingPage - Tam sayfa yükleme ekranı
 *
 * Kullanım:
 * <LoadingPage />
 * <LoadingPage message="Veriler yükleniyor..." />
 */
import LoadingSpinner from './LoadingSpinner';

function LoadingPage({ message = 'Yükleniyor...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" color="purple" className="mx-auto mb-4" />
        <p className="text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  );
}

export default LoadingPage;
