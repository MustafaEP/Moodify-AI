/**
 * Merkezi Hata Yönetimi Middleware
 *
 * next(err) ile gelen tüm hataları yakalar ve tutarlı JSON cevabı döner.
 * - AppError: statusCode ile özel hata
 * - Mongoose ValidationError: 400
 * - JWT hataları: 401/403
 * - Diğerleri: 500
 * - Development'ta stack trace eklenir
 */
const config = require('../config');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Bir hata oluştu';

  // AppError (controller'dan throw edilen)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Mongoose validation hatası
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
  }
  // Mongoose duplicate key (email/username unique)
  else if (err.code === 11000) {
    statusCode = 400;
    message = 'Bu kayıt zaten mevcut';
  }
  // JWT hataları
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Geçersiz token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token süresi doldu';
  }
  // Standart Error
  else if (err.message) {
    message = err.message;
  }

  const response = {
    success: false,
    message,
  };

  // Sadece development'ta detay göster
  if (config.nodeEnv === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  console.error('[Error]', statusCode, message);
  if (config.nodeEnv === 'development' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
