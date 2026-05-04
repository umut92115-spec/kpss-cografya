import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    // Boşlukları temizle (GitHub Secret'ta bazen kalabiliyor)
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();
    const SITE_URL = "https://kpsscografya.com.tr";

    console.log("🚀 Bot başlatıldı...");
    console.log(`📍 Hedef Chat ID (Doğrulanıyor): ${CHAT_ID}`);

    // 1. ÇALIŞAN MODELİ BUL
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listRes.json();
    const workingModel = listData.models.find(m => m.supportedGenerationMethods.includes("generateContent") && (m.name.includes("flash") || m.name.includes("pro")));
    if (!workingModel) throw new Error("Çalışan Gemini modeli bulunamadı.");

    // 2. KONU VE İÇERİK
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));

    // 3. SAAT KONTROLÜ (TR Saati)
    const trHour = (new Date().getUTCHours() + 3) % 24;

    // --- REKLAM (09, 14, 21) ---
    if ([9, 14, 21].includes(trHour)) {
      const ad = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n📚 Çıkmış sorular, interaktif haritalar ve dahası için:\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, text: ad, parse_mode: "Markdown" }) });
      console.log(`📢 Reklam Durumu: ${(await res.json()).ok ? "BAŞARILI" : "HATA"}`);
    }

    // --- ÖSYM TARZI SORU ÜRETİMİ ---
    console.log(`🧠 Soru üretiliyor: ${topicSlug}`);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${workingModel.name}:generateContent?key=${key}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Sen bir KPSS uzmanısın. Şu içerikten %60, uzmanlığından %40 katarak ÖSYM tarzı 4 şıklı bir quiz üret. JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "" } \n İÇERİK: ${content}` }] }]
      })
    });
    const geminiData = await geminiResponse.json();
    const questionData = JSON.parse(geminiData.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());

    // --- GÖRSEL VE ANKET GÖNDERİMİ ---
    const topicImages = imageMap[topicSlug];
    const selectedImage = questionData.suggested_image || (Array.isArray(topicImages) ? topicImages[0] : topicImages);

    if (selectedImage && selectedImage !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${selectedImage}`;
      const imgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA" }) });
      console.log(`🖼️ Görsel Durumu: ${(await imgRes.json()).ok ? "GÖNDERİLDİ" : "BAŞARISIZ"}`);
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
      console.log(`✅ ANKET BAŞARILI! Kanal: ${pollResult.result.chat.title}`);
      
      // Kayıt
      rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
      fs.writeFileSync("data/rotation.json", JSON.stringify(rotation, null, 2));
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
