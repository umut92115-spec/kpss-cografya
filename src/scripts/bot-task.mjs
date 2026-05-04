import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const SITE_URL = "https://kpsscografya.com.tr";

    console.log("🚀 Bot başlatıldı...");

    // --- 1. REKLAM (09, 14, 21) ---
    const now = new Date();
    const trHour = (now.getUTCHours() + 3) % 24;
    if (trHour === 9 || trHour === 14 || trHour === 21) {
      const adMessage = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: adMessage, parse_mode: "Markdown" }),
      });
    }

    // --- 2. MODEL LİSTESİ ÇEKME ---
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listResponse.json();
    
    // Üretim yapabilen tüm modelleri bul (Flash ve Pro öncelikli)
    const availableModels = listData.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""))
      .sort((a, b) => b.includes("flash") ? 1 : -1); // Flash modellerini önceliklendir

    // --- 3. KONU VE ROTASYON ---
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    // --- 4. AKILLI SORU ÜRETİMİ (YEDEKLİ) ---
    let questionData = null;
    console.log(`🔎 Toplam ${availableModels.length} model denenecek...`);

    for (const modelName of availableModels) {
      try {
        console.log(`🧠 Model deneniyor: ${modelName}`);
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `Sen bir ÖSYM Coğrafya uzmanısın. Şu içerikten %60, uzmanlığından %40 katarak ÖSYM tarzı 4 şıklı bir quiz üret. 
        JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "" }
        İÇERİK: ${content}`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json|```/g, "").trim();
        questionData = JSON.parse(responseText);
        
        if (questionData) {
          console.log(`✅ ${modelName} ile soru başarıyla üretildi!`);
          break; // Başarılı, döngüden çık
        }
      } catch (e) {
        console.warn(`⚠️ ${modelName} meşgul veya hata verdi, sıradakine geçiliyor...`);
        continue;
      }
    }

    if (!questionData) throw new Error("Maalesef hiçbir model cevap vermedi.");

    // --- 5. TELEGRAM GÖNDERİMİ ---
    const cleanExplanation = questionData.explanation.substring(0, 195);
    const cleanQuestion = questionData.question.substring(0, 295);

    // Varsa Görsel
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
    const selectedImage = questionData.suggested_image || (imageMap[topicSlug] ? (Array.isArray(imageMap[topicSlug]) ? imageMap[topicSlug][0] : imageMap[topicSlug]) : null);

    if (selectedImage && selectedImage !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${selectedImage}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA - Görsel Soru" }),
      });
    }

    // Anket
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
      console.log("✅ Telegram'a başarıyla gönderildi!");
      
      // Kayıt ve Rotasyon Güncelleme (Sadece başarılı gönderimde)
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
