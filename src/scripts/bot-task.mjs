import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();
    const SITE_URL = "https://kpsscografya.com.tr";

    console.log("🚀 Bot başlatıldı...");

    // 1. MODEL KEŞFİ
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listRes.json();
    const workingModel = listData.models.find(m => m.supportedGenerationMethods.includes("generateContent") && (m.name.includes("flash") || m.name.includes("pro")));

    // 2. KONU SEÇİMİ (ATLAMALI)
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    let topicSlug = "";
    let content = "";
    let attempts = 0;

    while (attempts < rotation.topics.length) {
      topicSlug = rotation.topics[rotation.last_index];
      const mdxPath = `content/konu/${topicSlug}.mdx`;
      if (fs.existsSync(mdxPath)) {
        content = fs.readFileSync(mdxPath, "utf-8");
        console.log(`✅ Konu bulundu: ${topicSlug}`);
        break;
      } else {
        rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
        attempts++;
      }
    }

    // 3. GEMINI ÜRETİMİ (ŞIK SINIRIYLA)
    console.log(`🧠 Soru üretiliyor: ${topicSlug}`);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${workingModel.name}:generateContent?key=${key}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Sen bir KPSS uzmanısın. ÖSYM tarzı 4 şıklı bir quiz üret. 
        ÖNEMLİ: Her bir şık (option) MAX 90 karakter olmalı. 
        JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "" } \n İÇERİK: ${content}` }] }]
      })
    });
    const geminiData = await geminiResponse.json();
    const questionData = JSON.parse(geminiData.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());

    // --- ŞIKLARI VE AÇIKLAMAYI ZORLA KIRP ---
    const safeOptions = questionData.options.map(opt => opt.substring(0, 95));
    const safeExplanation = questionData.explanation.substring(0, 195);
    const safeQuestion = questionData.question.substring(0, 295);

    // 4. TELEGRAM GÖNDERİMİ
    console.log("📤 Telegram'a gönderiliyor...");
    const pollRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: safeQuestion,
        options: safeOptions,
        type: "quiz",
        correct_option_id: questionData.correct_index,
        explanation: safeExplanation,
        is_anonymous: false
      }),
    });

    const pollResult = await pollRes.json();
    if (pollResult.ok) {
      console.log(`✅ BAŞARILI! Kanal: ${pollResult.result.chat.title}`);
      rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
      fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));
    } else {
      console.error("❌ Telegram Hatası:", JSON.stringify(pollResult));
    }

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
