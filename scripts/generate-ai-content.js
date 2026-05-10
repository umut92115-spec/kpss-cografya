const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  "AIzaSyDQmZ0ZDtjjYP42tWqukG9J459HMForCHU",
  "AIzaSyBDTY4duWbPrzDxUYu0v8Cy7S5y9u4f1kw"
].filter(Boolean);

let currentKeyIndex = 0;
let genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
let model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

function rotateKey() {
  currentKeyIndex++;
  if (currentKeyIndex < API_KEYS.length) {
    console.log(`\n🔄 Kota doldu, ${currentKeyIndex + 1}. anahtara geçiliyor...`);
    genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
    model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    return true;
  }
  return false;
}

const illerPath = path.join(__dirname, '../data/iller.json');
const iller = JSON.parse(fs.readFileSync(illerPath, 'utf8'));

const konularList = [
  // Kullanıcının "el attığı" ana konular (Skip listesinde oldukları için script bunlara dokunmaz)
  { slug: "ticaret", name: "Ticaret" },
  { slug: "jeolojik-yapi", name: "Jeolojik Yapı ve İç Kuvvetler" },
  { slug: "bolge-jeopolitik", name: "Bölge Kavramı ve Jeopolitik" },
  { slug: "kalkinma-projeleri", name: "Bölgesel Kalkınma Projeleri" },
  { slug: "akarsular", name: "Akarsular" },
  { slug: "kiyi-tipleri", name: "Kıyı Tipleri ve Denizler" },
  // Tüm Coğrafi Konular (Sırayla tamamlanacak)
  { slug: "iklim-bitki", name: "İklim ve Bitki Örtüsü" },
  { slug: "tarim", name: "Tarım ve Hayvancılık" },
  { slug: "madenler-enerji", name: "Madenler ve Enerji Kaynakları" },
  { slug: "beseri-cografya", name: "Beşeri Coğrafya" },
  { slug: "yer-sekilleri", name: "Yer Şekilleri" },
  { slug: "daglar", name: "Dağlar" },
  { slug: "goller", name: "Göller" },
  { slug: "ulasim", name: "Ulaşım" },
  { slug: "sanayi", name: "Sanayi" },
  { slug: "turizm", name: "Turizm" },
  { slug: "cografi-konum", name: "Coğrafi Konum" },
  { slug: "toprak-cevre", name: "Toprak ve Doğal Çevre" },
  { slug: "sinir-kapilari", name: "Sınır Komşuları ve Kapıları" }
];

const outDir = path.join(__dirname, '../data/matris');
const progressFile = path.join(__dirname, '../AI_PROGRESS.md');

function initProgressFile() {
  if (!fs.existsSync(progressFile)) {
    const content = `# 🚀 Yapay Zeka İçerik Üretim Süreci (GÜNCEL: 10 FAQ & Sınav Odaklı)\n\nBu dosya otomatik olarak güncellenmektedir.\n\n## Genel Durum\n- **Toplam Hedef:** ${konularList.length * iller.length} sayfa\n- **Başlangıç Zamanı:** ${new Date().toLocaleString('tr-TR')}\n\n## Tamamlananlar\n| Konu | İl | Durum | Zaman |\n| :--- | :--- | :---: | :--- |\n`;
    fs.writeFileSync(progressFile, content);
  } else {
    fs.appendFileSync(progressFile, `\n\n## 🔄 İŞLEM YENİDEN BAŞLATILDI (${new Date().toLocaleString('tr-TR')})\n`);
  }
}

function updateProgress(konu, il, durum) {
  const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const line = `| ${konu} | ${il} | ✅ ${durum} | ${time} |\n`;
  fs.appendFileSync(progressFile, line);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function generateContentForIlAndKonu(il, konu) {
  let specificInstructions = "";
  let sectionTitles = ["", "", ""];
  
  switch(konu.slug) {
    case 'bolge-jeopolitik':
      specificInstructions = `Bölge kavramı (şekilsel, fonksiyonel), ilin jeopolitik konumu, kavşak noktası olma özelliği, stratejik önemi ve bölgesel sınıflandırmalardaki yerini akademik düzeyde analiz et.`;
      sectionTitles = ["Bölgesel Sınıflandırma ve Fonksiyonel Analiz", "Jeopolitik Konum ve Stratejik Önem", "Mekansal Organizasyon ve Etki Alanı"];
      break;
    case 'kalkinma-projeleri':
      specificInstructions = `İlin dahil olduğu bölgesel kalkınma projelerini (DAP, GAP, DOKAP, KOP, ZBK vb.), projenin teknik hedeflerini, ilin bu projedeki ekonomik rolünü ve projeyle hedeflenen sosyo-ekonomik dönüşümü anlat.`;
      sectionTitles = ["Bölgesel Kalkınma Projeleri ve Teknik Hedefler", "İlin Proje Kapsamındaki Role ve Ekonomik Vizyonu", "Sürdürülebilir Kalkınma ve Gelecek Projeksiyonları"];
      break;
    case 'akarsular':
      specificInstructions = `İlin akarsu ağını, debi ve rejim özelliklerini, aşındırma ve biriktirme şekillerini, baraj potansiyelini, havza özelliklerini ve akarsuların il ekonomisindeki (sulama, enerji vb.) yerini anlat.`;
      sectionTitles = ["Hidrografik Yapı ve Akarsu Rejimleri", "Aşınım-Birikim Şekilleri ve Havza Analizi", "Su Kaynaklarının Ekonomik ve Stratejik Değeri"];
      break;
    case 'kiyi-tipleri':
      specificInstructions = `Kıyı morfolojisini, kıyı tipini (boyuna, enine, ria, dalmaçya vb.), kıta sahanlığı (şelf) genişliğini, falez veya delta oluşumlarını ve denizel etkilerin iç kesimlere ulaşma durumunu teknik detaylarla anlat.`;
      sectionTitles = ["Kıyı Morfolojisi ve Kıyı Tipi Analizi", "Kıta Sahanlığı ve Denizel Etkileşim Süreçleri", "Liman Kapasitesi ve Kıyı Şeridi Ekonomik Coğrafyası"];
      break;
    case 'iklim-bitki':
      specificInstructions = `İlin iklim tipini, yıllık sıcaklık ve yağış ortalamalarını, ekstrem hava olaylarını, hakim rüzgar yönünü ve doğal bitki örtüsünün (maki, bozkır, orman vb.) il içindeki dikey ve yatay dağılımını analiz et.`;
      sectionTitles = ["Klimatolojik Parametreler ve Yağış Rejimi", "Vejetasyon Analizi ve Bitki Toplulukları", "İklimin Ekonomik ve Beşeri Faaliyetlere Etkisi"];
      break;
    case 'tarim':
      specificInstructions = `İlin tarımsal potansiyelini, en çok üretilen ürünleri, Türkiye üretimindeki payını, hayvancılık türlerini (besi, mera, kümes, ipek böcekçiliği vb.) ve uygulanan tarım yöntemlerini (intansif, ekstansif) detaylandır.`;
      sectionTitles = ["Tarımsal Üretim Deseni ve Ürün Analizi", "Zootekni ve Hayvancılık Faaliyetleri", "Tarımsal Ekonomi ve Modernizasyon Süreçleri"];
      break;
    case 'madenler-enerji':
      specificInstructions = `İl sınırlarındaki maden yataklarını, rezerv durumlarını, aktif işletmeleri, enerji üretim tesislerini (HES, RES, JES, Termik vb.) ve bu kaynakların il ekonomisindeki stratejik yerini teknik verilerle anlat.`;
      sectionTitles = ["Metalik ve Endüstriyel Maden Envanteri", "Enerji Kaynakları ve Üretim Projeksiyonları", "Maden İşleme Sanayii ve Lojistik Altyapı"];
      break;
    case 'nufus-politikalari':
    case 'beseri-cografya':
      specificInstructions = `Nüfus yoğunluğunu, yerleşme dokusunu (toplu, dağınık), göç hareketlerini (iç/dış), demografik yapıyı ve ilin nüfus politikaları çerçevesindeki gelişimini analiz et.`;
      sectionTitles = ["Demografik Yapı ve Nüfus Dinamikleri", "Yerleşme Coğrafyası ve Şehirleşme Karakteri", "Sosyo-Ekonomik Göstergeler ve Göç Analizi"];
      break;
    case 'turizm':
      specificInstructions = `İlin turizm çeşitliliğini (deniz, kültür, inanç, yayla, termal vb.), tescilli turizm merkezlerini, konaklama kapasitesini ve turizmin ilin gayrisafi hasılasındaki payını detaylıca anlat.`;
      sectionTitles = ["Turizm Potansiyeli ve Tematik Çeşitlilik", "Kültürel Miras ve Marka Değerler", "Hizmet Sektörü ve Turizm Ekonomisi Analizi"];
      break;
    case 'ulasim':
      specificInstructions = `Ulaşım ağlarını, kavşak noktası olma özelliğini, geçitleri, tünelleri, havalimanı/liman kapasitelerini ve lojistik köy/merkez projelerini teknik olarak analiz et.`;
      sectionTitles = ["Ulaşım Ağları ve Lojistik Hub Analizi", "Stratejik Geçitler ve Altyapı Yatırımları", "Ticari Akış ve Erişilebilirlik Projeksiyonları"];
      break;
    default:
      specificInstructions = `Konuyu en ince ayrıntısına kadar teknik ve akademik bir dille analiz et.`;
      sectionTitles = ["Genel Teknik Analiz", "Stratejik Detaylar", "Mekansal Yansımalar"];
  }

  const prompt = `
Sen Türkiye'nin en kıdemli Coğrafya Akademisyeni ve KPSS uzmanısın. 
Şu an ${il.ad} ili için ${konu.name} konusunu en ince ayrıntısına kadar analiz eden, ANSİKLOPEDİK DERİNLİKTE bir sayfa hazırlıyorsun.

HEDEF: ${il.ad} - ${konu.name}
ÖZEL ANALİZ ÇERÇEVESİ: ${specificInstructions}

İÇERİK KURALLARI (MAKSİMUM KALİTE):
1. KONU ÖZETİ (SNIPPET) - KRİTİK: "snippet" alanı KESİNLİKLE 50-70 KELİME arasında olmalıdır. Kartın içinde görüneceği için öz, vurucu ve teknik olmalı.
2. AKADEMİK DETAY: "detay" alanı en az 300-400 kelimelik, konuyu akademik bir dille özetleyen metin olmalı.
3. SECTION İÇERİKLERİ: Her "content" alanı en az 5-6 uzun paragraftan oluşmalı (en az 350-400 kelime). Teknik terimleri ve neden-sonuç ilişkilerini detaylıca anlat.
4. ZENGİN TABLOLAR: "table" tipindeki data alanı en az 8-10 satır ve 4 sütun olmalı.
5. 10 ADET DERİN FAQ: Sorular akademik derinlikte, cevaplar ise en az 4-5 cümle olmalı.

YALNIZCA geçerli bir JSON döndür. Markdown bloğu (\`\`\`json) KULLANMA.

JSON YAPISI:
{
  "detay": "Konunun akademik özeti (300-400 kelime)...",
  "kpss_notu": "Sınavda kesin soru getirecek altın bilgi...",
  "faqs": [], 
  "super_detay": {
    "title": "${il.ad} ${konu.name} — Akademik ve Teknik Analiz",
    "meta": "${il.ad} ili ${konu.name} hakkında derinlemesine veriler ve KPSS notları.",
    "h1": "${il.ad}: ${konu.name} Kapsamlı Analizi",
    "snippet": "BURAYA 50-70 KELİMELİK VURUCU ÖZETİ YAZ (KESİNLİKLE BU ARALIKTA KAL)...",
    "sections": [
      { 
        "h2": "${sectionTitles[0]}", 
        "content": "En az 5-6 paragraf akademik metin...", 
        "type": "table", 
        "data": [
          ["Birim/Özellik", "Teknik Analiz", "Sınav Değeri", "Akademik Not"],
          ["Satır 1", "...", "...", "..."],
          ["Satır 2", "...", "...", "..."],
          ["Satır 3", "...", "...", "..."],
          ["Satır 4", "...", "...", "..."],
          ["Satır 5", "...", "...", "..."],
          ["Satır 6", "...", "...", "..."],
          ["Satır 7", "...", "...", "..."],
          ["Satır 8", "...", "...", "..."]
        ] 
      },
      { 
        "h2": "${sectionTitles[1]}", 
        "content": "En az 5-6 paragraf akademik metin...", 
        "type": "vurgu", 
        "data": "En önemli teknik detay..." 
      },
      { 
        "h2": "${sectionTitles[2]}", 
        "content": "En az 5-6 paragraf akademik metin...", 
        "type": "map", 
        "data": "Harita üzerindeki kritik nokta..." 
      }
    ],
    "faqs": [
       {"q": "...", "a": "..."},
       // ... 10 ADET
    ],
    "last_updated": "Mayıs 2026"
  },
  "onemli_not": "Akademik kapanış özeti..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    if (data.super_detay && data.super_detay.faqs) {
      data.super_detay.faqs = data.super_detay.faqs.map(item => {
        const q = item.q || item.question || item.soru || item.Question || "";
        const a = item.a || item.answer || item.cevap || item.Answer || "";
        return { q, a };
      });
    }
    return data;
  } catch (error) {
    const errorMsg = error.message || "";
    if (errorMsg.includes('429') || errorMsg.includes('Quota') || errorMsg.includes('503') || errorMsg.includes('limit')) {
      if (rotateKey()) {
        console.log(`\n⚠️ Hata alındı (${errorMsg.substring(0, 50)}...), yeni anahtarla tekrar deneniyor...`);
        return await generateContentForIlAndKonu(il, konu);
      } else {
        console.log(`\n🚫 Tüm anahtarların kotası dolmuş olabilir. 60 saniye bekleniyor...`);
        await new Promise(resolve => setTimeout(resolve, 60000));
        currentKeyIndex = -1;
        if (rotateKey()) return await generateContentForIlAndKonu(il, konu);
      }
    }
    console.error(`Error generating for ${il.ad} - ${konu.name}:`, error.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  initProgressFile();

  const skipKonular = [
    'ticaret', 
    'jeolojik-yapi', 
    'bolge-jeopolitik', 
    'kalkinma-projeleri', 
    'akarsular', 
    'kiyi-tipleri'
  ];
  const activeKonular = konularList.filter(k => !skipKonular.includes(k.slug));

  for (const k of activeKonular) {
    let allFinished = false;
    
    while (!allFinished) {
      const targetPath = path.join(outDir, `${k.slug}.json`);
      let mevcutData = { konu: k.slug, versiyon: "2026", iller: {} };

      if (fs.existsSync(targetPath)) {
        try {
          mevcutData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        } catch (e) {
          console.warn(`${targetPath} okunurken hata oluştu.`);
        }
      }

      let missingCount = 0;
      for (const il of iller) {
        const ilData = mevcutData.iller[il.slug];
        const faqCount = ilData?.super_detay?.faqs?.length || ilData?.faqs?.length || 0;

        if (faqCount >= 10) {
          continue;
        }

        missingCount++;
        console.log(`[DENETİM] ${il.ad} - ${k.name} eksik veya hatalı, üretiliyor... (${missingCount}. eksik)`);
        const generated = await generateContentForIlAndKonu(il, k);
        if (generated) {
          mevcutData.iller[il.slug] = generated;
          fs.writeFileSync(targetPath, JSON.stringify(mevcutData, null, 2));
          updateProgress(k.name, il.ad, 'Başarılı (Denetim)');
        }
        await delay(4000);
      }

      if (missingCount === 0) {
        console.log(`\n✅ TEBRİKLER! "${k.name}" konusu için 81 ilin tamamı başarıyla doğrulandı. Bir sonraki konuya geçiliyor...\n`);
        allFinished = true;
      } else {
        console.log(`\n🔄 "${k.name}" için ${missingCount} il işlendi. Son bir kontrol yapılıyor...\n`);
      }
    }
  }
  
  console.log("\n🏁 TÜM PROJE TAMAMLANDI! 81 il ve tüm konular akademik standartlarda üretildi.");
}

main().catch(console.error);
