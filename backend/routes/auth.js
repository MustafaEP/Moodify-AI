const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();
    res.status(201).json('Kayıt başarılı');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json('Kullanıcı bulunamadı');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Hatalı şifre');

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Token doğrulama endpoint’i
router.get('/validate-token', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token geçerli',
    user: req.user, 
  });
});


router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json('Refresh token yok');

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json('Geçersiz refresh token');

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token: newToken });
  });
});


module.exports = router;
