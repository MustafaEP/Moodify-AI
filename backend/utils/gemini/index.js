/**
 * Gemini utils - merkezi export
 * İç modül kullanımı için; harici import'lar doğrudan geminiRequest vb. dosyalardan yapılır.
 */
module.exports = {
  generateContent: require('./client').generateContent,
  parseJsonResponse: require('./parseResponse').parseJsonResponse,
  PROMPT: require('./prompts').PROMPT,
  constants: require('./constants'),
};
