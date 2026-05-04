import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("🚀 Bot başlatıldı...");
    console.log(`📍 Chat ID: ${CHAT_ID}`);

    // --- REKLAM ---
    const now = new Date();
    const trHour = (now.getUTCHours() + 3) % 24;
    if (trHour === 9 || trHour === 14 || trHour === 21) {
      const adMessage = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: adMessage, parse_mode: "Markdown" }),
      });
      console.log(`📢 Reklam Durumu: ${res.status}`);
    }

    // --- MODEL VE SORU ---
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listResponse.json();
    const targetModel = listData.models.find(m => m.name.includes("flash"))?.name || listData.models[0].name;
    const cleanModelName = targetModel.replace("models/", "");

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: cleanModelName });

    const rotation = JSON.parse(fs.readFileSync("data/rotation.json", "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    console.log(`🧠 Soru üretiliyor (${cleanModelName}): ${topicSlug}`);
    const prompt = `KPSS Coğrafya uzmanısın. Şu içerikten bir anket sorusu üret. JSON: { "question": "", "options": [], "correct_index": 0, "explanation": "" } \n\n İÇERİK: ${content}`;
    
    const result = await model.generateContent(prompt);
    const questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // --- TELEGRAM ANKET ---
    const pollRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: questionData.question,
        options: questionData.options,
        type: "quiz",
        correct_option_id: questionData.correct_index,
        explanation: questionData.explanation,
        is_anonymous: false
      }),
    });

    const pollResult = await pollRes.json();
    if (pollResult.ok) {
      console.log("✅ Anket başarıyla gönderildi!");
    } else {
      console.error("❌ Telegram Hatası:", JSON.stringify(pollResult));
    }

    // Kaydet
    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    fs.writeFileSync("data/rotation.json", JSON.stringify(rotation, null, 2));

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
