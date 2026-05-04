import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("🚀 Bot başlatıldı (V1 API Modu)...");

    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    // --- GEMINI V1 API İSTEĞİ ---
    console.log(`🧠 Gemini V1'e istek atılıyor: ${topicSlug}`);
    
    // Sürümü v1beta'dan v1'e çektik
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Sen bir KPSS Coğrafya uzmanısın. Şu içerikten ÖSYM tarzı 4 şıklı bir anket sorusu üret. 
            JSON FORMATINDA CEVAP VER:
            { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "" }
            
            İÇERİK: ${content}`
          }]
        }]
      })
    });

    const geminiData = await geminiResponse.json();
    
    if (geminiData.error) {
      console.error("❌ Google Hatası:", JSON.stringify(geminiData.error));
      throw new Error(geminiData.error.message);
    }

    const rawText = geminiData.candidates[0].content.parts[0].text;
    const questionData = JSON.parse(rawText.replace(/```json|```/g, "").trim());

    // --- TELEGRAM ---
    const pollRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: questionData.question.substring(0, 295),
        options: questionData.options,
        type: "quiz",
        correct_option_id: questionData.correct_index,
        explanation: questionData.explanation.substring(0, 195),
        is_anonymous: false
      }),
    });

    if ((await pollRes.json()).ok) {
      console.log("✅ Başarıyla tamamlandı!");
      rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
      fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));
      
      const quizPath = `data/quiz/${topicSlug}.json`;
      if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
      let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
      quizData.push({ ...questionData, created_at: new Date().toISOString() });
      fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    }

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
