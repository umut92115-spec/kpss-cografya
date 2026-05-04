import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

// Bekleme fonksiyonu (retry için)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const SITE_URL = "https://kpsscografya.com.tr";

    console.log("🚀 Bot başlatıldı...");
    const now = new Date();
    const trHour = (now.getUTCHours() + 3) % 24;

    const genAI = new GoogleGenerativeAI(key);

    // --- 1. REKLAM (09, 14, 21) ---
    if (trHour === 9 || trHour === 14 || trHour === 21) {
      const adMessage = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: adMessage, parse_mode: "Markdown" }),
      });
      console.log("📢 Reklam gönderildi.");
    }

    // --- 2. HAP BİLGİ (11, 17, 23) ---
    if (trHour === 11 || trHour === 17 || trHour === 23) {
      // Hap bilgi üretim mantığı... (Soru üretimiyle aynı model döngüsünü kullanacak)
    }

    // --- 3. AKILLI MODEL DÖNGÜSÜ (SORU ÜRETİMİ) ---
    const rotation = JSON.parse(fs.readFileSync("data/rotation.json", "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let questionData = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`🧠 Soru üretiliyor (${modelName})...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `Sen bir ÖSYM Coğrafya uzmanısın. İçerikten %60, uzmanlığından %40 katarak ÖSYM tarzı 4 şıklı bir quiz üret. 
        JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "" }
        İÇERİK: ${content}`;
        
        const result = await model.generateContent(prompt);
        questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
        if (questionData) break;
      } catch (e) {
        console.warn(`⚠️ ${modelName} başarısız oldu, 2 sn bekleniyor...`);
        await sleep(2000);
      }
    }

    if (!questionData) throw new Error("Gemini modelleri cevap vermedi.");

    // --- 4. TELEGRAM GÖNDERİMİ ---
    const selectedImage = questionData.suggested_image || (imageMap[topicSlug] ? (Array.isArray(imageMap[topicSlug]) ? imageMap[topicSlug][0] : imageMap[topicSlug]) : null);

    if (selectedImage && selectedImage !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${selectedImage}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA" }),
      });
    }

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
      console.log("✅ Anket başarıyla gönderildi!");
      rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
      const quizPath = `data/quiz/${topicSlug}.json`;
      if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
      let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
      quizData.push({ ...questionData, created_at: new Date().toISOString() });
      fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
      fs.writeFileSync("data/rotation.json", JSON.stringify(rotation, null, 2));
    }

    console.log("🏁 Bitti.");
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
