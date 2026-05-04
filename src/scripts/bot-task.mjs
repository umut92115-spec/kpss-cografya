import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("🚀 Bot başlatıldı...");

    // --- MODEL BULMA ---
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listResponse.json();
    const targetModel = listData.models.find(m => m.name.includes("flash"))?.name || listData.models[0].name;
    const cleanModelName = targetModel.replace("models/", "");

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: cleanModelName });

    // --- KONU VE ROTASYON ---
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    // --- GEMINI SORU ÜRETİMİ ---
    console.log(`🧠 Soru üretiliyor (${cleanModelName}): ${topicSlug}`);
    const prompt = `Sen bir KPSS Coğrafya uzmanısın. Aşağıdaki içerikten 4 şıklı bir quiz sorusu üret. 
    ÖNEMLİ: Cevap sadece JSON olsun. Soru max 250, açıklama max 180 karakter olsun.
    JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "" } 
    İÇERİK: ${content}`;
    
    const result = await model.generateContent(prompt);
    const questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // --- TELEGRAM GÜVENLİK SINIRLARI ---
    const cleanExplanation = questionData.explanation.substring(0, 195);
    const cleanQuestion = questionData.question.substring(0, 295);

    // --- TELEGRAM ANKET GÖNDERİMİ ---
    const pollRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: cleanQuestion,
        options: questionData.options,
        type: "quiz",
        correct_option_id: questionData.correct_index,
        explanation: cleanExplanation,
        is_anonymous: false
      }),
    });

    const pollResult = await pollRes.json();
    if (pollResult.ok) {
      console.log("✅ Anket başarıyla gönderildi!");
    } else {
      throw new Error(`Telegram Hatası: ${JSON.stringify(pollResult)}`);
    }

    // --- KAYIT İŞLEMİ ---
    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    
    let quizData = [];
    try {
      if (fs.existsSync(quizPath)) {
        const fileContent = fs.readFileSync(quizPath, "utf-8");
        quizData = JSON.parse(fileContent);
        if (!Array.isArray(quizData)) quizData = []; // Liste değilse sıfırla
      }
    } catch (e) {
      quizData = []; // Bozuksa sıfırla
    }

    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));

    console.log("🏁 Her şey başarıyla tamamlandı.");

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
