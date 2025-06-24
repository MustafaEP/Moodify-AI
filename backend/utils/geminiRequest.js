const axios = require('axios')

const geminiApiKey = process.env.GEMINI_API_KEY

const getMoodFromGemini = async (message) => {
  try {
    const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      contents: [
        {
          parts: [{ 
            text: `Kullanıcının ruh hali mesajı: "${message}". 
            Buna en uygun ruh hali tek kelimeyle ne olurdu? 
            Sadece şu mood'lardan biri olsun: happy, sad, calm, energetic. Cevabın sadece mood kelimesi olsun.` }]
        }
      ]
    })

    const text = res.data.candidates[0].content.parts[0].text.trim()
    return text

  } catch (err) {
    console.error('Gemini API hatası:', err)
    return 'calm'  // hata olursa varsayılan
  }
}

module.exports = getMoodFromGemini
