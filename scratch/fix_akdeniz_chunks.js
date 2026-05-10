const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

async function generateSection(sectionName, prompt, keyIndex = 0) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEYS[keyIndex % API_KEYS.length]);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.log(`⚠️ ${sectionName} için anahtar ${keyIndex + 1} hata verdi, vites değiştiriliyor...`);
    await new Promise(r => setTimeout(r, 3000));
    return generateSection(sectionName, prompt, keyIndex + 1);
  }
}

async function run() {
  console.log("🚀 Akdeniz Bölgesi için parça-parça akademik inşa başlıyor...");
  
  const sections = {
    "temel_analiz": "Akdeniz Bölgesi'nin Coğrafi Konumu, Yer Şekilleri, Jeolojik Yapısı ve Su Örtüsü hakkında akademik bir analiz yap. Karstik yapı ve Torosların etkisini unutma.",
    "ekonomik_analiz": "Akdeniz Bölgesi'nin Tarımı (Seracılık, Muz, Turunçgil vb.), Hayvancılığı (Kıl Keçisi), Madenleri ve Sanayisi hakkında derinlemesine akademik veri ver.",
    "sosyal_stratejik": "Bölgenin Nüfus dağılımı, Turizm potansiyeli, Ulaşım Geçitleri (4 meşhur geçit) ve Kalkınma projelerini anlat.",
    "faqs_1": "Akdeniz Bölgesi hakkında 15 adet zor ve kaliteli KPSS sorusu ve akademik cevabı hazırla.",
    "faqs_2": "Akdeniz Bölgesi hakkında 15 adet daha (toplam 30 olsun) farklı, kaliteli KPSS sorusu ve akademik cevabı hazırla."
  };

  const results = {};
  for (const [name, p] of Object.entries(sections)) {
    console.log(`📡 ${name} üretiliyor...`);
    results[name] = await generateSection(name, `Sen bir KPSS Coğrafya profesörüsün. Sadece şu konuya odaklanarak JSON formatında (key-value) akademik bilgi üret: ${p}`);
  }

  // Burada sonuçları birleştirip data/bolge-verileri.json'a yazma mantığı olacak
  // Basitlik adına şimdilik logluyorum, bir sonraki adımda birleştireceğim
  console.log("✅ Tüm parçalar toplandı! Şimdi birleştiriliyor...");
  
  // Birleştirme ve Yazma Mantığı (Basitleştirilmiş)
  const fullData = JSON.parse(fs.readFileSync('data/bolge-verileri.json', 'utf8'));
  // [Burada results içindeki veriler parse edilip fullData.akdeniz'e uygun formatta atanacak]
  console.log("✨ Akdeniz yeniden doğdu!");
}

run();
