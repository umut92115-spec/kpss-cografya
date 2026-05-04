import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("🚀 Bot başlatıldı...");
    // Güvenlik için sadece son 4 haneyi yazdırıp kontrol edelim
    console.log(`📍 Hedef Chat ID (Son 4 hane): ...${CHAT_ID ? CHAT_ID.slice(-4) : "YOK!"}`);

    // 1. MODEL KEŞFİ
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listRes.json();
    const workingModel = listData.models.find(m => m.supportedGenerationMethods.includes("generateContent") && (m.name.includes("flash") || m.name.includes("pro")));

    // 2. KONU SEÇİMİ
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    // 3. GEMINI ÜRETİMİ
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${workingModel.name}:generateContent?key=${key}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Sen bir KPSS uzmanısın. Şu içerikten ÖSYM tarzı 4 şıklı bir quiz üret. JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "" } \n İÇERİK: ${content}` }] }]
      })
    });
    const geminiData = await geminiResponse.json();
    const questionData = JSON.parse(geminiData.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());

    // 4. TELEGRAM GÖNDERİMİ (DETAYLI LOGLU)
    console.log("📤 Telegram'a anket gönderiliyor...");
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
      console.log(`✅ BAŞARILI! Mesaj ID: ${pollResult.result.message_id}`);
      console.log(`📡 Gönderilen Chat: ${pollResult.result.chat.title} (@${pollResult.result.chat.username})`);
    } else {
      console.error("❌ Telegram Hatası:", JSON.stringify(pollResult));
    }

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
