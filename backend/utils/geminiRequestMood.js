const axios = require('axios');
const config = require('../config');

const getMoodMusicSuggestions = async (mood) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.gemini.apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
                        Bana bu "${mood}" duygusuna göre 10 türkçe ve yabancı müzik önerisi yap.
                        Her öneri şarkının adı ve sanatçısı olacak şekilde aşağıdaki JSON formatında dön:

                        {
                        "mood": "Duygu",
                        "songs": [
                            { "trackName": "şarkı 1", "artistName": "sanatçı 1" },
                            { "trackName": "şarkı 2", "artistName": "sanatçı 2" },
                            ...
                            { "trackName": "şarkı 10", "artistName": "sanatçı 10" }
                        ]
                        }

                        Sadece geçerli JSON verisi üret, açıklama ekleme.
                    `
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      }
    );

    const aiText = res.data.candidates[0].content.parts[0].text;
    const cleanText = aiText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    return parsed;

  } catch (err) {
    console.error('Gemini yöresel müzik hatası:', err.message);
    return null;
  }
}

module.exports = getMoodMusicSuggestions;
