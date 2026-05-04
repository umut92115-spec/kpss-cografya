import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const SITE_URL = "https://kpsscografya.com.tr";

    const now = new Date();
    const trHour = (now.getUTCHours() + 3) % 24;

    const genAI = new GoogleGenerativeAI(key);
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listResponse.json();
    const targetModel = listData.models.find(m => m.name.includes("flash"))?.name || listData.models[0].name;
    const model = genAI.getGenerativeModel({ model: targetModel.replace("models/", "") });

    // --- 1. REKLAM (09, 14, 21) ---
    if (trHour === 9 || trHour === 14 || trHour === 21) {
      const adMessage = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: adMessage, parse_mode: "Markdown" }),
      });
    }

    // --- 2. HAP BİLGİ / KONU ANLATIMI (11, 17, 23) ---
    if (trHour === 11 || trHour === 17 || trHour === 23) {
      const rotation = JSON.parse(fs.readFileSync("data/rotation.json", "utf-8"));
      const topicSlug = rotation.topics[rotation.last_index];
      const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");
      
      const prompt = `Sen bir KPSS eğitmenisin. Aşağıdaki içerikten en önemli bir kavramı seç ve öğrencilerin aklında kalacak 2-3 cümlelik çok kısa bir hap bilgi/konu anlatımı hazırla. Başlıkta emoji kullan. 
      İÇERİK: ${content}`;
      
      const result = await model.generateContent(prompt);
      const explanation = result.response.text();

      // İlgili görseli bul
      const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
      const topicImages = imageMap[topicSlug];
      const selectedImage = Array.isArray(topicImages) ? topicImages[0] : (typeof topicImages === 'object' ? Object.values(topicImages)[0][0] : topicImages);

      const message = `📖 *GÜNÜN BİLGİSİ*\n\n${explanation}\n\n📍 Daha fazlası için: [kpsscografya.com.tr](https://kpsscografya.com.tr)`;

      if (selectedImage) {
        const imageUrl = `${SITE_URL}/images/konu/${selectedImage}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: message, parse_mode: "Markdown" }),
        });
      } else {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
        });
      }
      console.log("📖 Hap bilgi paylaşıldı.");
    }

    // --- 3. STANDART QUIZ SORUSU (Her saat başı, reklam veya hap bilgi olmayan saatlerde daha iyi olur ama hepsinde çalışabilir) ---
    // Reklam veya hap bilgi saatleri dışındaysak (veya hepsinde) soru atalım
    const rotation = JSON.parse(fs.readFileSync("data/rotation.json", "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    const prompt = `Sen bir ÖSYM Coğrafya uzmanısın. İçerikten %60, uzmanlığından %40 katarak ÖSYM tarzı 4 şıklı bir quiz üret. 
    JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "" }
    İÇERİK: ${content}`;
    
    const result = await model.generateContent(prompt);
    const questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // Telegram'a at (Fotoğraf varsa fotoğraflı, yoksa düz)
    if (questionData.suggested_image && questionData.suggested_image !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${questionData.suggested_image}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA - Görsel Soru" }),
      });
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
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

    // Kayıt
    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    fs.writeFileSync("data/rotation.json", JSON.stringify(rotation, null, 2));

    console.log("✅ Başarıyla tamamlandı.");
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
