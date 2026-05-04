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

    // --- GÖRSEL HARİTASI ---
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
    const availableImages = Object.values(imageMap).flatMap((v) => 
      typeof v === 'object' ? Object.values(v).flat() : v
    );

    // --- GEMINI SORU ÜRETİMİ (ÖSYM TARZI) ---
    console.log(`🧠 ÖSYM tarzı soru üretiliyor (${topicSlug})...`);
    const prompt = `Sen bir ÖSYM Coğrafya soru hazırlama uzmanısın. 
    Aşağıdaki içeriği %60 temel alarak, %40 kendi genel kültür ve uzmanlık bilgilerini katarak ÖSYM FORMATINDA bir soru üret.
    
    ÖNEMLİ KURALLAR:
    - Soru net ve akademik olsun.
    - Sadece JSON formatında cevap ver.
    - Soru max 250, açıklama (explanation) max 180 karakter olsun.
    - Şıklar 4 adet olsun.
    
    İÇERİK: ${content}
    GÖRSEL HAVUZU: ${availableImages.join(", ")}
    
    JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "image.png veya null" }`;
    
    const result = await model.generateContent(prompt);
    const questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // --- TELEGRAM GÖNDERİMİ ---
    
    // 1. Varsa Görseli Gönder
    if (questionData.suggested_image && questionData.suggested_image !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${questionData.suggested_image}`;
      console.log(`🖼️ Görsel gönderiliyor: ${questionData.suggested_image}`);
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: CHAT_ID, 
          photo: imageUrl, 
          caption: "🧭 KPSS COĞRAFYA - Görsel Destekli Soru" 
        }),
      });
    }

    // 2. Anketi Gönder
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

    const pollResult = await pollRes.json();
    if (pollResult.ok) {
      console.log("✅ Anket başarıyla gönderildi!");
    } else {
      console.error("❌ Telegram Hatası:", JSON.stringify(pollResult));
    }

    // --- KAYIT ---
    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
