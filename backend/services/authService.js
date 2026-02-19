/**
 * Auth Service
 *
 * Kayıt ve giriş iş mantığı.
 * Model ve config ile çalışır; JWT üretimi burada.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');

async function register(username, email, password) {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Hatalı şifre', 400);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1d' }
  );

  return { token, username: user.username };
}

module.exports = {
  register,
  login,
};
