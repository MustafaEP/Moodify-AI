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
    `Bana "${mood}" duygusuna göre 10 türkçe ve yabancı müzik önerisi yap.
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

Sadece geçerli JSON verisi üret, açıklama ekleme.`,

  /** Yöresel müzik önerileri - JSON */
  regionMusic: (region) =>
    `Bana "${region}" yöresine ait 10 geleneksel veya yöresel müzik önerisi yap.
Her öneri şarkının adı ve sanatçısı olacak şekilde aşağıdaki JSON formatında dön:

{
  "region": "yöre adı",
  "songs": [
    { "trackName": "şarkı 1", "artistName": "sanatçı 1" },
    { "trackName": "şarkı 2", "artistName": "sanatçı 2" },
    ...
    { "trackName": "şarkı 10", "artistName": "sanatçı 10" }
  ]
}

Sadece geçerli JSON verisi üret, açıklama ekleme.`,

  /** Yapılandırılmış duygu analizi - JSON */
  structuredMood: (message) =>
    `Kullanıcının mesajı:
"${message}"

Görev:
Bu mesajı analiz et ve aşağıdaki JSON formatında duygu analizi yap:
{
  "mood": "calm | happy | sad | energetic | angry | dreamy | nostalgic | romantic | anxious | hopeful | confident | melancholic",
  "reason": "<analiz açıklaması>",
  "genre": "<uygun müzik türü>",
  "suggestedKeywords": ["kelime1", "kelime2", ...]
}

Sadece geçerli JSON çıktısı üret. Açıklama ekleme.`,
};

module.exports = { PROMPT };
