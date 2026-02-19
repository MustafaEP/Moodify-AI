/**
 * Auth Controller
 * Kimlik doğrulama iş mantığı: register, login, token doğrulama, refresh
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();
    res.status(201).json('Kayıt başarılı');
  } catch (err) {
    res.status(500).json(err);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json('Kullanıcı bulunamadı');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Hatalı şifre');

    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
}

function validateToken(req, res) {
  res.status(200).json({
    success: true,
    message: 'Token geçerli',
    user: req.user,
  });
}

function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json('Refresh token yok');

  jwt.verify(refreshToken, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json('Geçersiz refresh token');

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
