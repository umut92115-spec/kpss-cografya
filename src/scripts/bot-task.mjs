import fs from "fs";
import 'dotenv/config';

async function run() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("🚀 Bot başlatıldı (Akıllı API Modu)...");

    // --- 1. ÇALIŞAN MODELLERİ LİSTELE ---
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listRes.json();
    
    if (!listData.models) {
      console.error("❌ Model listesi alınamadı:", JSON.stringify(listData));
      throw new Error("API Anahtarı modelleri göremiyor.");
    }

    // Üretim yapabilen modelleri filtrele (Flash veya Pro tercih et)
    const workingModel = listData.models.find(m => 
      m.supportedGenerationMethods.includes("generateContent") && 
      (m.name.includes("flash") || m.name.includes("pro"))
    );

    if (!workingModel) throw new Error("Çalışan bir Gemini modeli bulunamadı.");
    
    console.log(`🎯 Seçilen ve Çalışan Model: ${workingModel.name}`);

    // --- 2. KONU VE İÇERİK ---
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    // --- 3. SEÇİLEN MODELLE ÜRETİM ---
    console.log(`🧠 Soru üretiliyor: ${topicSlug}`);
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${workingModel.name}:generateContent?key=${key}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Sen bir KPSS Coğrafya uzmanısın. Şu içerikten ÖSYM tarzı 4 şıklı bir anket sorusu üret. 
            CEVABI SADECE JSON OLARAK VER:
            { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "" }
            
            İÇERİK: ${content}`
          }]
        }]
      })
    });

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates[0].content.parts[0].text;
    const questionData = JSON.parse(rawText.replace(/```json|```/g, "").trim());

    // --- 4. TELEGRAM ---
    console.log("📤 Telegram'a gönderiliyor...");
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

    console.log("✅ Başarıyla tamamlandı!");
    
    // Kayıt ve Rotasyon
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));
    
    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));

  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
