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

    // 2. MODEL LİSTESİ ÇEKME
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const listData = await listResponse.json();
    
    const availableModels = listData.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));

    // 3. KONU VE ROTASYON
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    const content = fs.readFileSync(`content/konu/${topicSlug}.mdx`, "utf-8");

    // 4. DETAYLI HATA LOGLU ÜRETİM
    let questionData = null;
    console.log(`🔎 Toplam ${availableModels.length} model için detaylı analiz başlıyor...`);

    for (const modelName of availableModels) {
      try {
        console.log(`--- 🧪 Model Deneniyor: ${modelName} ---`);
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `ÖSYM tarzı 4 şıklı bir coğrafya sorusu üret. JSON: { "question": "", "options": ["A","B","C","D"], "correct_index": 0, "explanation": "" } \n İÇERİK: ${content}`;
        
        const result = await model.generateContent(prompt);
        questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
        
        if (questionData) {
          console.log(`✅ BAŞARILI: ${modelName}`);
          break;
        }
      } catch (e) {
        // HATAYI TAM OLARAK BURADA GÖRECEĞİZ
        console.error(`❌ ${modelName} HATASI:`, e.message);
        continue;
      }
    }

    if (!questionData) throw new Error("Hiçbir model çalıştırılamadı. Logları kontrol et.");

    // --- 5. TELEGRAM GÖNDERİMİ ---
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
      console.log("✅ Gönderildi!");
      rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
      fs.writeFileSync("data/rotation.json", JSON.stringify(rotation, null, 2));
    }

  } catch (error) {
    console.error("❌ Kritik Hata:", error.message);
    process.exit(1);
  }
}

run();
