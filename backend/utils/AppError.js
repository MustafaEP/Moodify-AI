/**
 * AppError - Özel hata sınıfı
 *
 * Controller'larda beklenen hatalar için kullanılır (404, 400 vb.)
 * throw new AppError('Kullanıcı bulunamadı', 404)
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
