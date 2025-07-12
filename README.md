# Moodify-AI

**Moodify-AI**, Spotify ve Gemini AI gibi servislerle entegre çalışan kişinin ruh haline göre müzik öneren tam yığın bir web uygulamasıdır. Bu dökümanda uygulamayı nasıl çalıştırabileceğiniz adım adım açıklanmıştır.

---

##  Kurulum Rehberi

Aşağıdaki adımları izleyerek uygulamayı yerel ortamınızda kolayca çalıştırabilirsiniz.

---

##  Ortam Değişkenlerini Ayarlama

Projenizin `backend` klasöründe bulunan `env.txt` dosyasını açın ve aşağıdaki bilgileri doldurup `.env` formatında kaydedin:

```env
SPOTIFY_CLIENT_ID=SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET=SPOTIFY_CLIENT_SECRET
SPOTIFY_TOKEN_URL=https://accounts.spotify.com/api/token
SPOTIFY_API_URL=https://api.spotify.com/v1
GEMINI_API_KEY=GEMINI_API_KEY
PORT=5000
MONGO_URI=MONGO_URI
JWT_SECRET=benimsirlimoodmelody
```

###  Spotify API Bilgilerini Alma

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) adresine gidin.
2. Yeni bir uygulama oluşturun.
3. Uygulama sayfasında yer alan **Client ID** ve **Client Secret** değerlerini alın ve `.env` dosyasındaki ilgili alanlara yazın:

   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

###  Gemini API Key Alma

1. [Gemini API Anahtar Sayfası](https://aistudio.google.com/app/apikey) adresine gidin.
2. Google hesabınızla giriş yapın.
3. Yeni bir API anahtarı oluşturun.
4. Oluşturduğunuz API key'i `.env` dosyasındaki aşağıdaki alana yapıştırın:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

###  MongoDB URI Alma

Uygulama, MongoDB veritabanına bağlanmak için bir bağlantı URI'sine ihtiyaç duyar. İki farklı yöntemle bu bağlantıyı sağlayabilirsiniz:

---

####  Seçenek 1: Yerel (Localhost) MongoDB Kullanımı

Eğer bilgisayarınızda MongoDB kuruluysa ve yerel bir veritabanı ile çalışmak istiyorsanız şu URI'yi kullanabilirsiniz:

```env
MONGO_URI=mongodb://localhost:27017/moodmelody
```
#### Seçenek 2: MongoDB URI Alma

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) adresinden ücretsiz bir hesap oluşturun veya giriş yapın.
2. Yeni bir **cluster** oluşturun ya da mevcut bir cluster'ı kullanın.
3. Cluster'da **Connect** butonuna tıklayın.
4. **Connect Your Application** seçeneğini seçin.
5. Açılan sayfada bağlantı URI'sini kopyalayın.
6. URI'yi `.env` dosyasındaki aşağıdaki alana yapıştırın:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/moodmelody

###  Backend Projesini Çalıştırma

1. Terminal veya komut istemcisini açın.
2. Projenin `backend` dizinine geçin:
   
   ```bash
   cd backend
   npm install
   npm start
   ```

###  Frontend Projesini Çalıştırma

1. Terminal veya komut istemcisini açın.
2. Projenin `frontend` dizinine geçin:
   
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
