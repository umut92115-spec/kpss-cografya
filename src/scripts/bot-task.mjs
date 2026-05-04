import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    console.log("🔍 Kullanılabilir modeller listeleniyor...");
    
    // API'den tüm modelleri çekiyoruz
    // Not: Bu işlem için bir model ismi gerekmez
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();

    if (data.models) {
      console.log("✅ Bulunan Modeller:");
      data.models.forEach(m => {
        console.log(`- ${m.name} (Desteklenen metotlar: ${m.supportedGenerationMethods.join(", ")})`);
      });
    } else {
      console.log("❌ Modeller alınamadı, API cevabı:", JSON.stringify(data));
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Kritik Hata:", error);
    process.exit(1);
  }
}

run();
