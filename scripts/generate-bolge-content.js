const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  "AIzaSyDQmZ0ZDtjjYP42tWqukG9J459HMForCHU",
  "AIzaSyBDTY4duWbPrzDxUYu0v8Cy7S5y9u4f1kw"
].filter(Boolean);

let currentKeyIndex = 0;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function generateWithRotation(prompt) {
  while (currentKeyIndex < API_KEYS.length) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      if (error.message.includes("429") || error.message.includes("quota")) {
        console.log(`🔄 Kota doldu, ${currentKeyIndex + 2}. anahtara geçiliyor...`);
        currentKeyIndex++;
        if (currentKeyIndex >= API_KEYS.length) {
          console.log("🚫 Tüm anahtarların kotası dolmuş olabilir. 60 saniye bekleniyor...");
          await delay(60000);
          currentKeyIndex = 0;
        }
      } else {
        throw error;
      }
    }
  }
}

const bolgeler = [
  { id: "akdeniz", ad: "Akdeniz Bölgesi" },
  { id: "ege", ad: "Ege Bölgesi" },
  { id: "marmara", ad: "Marmara Bölgesi" },
  { id: "karadeniz", ad: "Karadeniz Bölgesi" },
  { id: "ic-anadolu", ad: "İç Anadolu Bölgesi" },
  { id: "dogu-anadolu", ad: "Doğu Anadolu Bölgesi" },
  { id: "guneydogu-anadolu", ad: "Güneydoğu Anadolu Bölgesi" }
];

const dataPath = path.join(__dirname, "../data/bolge-verileri.json");

async function start() {
  let veriler = {};
  if (fs.existsSync(dataPath)) {
    veriler = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }

  for (const bolge of bolgeler) {
    console.log(`\n🏗️ ${bolge.ad} için akademik içerik üretiliyor...`);

    const prompt = `
      Sen bir kıdemli coğrafya profesörü ve KPSS uzmanısın. 
      ${bolge.ad} hakkında KESİNLİKLE "AI slop" olmayan, son derece teknik, akademik ve sınav odaklı bir içerik hazırla.

      Şu JSON yapısında çıktı ver:
      {
        "konum": "En az 3 paragraf, matematik ve özel konum analizi (Jeopolitik dahil).",
        "yer_sekilleri": "En az 3 paragraf, dağların uzanışı, platolar ve ovaların oluşumu.",
        "jeoloji": "Tektonik yapı, fay hatları ve kayaç yapısı analizi.",
        "su_ortusu": "Akarsu rejimleri, önemli göller ve yeraltı suları.",
        "iklim_bitki": "Detaylı iklim verileri ve vejetasyon (bitki örtüsü) kuşakları.",
        "toprak_cevre": "Toprak tipleri ve bölgeyi bekleyen çevresel riskler.",
        "nufus": "Nüfus yoğunluğu, yerleşme tipleri ve göç dinamikleri.",
        "tarim_hayvancilik": "Tarımsal üretim verileri ve hayvancılık türleri.",
        "maden_enerji": "Maden yatakları ve enerji santralleri analizi.",
        "sanayi_ticaret": "Sanayi kolları ve ticaret potansiyeli.",
        "ulasim_sinir": "Ulaşım koridorları, geçitler ve sınır kapıları.",
        "turizm": "Turizm çeşitliliği ve ekonomik katkısı.",
        "kalkinma": "Bölgeyi kapsayan kalkınma projeleri (GAP, DAP, DOKAP, KOP vb.) analizi.",
        "kpss_altin_not": "Sınavda çıkması %100 beklenen, kimsenin bilmediği o detay bilgi.",
        "faqs": [
          // BURAYA TAM 30 ADET SORU VE CEVAP EKLE. { "q": "...", "a": "..." } formatında. 
          // Sorular keyword odaklı, derin ve KPSS'de çıkabilecek "zor" sorulardan oluşmalı.
        ]
      }

      DİKKAT: Sadece JSON döndür. Başka metin ekleme.
    `;

    try {
      const response = await generateWithRotation(prompt);
      const cleanJson = response.replace(/```json|```/g, "").trim();
      const bolgeVerisi = JSON.parse(cleanJson);
      
      veriler[bolge.id] = bolgeVerisi;
      fs.writeFileSync(dataPath, JSON.stringify(veriler, null, 2));
      console.log(`✅ ${bolge.ad} başarıyla güncellendi (30 SSS eklendi).`);
      
      await delay(5000); // API limitlerine takılmamak için
    } catch (err) {
      console.error(`❌ ${bolge.ad} üretilirken hata:`, err.message);
    }
  }

  console.log("\n✨ TÜM BÖLGELER ŞAHLANDIRILDI! ✨");
}

start();
