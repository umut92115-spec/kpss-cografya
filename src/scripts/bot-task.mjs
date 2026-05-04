import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    console.log("🚀 Bot başlatıldı...");
    
    // 1. Konu Seçimi (Rotation)
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    
    // Index güncelle
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    
    // 2. Konu İçeriğini Oku
    const mdxPath = `content/konu/${topicSlug}.mdx`;
    if (!fs.existsSync(mdxPath)) throw new Error(`Konu dosyası bulunamadı: ${mdxPath}`);
    const content = fs.readFileSync(mdxPath, "utf-8");

    // 3. Görsel Eşleşmelerini Oku
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
    const availableImages = Object.values(imageMap).flatMap((v) => 
      typeof v === 'object' ? Object.values(v).flat() : v
    );

    // 4. Gemini ile Soru Üret
    console.log(`🧠 Gemini soru üretiyor (${topicSlug})...`);
    // En geniş uyumluluğa sahip 'gemini-pro' modelini kullanıyoruz.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Sen bir KPSS Coğrafya uzmanısın. Aşağıdaki içeriğe dayanarak interaktif bir soru üret.
    
    İÇERİĞİ: ${content}
    
    MEVCUT GÖRSELLER: ${availableImages.join(", ")}
    
    JSON FORMATINDA CEVAP VER:
    {
      "question": "Soru metni (max 300 karakter)",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "Açıklama (max 200 karakter)",
      "suggested_image": "image.png veya null"
    }`;

    const result = await model.generateContent(prompt);
    const questionData = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // 5. Telegram'a Gönder
    console.log("📤 Telegram'a gönderiliyor...");
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (questionData.suggested_image && questionData.suggested_image !== "null") {
      const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/images/konu/${questionData.suggested_image}`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, photo: imageUrl, caption: "🧭 KPSS COĞRAFYA" }),
      });
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        question: questionData.question,
        options: questionData.options,
        is_anonymous: false,
        type: "quiz",
        correct_option_id: questionData.correct_index,
        explanation: questionData.explanation
      }),
    });

    // 6. Dosyaları Kaydet (Quiz ve Rotation)
    const quizPath = `data/quiz/${topicSlug}.json`;
    let quizData = [];
    if (fs.existsSync(quizPath)) quizData = JSON.parse(fs.readFileSync(quizPath, "utf-8"));
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));

    console.log("✅ Başarıyla tamamlandı.");
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
