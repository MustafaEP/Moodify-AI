const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json('Token yok, yetkisiz işlem.');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json('Geçersiz token.');

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
