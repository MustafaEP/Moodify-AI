/**
 * LoadingSpinner - Dönen yükleme göstergesi
 *
 * Kullanım:
 * <LoadingSpinner />
 * <LoadingSpinner size="sm" />
 * <LoadingSpinner size="lg" color="white" />
 */
function LoadingSpinner({ size = 'md', color = 'purple', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
    purple: 'border-purple-500 border-t-transparent',
  };

  return (
    <div
      className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-hidden="true"
    />
  );
}

export default LoadingSpinner;
