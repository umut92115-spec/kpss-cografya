const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

async function generateWithRetry(prompt, keyIndex = 0) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEYS[keyIndex % API_KEYS.length]);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.log(`⚠️ Hata, anahtar ${keyIndex + 1} denendi...`);
    await new Promise(r => setTimeout(r, 5000));
    return generateWithRetry(prompt, keyIndex + 1);
  }
}

async function run() {
  console.log("🚀 Akdeniz Bölgesi Akademik Yenileme Operasyonu Başladı...");

  const prompt = `
    Sen kıdemli bir KPSS Coğrafya profesörüsün. Akdeniz Bölgesi için derinlemesine akademik bir içerik üret. 
    Lütfen aşağıdaki anahtarları içeren bir JSON objesi döndür. 
    İçerik "AI slop" olmasın, teknik (karstik, polye, terra-rossa, maki, psödömaki, geçitler, hinterland vb.) ve sınav odaklı olsun.

    JSON yapısı:
    {
      "konum": "...", "yer_sekilleri": "...", "jeoloji": "...", "su_ortusu": "...", 
      "iklim_bitki": "...", "toprak_cevre": "...", "nufus": "...", "tarim_hayvancilik": "...",
      "maden_enerji": "...", "sanayi_ticaret": "...", "ulasim_sinir": "...", 
      "turizm": "...", "kalkinma": "...", "kpss_altin_not": "...",
      "faqs": [30 adet soru-cevap objesi]
    }
  `;

  try {
    const response = await generateWithRetry(prompt);
    const cleaned = response.replace(/```json|```/g, "").trim();
    const akdenizData = JSON.parse(cleaned);

    const db = JSON.parse(fs.readFileSync('data/bolge-verileri.json', 'utf8'));
    db.akdeniz = akdenizData;
    fs.writeFileSync('data/bolge-verileri.json', JSON.stringify(db, null, 2));
    
    console.log("✅ Akdeniz Bölgesi başarıyla güncellendi! 30 SSS ve akademik analizler hazır.");
  } catch (e) {
    console.error("❌ Başarısız:", e.message);
  }
}

run();
