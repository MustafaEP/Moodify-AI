# Moodify-AI

** Moodify-AI is a full-stack web application integrated with services like Spotify and Gemini AI. This document provides step-by-step instructions on how to set up and run the application locally.

---

##  Installation Guide

Follow the steps below to easily set up the application in your local environment.

---

##  Configuring Environment Variables

Open the env.txt file located in your project's backend folder, fill in the following details, and save it in .env format:

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

###  Obtaining Spotify API Credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Create a new application.
3. Copy the Client ID and Client Secret values from the app page and enter them into the .env file:

   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

###  Obtaining Gemini API Key

1. Navigate to the [Gemini API Anahtar Sayfası](https://aistudio.google.com/app/apikey).
2. Log in using your Google account.
3. Create a new API key.
4. Paste your newly created API key into the `.env` file:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

###  Obtaining MongoDB URI

The application needs a MongoDB connection URI. You can use one of two methods to set this connection:
---

####  Option 1: Using Local MongoDB

f MongoDB is installed on your computer and you want to work with a local database, you can use the following URI:

```env
MONGO_URI=mongodb://localhost:27017/moodmelody
```
#### Option 2: Obtaining MongoDB URI from MongoDB Atlas

1. Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster or use an existing one.
3. Click the Connect button on the cluster.
4. Select Connect Your Application.
5. Copy the connection URI provided.
6. Paste this URI into the `.env` file:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/moodmelody

###  Running the Backend Project

1. Open a terminal or command prompt.
2. Navigate to the backend directory:
   
   ```bash
   cd backend
   npm install
   npm start
   ```

###  Running the Frontend Project

1. Open a terminal or command prompt.
2. Navigate to the frontend directory:
   
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
