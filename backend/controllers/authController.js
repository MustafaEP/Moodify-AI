/**
 * Auth Controller
 * Kimlik doğrulama iş mantığı: register, login, token doğrulama, refresh
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');

async function register(req, res) {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();
  res.status(201).json('Kayıt başarılı');
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Hatalı şifre', 400);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1d' }
  );

  res.json({ token, username: user.username });
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
