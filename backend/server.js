const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(config.mongoUri)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error(err));


const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('MoodMelody AI Backend Çalışıyor');
});

// 404 - tanımlı route bulunamadı
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint bulunamadı' });
});

// Merkezi hata yönetimi (tüm next(err) buraya düşer)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${config.port}`);
});
