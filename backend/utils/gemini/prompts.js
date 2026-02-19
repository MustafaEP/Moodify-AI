/**
 * Gemini prompt şablonları
 * Tüm promptlar tek yerde; değişiklik ve A/B test için uygun
 */
const PROMPT = {
  /** Basit mood çıkarımı - tek kelime döner */
  simpleMood: (message) =>
    `Kullanıcının ruh hali mesajı: "${message}".
Buna en uygun ruh hali tek kelimeyle ne olurdu?
Sadece şu mood'lardan biri olsun: happy, sad, calm, energetic.
Cevabın sadece mood kelimesi olsun.`,

  /** Mood bazlı şarkı önerileri - JSON */
  moodMusic: (mood) =>
    `"${mood}" duygusuna göre 10 türkçe ve yabancı müzik önerisi yap. Yanıtında sadece aşağıdaki JSON yapısını üret, başka hiçbir metin ekleme:

{"mood":"${mood}","songs":[{"trackName":"şarkı adı","artistName":"sanatçı adı"},...]}

Her şarkı için trackName ve artistName zorunlu. Toplam 10 şarkı. Sadece JSON çıktı ver.`,

  /** Yöresel müzik önerileri - JSON */
  regionMusic: (region) =>
    `"${region}" yöresine ait 10 geleneksel veya yöresel müzik önerisi yap. Yanıtında sadece aşağıdaki JSON yapısını üret, başka hiçbir metin ekleme:

{"region":"${region}","songs":[{"trackName":"şarkı adı","artistName":"sanatçı adı"},...]}

Her şarkı için trackName ve artistName zorunlu. Toplam 10 şarkı. Sadece JSON çıktı ver.`,

  /** Yapılandırılmış duygu analizi - JSON */
  structuredMood: (message) =>
    `Aşağıdaki kullanıcı mesajını analiz et ve duygu analizi yap. Yanıtında SADECE geçerli JSON üret, başka hiçbir metin yazma.

Mesaj: "${message.replace(/"/g, '\\"')}"

JSON yapısı (bu anahtarları kullan, çift tırnak kullan):
{
  "mood": "calm",
  "reason": "kısa analiz",
  "genre": "müzik türü",
  "suggestedKeywords": ["kelime1", "kelime2"]
}

mood sadece şunlardan biri olmalı: calm, happy, sad, energetic, angry, dreamy, nostalgic, romantic, anxious, hopeful, confident, melancholic
suggestedKeywords: müzik araması için 2-5 İngilizce kelime. Sadece JSON çıktı ver.`,
};

module.exports = { PROMPT };
