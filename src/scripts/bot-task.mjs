import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();
    const SITE_URL = "https://kpsscografya.com.tr";

    console.log("🚀 Bot başlatıldı (Tam Sürüm)...");

    // 1. MODEL KEŞFİ
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listRes.json();
    const workingModel = listData.models.find(m => m.supportedGenerationMethods.includes("generateContent") && (m.name.includes("flash") || m.name.includes("pro")));

    // 2. KONU SEÇİMİ (ATLAMALI)
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
    
    let topicSlug = "";
    let content = "";
    let attempts = 0;

    while (attempts < rotation.topics.length) {
      topicSlug = rotation.topics[rotation.last_index];
      const mdxPath = `content/konu/${topicSlug}.mdx`;
      if (fs.existsSync(mdxPath)) {
        content = fs.readFileSync(mdxPath, "utf-8");
        break;
      } else {
        rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
        attempts++;
      }
    }

    // 3. REKLAM (09, 14, 21)
    const trHour = (new Date().getUTCHours() + 3) % 24;
    if ([9, 14, 21].includes(trHour)) {
      const ad = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, text: ad, parse_mode: "Markdown" }) });
    }

    // 4. ÖSYM TARZI SORU ÜRETİMİ
    console.log(`🧠 Soru üretiliyor: ${topicSlug}`);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${workingModel.name}:generateContent?key=${key}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Sen bir KPSS uzmanısın. ÖSYM tarzı 4 şıklı bir quiz üret. JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "", "suggested_image": "" } \n İÇERİK: ${content}` }] }]
      })
    });
    const geminiData = await geminiResponse.json();
    const questionData = JSON.parse(geminiData.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());

    // 5. TELEGRAM GÖNDERİMİ (Görsel + Anket)
    const topicImages = imageMap[topicSlug];
    const selectedImage = questionData.suggested_image || (Array.isArray(topicImages) ? topicImages[0] : topicImages);

    if (selectedImage && selectedImage !== "null") {
      const imageUrl = `${SITE_URL}/images/konu/${selectedImage}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA" }) });
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: questionData.question.substring(0, 295),
        options: questionData.options.map(o => o.substring(0, 95)),
        type: "quiz",
        correct_option_id: questionData.correct_index,
        explanation: questionData.explanation.substring(0, 195),
        is_anonymous: true
      }),
    });

    // 6. GÜVENLİ KAYIT VE ROTASYON
    console.log("✅ Başarıyla tamamlandı!");
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));

    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    let quizData = [];
    try {
      if (fs.existsSync(quizPath)) quizData = JSON.parse(fs.readFileSync(quizPath, "utf-8"));
    } catch (e) { quizData = []; }
    if (!Array.isArray(quizData)) quizData = [];
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
