/**
 * Auth Controller
 * HTTP katmanı: req/res işleme, service çağrısı
 */
const authService = require('../services/authService');
const config = require('../config');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

async function register(req, res) {
  const { username, email, password } = req.body;
  await authService.register(username, email, password);
  res.status(201).json('Kayıt başarılı');
}

async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
}

function validateToken(req, res) {
  res.status(200).json({
    success: true,
    message: 'Token geçerli',
    user: req.user,
  });
}

function refreshToken(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) return next(new AppError('Refresh token yok', 401));

  jwt.verify(refreshToken, config.jwtSecret, (err, decoded) => {
    if (err) return next(new AppError('Geçersiz refresh token', 403));

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({ token: newToken });
  });
}

module.exports = {
  register,
  login,
  validateToken,
  refreshToken,
};
