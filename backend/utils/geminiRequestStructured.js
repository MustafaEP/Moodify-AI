const axios = require('axios');

const getStructuredMoodFromGemini = async (message) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
                        Kullanıcının mesajı:
                        "${message}"

                        Görev:
                        Bu mesajı analiz et ve aşağıdaki JSON formatında duygu analizi yap:
                        {
                            "mood": "calm | happy | sad | energetic | angry | dreamy | nostalgic | romantic | anxious | hopeful | confident | melancholic",
                            "reason": "<analiz açıklaması>",
                            "genre": "<uygun müzik türü>",
                            "suggestedKeywords": ["kelime1", "kelime2", ...]
                        }

                        Sadece geçerli JSON çıktısı üret. Açıklama ekleme.
                    `
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 200,
          topK: 1
        }
      }
    );
    
    const aiText = res.data.candidates[0].content.parts[0].text;
    const cleanText = aiText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    
    return parsed;

  } catch (err) {
    console.error('Gemini structured error:', err.message);
    return null;
  }
};

module.exports = getStructuredMoodFromGemini;
