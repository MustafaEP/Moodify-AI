const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json('Token yok, yetkisiz işlem.');

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json('Geçersiz token.');

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
