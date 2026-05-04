import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();
    const SITE_URL = "https://kpsscografya.com.tr";

    console.log("🚀 Bot başlatıldı...");

    // 1. ÇALIŞAN MODELİ BUL
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listRes.json();
    const workingModel = listData.models.find(m => m.supportedGenerationMethods.includes("generateContent") && (m.name.includes("flash") || m.name.includes("pro")));
    if (!workingModel) throw new Error("Çalışan Gemini modeli bulunamadı.");

    // 2. KONU SEÇİMİ (DOSYA KONTROLLÜ)
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    
    let topicSlug = "";
    let content = "";
    let attempts = 0;

    // Dosya bulunana kadar rotasyonu döndür (Maksimum konu sayısı kadar dene)
    while (attempts < rotation.topics.length) {
      topicSlug = rotation.topics[rotation.last_index];
      const mdxPath = `content/konu/${topicSlug}.mdx`;

      if (fs.existsSync(mdxPath)) {
        content = fs.readFileSync(mdxPath, "utf-8");
        console.log(`✅ Konu bulundu: ${topicSlug}`);
        break;
      } else {
        console.warn(`⚠️ Dosya eksik, atlanıyor: ${topicSlug}`);
        rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
        attempts++;
      }
    }

    if (!content) throw new Error("Hiçbir geçerli konu dosyası bulunamadı!");

    // 3. GEMINI ÜRETİMİ
    console.log(`🧠 Soru üretiliyor: ${topicSlug}`);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${workingModel.name}:generateContent?key=${key}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Sen bir KPSS uzmanısın. İçerikten %60, uzmanlığından %40 katarak ÖSYM tarzı 4 şıklı bir quiz üret. JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "" } \n İÇERİK: ${content}` }] }]
      })
    });
    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates[0].content.parts[0].text;
    const questionData = JSON.parse(rawText.replace(/```json|```/g, "").trim());

    // 4. TELEGRAM GÖNDERİMİ
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
    const topicImages = imageMap[topicSlug];
    const selectedImage = questionData.suggested_image || (Array.isArray(topicImages) ? topicImages[0] : topicImages);

    if (selectedImage && selectedImage !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${selectedImage}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA" }) });
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

    const pollResult = await pollRes.json();
    if (pollResult.ok) {
      console.log(`✅ BAŞARILI! Kanal: ${pollResult.result.chat.title}`);
      
      // Kayıt ve Rotasyon Güncelleme
      rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
      fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));
      
      const quizPath = `data/quiz/${topicSlug}.json`;
      if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
      let quizData = [];
      try { quizData = JSON.parse(fs.readFileSync(quizPath, "utf-8")); } catch (e) { quizData = []; }
      quizData.push({ ...questionData, created_at: new Date().toISOString() });
      fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    } else {
      console.error("❌ Telegram Hatası:", JSON.stringify(pollResult));
    }

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
