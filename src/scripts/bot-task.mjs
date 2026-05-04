import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    console.log("🚀 Bot başlatıldı...");
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // --- REKLAM / TANITIM ÖZELLİĞİ ---
    const now = new Date();
    // GitHub Actions UTC kullanır, Türkiye saati için +3 ekliyoruz
    const trHour = (now.getUTCHours() + 3) % 24;
    
    // Sabah 09:00, Öğle 14:00, Akşam 21:00
    if (trHour === 9 || trHour === 14 || trHour === 21) {
      console.log("📢 Reklam saati, mesaj gönderiliyor...");
      const adMessage = `🌟 *KPSS Coğrafya'yı Haritalarla Keşfedin!*\n\n📚 Tüm konular, interaktif haritalar ve çıkmış soru analizleri ücretsiz olarak sitemizde.\n\n🔗 [kpsscografya.com.tr](https://kpsscografya.com.tr)\n\n📍 Başarılar dileriz! 🧭`;
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: CHAT_ID, 
          text: adMessage, 
          parse_mode: "Markdown",
          disable_web_page_preview: false 
        }),
      });
    }

    // --- SORU ÜRETİMİ ---
    // 1. Konu Seçimi (Rotation)
    const rotationPath = "data/rotation.json";
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    
    // 2. Konu İçeriğini Oku
    const mdxPath = `content/konu/${topicSlug}.mdx`;
    const content = fs.readFileSync(mdxPath, "utf-8");

    // 3. Görsel Eşleşmelerini Oku
    const imageMap = JSON.parse(fs.readFileSync("data/image-map.json", "utf-8"));
    const availableImages = Object.values(imageMap).flatMap((v) => 
      typeof v === 'object' ? Object.values(v).flat() : v
    );

    // 4. Gemini ile Soru Üret
    console.log(`🧠 Gemini soru üretiyor (${topicSlug})...`);
    
    // Denenecek model isimleri listesi (404 hatasını aşmak için)
    const modelNames = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
    let result;
    let modelUsed = "";

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
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
        result = await model.generateContent(prompt);
        modelUsed = modelName;
        break; // Başarılı olursa döngüden çık
      } catch (e) {
        console.warn(`⚠️ ${modelName} denemesi başarısız oldu, sıradakine geçiliyor...`);
      }
    }

    if (!result) throw new Error("Hiçbir Gemini modeli çalıştırılamadı.");
    console.log(`✅ Model kullanıldı: ${modelUsed}`);

    const responseText = result.response.text().replace(/```json|```/g, "").trim();
    const questionData = JSON.parse(responseText);

    // 5. Telegram'a Gönder
    if (questionData.suggested_image && questionData.suggested_image !== "null") {
      const imageUrl = `https://kpsscografya.com.tr/images/konu/${questionData.suggested_image}`;
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

    // 6. Dosyaları Kaydet
    const quizPath = `data/quiz/${topicSlug}.json`;
    if (!fs.existsSync("data/quiz")) fs.mkdirSync("data/quiz", { recursive: true });
    let quizData = fs.existsSync(quizPath) ? JSON.parse(fs.readFileSync(quizPath, "utf-8")) : [];
    quizData.push({ ...questionData, created_at: new Date().toISOString() });
    
    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    fs.writeFileSync(rotationPath, JSON.stringify(rotation, null, 2));

    console.log("✅ İşlem başarıyla tamamlandı.");
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

run();
