/**
 * Protected Controller
 * Örnek korumalı endpoint - verifyToken middleware ile erişilen
 */
function getProfile(req, res) {
  res.json({
    message: `Merhaba ${req.user.email}, MoodMelody AI profiline hoş geldin!`,
    user: req.user,
  });
}

module.exports = {
  getProfile,
};
