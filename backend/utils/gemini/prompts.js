/**
 * Gemini prompt şablonları
 * Tüm promptlar tek yerde; değişiklik ve A/B test için uygun
 */
const PROMPT = {
  /**
   * Basit mood çıkarımı - tek kelime döner
   * Kullanım: Hızlı Spotify sorgusu için basit sınıflandırma
   */
  simpleMood: (message) =>
    `You are a music mood classifier. Analyze the emotional tone of the following user message and classify it into a single mood category.

User message: "${message}"

Mood classification criteria:
- happy:     joy, excitement, celebration, good news, positivity
- sad:       grief, loss, loneliness, disappointment, heartbreak
- calm:      relaxation, peace, focus, meditation, serenity
- energetic: motivation, workout, hype, high energy, action

Rules:
- Choose EXACTLY ONE mood from: happy, sad, calm, energetic
- If the emotional tone is ambiguous, default to "calm"
- Respond with ONLY the mood word — no punctuation, no explanation, no extra text`,

  /**
   * Mood bazlı şarkı önerileri - JSON array
   * Kullanım: Mood'a göre Spotify'da aranacak gerçek şarkı listesi
   */
  moodMusic: (mood) =>
    `You are a professional music curator. List exactly 10 real songs that match the "${mood}" mood.

Rules:
- The "mood" field in your JSON output MUST be exactly: ${mood}
- The array key MUST be "songs" — do NOT use "tracks" or any other key
- Include 4-5 Turkish songs and 5-6 international songs
- All songs must be real and available on Spotify; max 1 song per artist
- Replace every trackName and artistName below with actual song data

Output ONLY the following JSON — no markdown, no code fences, no extra text:
{"mood":"${mood}","songs":[{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"}]}`,

  /**
   * Yöresel müzik önerileri - JSON array
   * Kullanım: Belirli bir bölgenin geleneksel/folk müziğini keşfetmek
   */
  regionMusic: (region) =>
    `You are an expert in regional folk music. List exactly 10 real traditional songs from the "${region}" region.

Rules:
- The "region" field in your JSON output MUST be exactly: ${region}
- The array key MUST be "songs" — do NOT use "tracks" or any other key
- All songs must be real and genuinely from "${region}"; use original local-language titles
- Prefer songs that are searchable on Spotify; max 1 song per artist
- Replace every trackName and artistName below with actual song data

Output ONLY the following JSON — no markdown, no code fences, no extra text:
{"region":"${region}","songs":[{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"},{"trackName":"FILL","artistName":"FILL"}]}`,

  /**
   * Yapılandırılmış duygu analizi - JSON objesi
   * Kullanım: Kullanıcı mesajından derin duygu analizi + Spotify arama parametreleri
   */
  structuredMood: (message) =>
    `You are a music therapist and sentiment analyst. Analyze the user message below and return a JSON object for personalized music recommendations.

User message: "${message.replace(/"/g, '\\"')}"

CRITICAL: You MUST return a complete JSON object with ALL FOUR fields. Do not omit any field.

Return ONLY a valid JSON object. Here is the exact structure you must follow:

{
  "mood": "sad",
  "reason": "Kullanıcının mesajında derin bir hüzün ve yalnızlık hissi sezilmektedir. Bu ruh hali için sakin ve melankolik parçalar uygun olacaktır.",
  "genre": "indie folk",
  "suggestedKeywords": ["melancholic indie", "sad acoustic", "emotional folk", "heartbreak songs"]
}

Field requirements (you must fill ALL FOUR fields):
1. mood: MUST be exactly one of — calm, happy, sad, energetic, angry, dreamy, nostalgic, romantic, anxious, hopeful, confident, melancholic
2. reason: Write 2-3 sentences in Turkish that explain the emotional tone detected in the message
3. genre: One specific music genre/subgenre (e.g. "lo-fi hip hop", "classical piano", "neo-soul", "ambient pop", "indie folk", "pop rock")
4. suggestedKeywords: Array of exactly 4 English phrases optimized for Spotify search (combine mood + genre + tempo descriptors)

IMPORTANT: 
- Output ONLY the JSON object with your real analysis values
- Include ALL FOUR fields in your response
- No markdown, no code blocks, no text before or after the JSON
- Ensure the JSON is complete and properly closed with all brackets and braces`,
};

module.exports = { PROMPT };
