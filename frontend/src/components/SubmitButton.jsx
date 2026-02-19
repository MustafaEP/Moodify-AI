/**
 * SubmitButton - Yükleme durumlu form gönder butonu
 *
 * Kullanım:
 * <SubmitButton loading={loading} disabled={!form.email}>
 *   Giriş Yap
 * </SubmitButton>
 * <SubmitButton loading={loading} disabled={!valid}>
 *   <span className="mr-2">🚀</span>
 *   Hesap Oluştur
 * </SubmitButton>
 */
import LoadingSpinner from './LoadingSpinner';

function SubmitButton({
  loading = false,
  disabled = false,
  children,
  className = '',
  loadingText = 'Yükleniyor...',
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] disabled:hover:scale-100 ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="md" color="white" className="mr-2" />
          {loadingText}
        </div>
      ) : (
        <div className="flex items-center justify-center">{children}</div>
      )}
    </button>
  );
}

export default SubmitButton;
