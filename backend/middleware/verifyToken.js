/**
 * JWT Token Doğrulama Middleware
 *
 * Gelen istekteki "authorization" başlığını kontrol eder ve JWT token'ı doğrular.
 * Token eksik veya geçersizse hata fırlatır, aksi halde kullanıcı bilgisini (req.user) ekler.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/AppError');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return next(new AppError('Token yok, yetkisiz işlem.', 401));

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return next(new AppError('Geçersiz token.', 403));

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
