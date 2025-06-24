const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error(err));


const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

const protectedRoute = require('./routes/protected');
app.use('/api/protected', protectedRoute);

const spotifyRoute = require('./routes/spotify');
app.use('/api/spotify', spotifyRoute);

const historyRoute = require('./routes/history');
app.use('/api/history', historyRoute);

const userRoute = require('./routes/users');
app.use('/api/users', userRoute);

const favoritesRoute = require('./routes/favorites');
app.use('/api/favorites', favoritesRoute);

const geminiRoute = require('./routes/gemini')
app.use('/api/gemini', geminiRoute)

const recommendRoute = require('./routes/recommend')
app.use('/api/recommend', recommendRoute)


app.get('/', (req, res) => {
  res.send('MoodMelody AI Backend Çalışıyor 🚀');
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
