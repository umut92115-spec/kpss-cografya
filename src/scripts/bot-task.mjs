import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    console.log("🚀 Bot başlatıldı...");
    console.log(`🔑 API Anahtarı Kontrolü: ${key ? key.substring(0, 5) + "****" : "YOK!"}`);

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // --- REKLAM ---
    const now = new Date();
    const trHour = (now.getUTCHours() + 3) % 24;
    if (trHour === 9 || trHour === 14 || trHour === 21) {
      console.log("📢 Reklam gönderiliyor...");
      const adMessage = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: adMessage, parse_mode: "Markdown" }),
      });
    }

    // --- MODEL LİSTESİ VE SORU ÜRETİMİ ---
    console.log("🔍 Kullanılabilir modeller sorgulanıyor (v1 API)...");
    
    // v1 API üzerinden modelleri listeleyelim
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listResponse.json();

    if (listData.models) {
      console.log("✅ Bulunan Gerçek Modeller:");
      listData.models.forEach(m => console.log(`- ${m.name}`));
      
      // Listeden bir model seçelim (varsa flash, yoksa ilkini al)
      const targetModel = listData.models.find(m => m.name.includes("flash"))?.name || listData.models[0].name;
      const cleanModelName = targetModel.replace("models/", "");
      console.log(`🎯 Seçilen Model: ${cleanModelName}`);

      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: cleanModelName });

      // Konu seçimi
      const rotation = JSON.parse(fs.readFileSync("data/rotation.json", "utf-8"));
      const topicSlug = rotation.topics[rotation.last_index];
      const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

      console.log(`🧠 Soru üretiliyor: ${topicSlug}`);
      const prompt = `KPSS Coğrafya sorusu üret. JSON formatında: { "question": "", "options": [], "correct_index": 0, "explanation": "" } \n\n İÇERİK: ${content}`;
      
      const result = await model.generateContent(prompt);
      const questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

      // Telegram'a at
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          question: questionData.question,
          options: questionData.options,
          type: "quiz",
          correct_option_id: questionData.correct_index,
          explanation: questionData.explanation
        }),
      });

      console.log("✅ Başarıyla tamamlandı.");
    } else {
      console.error("❌ Google API modelleri vermedi. Cevap:", JSON.stringify(listData));
    }
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
