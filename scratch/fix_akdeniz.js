const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

async function generateWithRetry(prompt, keyIndex = 0) {
  if (keyIndex >= API_KEYS.length) throw new Error("Tüm anahtarlar ve modeller denendi, sonuç yok.");
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEYS[keyIndex]);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Daha stabil model
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.log(`⚠️ Anahtar ${keyIndex + 1} hata verdi, tekrar deneniyor...`);
    await new Promise(r => setTimeout(r, 2000));
    return generateWithRetry(prompt, keyIndex + 1);
  }
}

async function run() {
  const prompt = `
    Sen kıdemli bir KPSS Coğrafya akademisyenisin. Akdeniz Bölgesi için "Akademik Otorite" seviyesinde, derinlemesine bir içerik üretmelisin. 
    İçerik doğrudan bilgi odaklı, teknik terimlerin (karstik, polye, alüvyal, kış ılıklığı, terra-rossa, maki, garig) doğru ve yerinde kullanıldığı bir yapıda olmalı.

    Aşağıdaki JSON formatında çıktı ver:
    {
      "konum": "Enlem, boylam, denizellik ve dağların uzanışının etkileri.",
      "yer_sekilleri": "Toroslar, ovalar (Çukurova, Silifke, Antalya), platolar (Teke, Taşeli), karstik şekiller.",
      "jeoloji": "Kalker yapısı, depremsellik, jeolojik evrim.",
      "su_ortusu": "Akarsu rejimleri ve Göller Yöresi analizi.",
      "iklim_bitki": "Akdeniz iklimi, kış ılıklığı, maki türleri, orman kuşakları.",
      "toprak_cevre": "Terra-Rossa, erozyon ve yangın riski.",
      "nufus": "Nüfusun dağılımı ve göç hareketleri.",
      "tarim_hayvancilik": "Modern tarım, seracılık, muz, mısır, kıl keçisi.",
      "maden_enerji": "Boksit, krom, barit ve enerji santralleri.",
      "sanayi_ticaret": "İskenderun Demir Çelik, Mersin Limanı, Serbest Bölgeler.",
      "ulasim_sinir": "4 ana geçit (Çubuk, Sertavul, Gülek, Belen) ve ulaşımdaki zorluklar/stratejiler.",
      "turizm": "Deniz, kış, yayla ve mağara turizmi.",
      "kalkinma": "Bölgesel projeler.",
      "kpss_altin_not": "Sınavda çıkabilecek can alıcı bir bilgi.",
      "faqs": [
        {"soru": "Soru metni (30 adet)", "cevap": "Akademik cevap"}
      ]
    }
    
    NOT: Kesinlikle 30 soru olsun. JSON formatı hatasız olsun.
  `;

  try {
    const text = await generateWithRetry(prompt);
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const jsonData = JSON.parse(cleanedText);

    const fullData = JSON.parse(fs.readFileSync('data/bolge-verileri.json', 'utf8'));
    fullData.akdeniz = jsonData;
    fs.writeFileSync('data/bolge-verileri.json', JSON.stringify(fullData, null, 2));
    console.log("✨ Akdeniz Bölgesi akademik içerikle başarıyla şahlandırıldı!");
  } catch (error) {
    console.error("❌ Kritik Hata:", error.message);
  }
}

run();
