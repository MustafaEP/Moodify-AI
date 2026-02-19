/**
 * Alert - Hata veya başarı mesajı
 *
 * Kullanım:
 * <Alert type="error" message="Bir hata oluştu" />
 * <Alert type="success" message="Kayıt başarılı!" />
 */
function Alert({ type = 'error', message, icon }) {
  const styles = {
    error: {
      container: 'bg-red-900/50 border-red-500/50 text-red-200',
      defaultIcon: '⚠️',
    },
    success: {
      container: 'bg-green-900/50 border-green-500/50 text-green-200',
      defaultIcon: '✅',
    },
  };

  const style = styles[type];
  const displayIcon = icon ?? style.defaultIcon;

  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 border rounded-lg text-sm ${style.container}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2">{displayIcon}</span>
        {message}
      </div>
    </div>
  );
}

export default Alert;
