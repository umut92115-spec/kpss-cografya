const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const matrisDir = path.join(dataDir, 'matris');

const additionalData = {
  "bursa": {
    "tarim": {
      title: "Bursa Tarım ve Hayvancılık — KPSS Coğrafya | kpsscografya.com.tr",
      meta: "Bursa'da şeftali, zeytin ve ipekböcekçiliği başta olmak üzere tarım faaliyetleri. KPSS için Bursa tarım özeti.",
      h1: "Bilecik'te Hangi Tarım Ürünleri Yetişir? — KPSS Özet",
      snippet: "Bursa, verimli ovaları ve elverişli iklimiyle Türkiye'nin en önemli tarım merkezlerinden biridir. Şeftali üretiminde Türkiye lideri olan il, aynı zamanda Gemlik tipi sofralık zeytin üretiminde de dünya çapında bir markadır. İpekböcekçiliği ve dondurulmuş gıda sanayisi ile tarım-sanayi entegrasyonu en yüksek illerimizden biridir.",
      sections: [
        {
          h2: "Bursa'nın Öne Çıkan Tarım Ürünleri",
          content: "Bursa, meyve ve sebze üretiminde çeşitliliğin en fazla olduğu illerdendir.",
          type: "table",
          data: [
            { urun: "Şeftali", sira: "1. Sırada", not: "Bursa Ovası merkezi" },
            { urun: "Zeytin", sira: "Önemli Üretici", not: "Gemlik, Mudanya bölgesi" },
            { urun: "İpekböceği", sira: "Geleneksel", not: "Koza üretimi" }
          ]
        }
      ],
      faqs: [
        { q: "Bursa hangi tarım ürününde Türkiye'de 1. sıradadır?", a: "Bursa, özellikle şeftali üretiminde Türkiye'de birinci sıradadır." },
        { q: "Bursa'da hayvancılık faaliyetleri nelerdir?", a: "Bursa'da modern besicilik ve geleneksel ipekböcekçiliği faaliyetleri yürütülmektedir." }
      ]
    }
  },
  "istanbul": {
    "sanayi": {
      title: "İstanbul Sanayi Faaliyetleri — KPSS Coğrafya | kpsscografya.com.tr",
      meta: "İstanbul'un sanayi kapasitesi, OSB'ler ve üretim kolları. KPSS için İstanbul sanayi özeti.",
      h1: "İstanbul'da Sanayi Hangi Kollarda Gelişmiştir?",
      snippet: "İstanbul, Türkiye'nin sanayi üretiminin yaklaşık üçte birini tek başına gerçekleştiren devasa bir üretim merkezidir. Otomotivden tekstile, kimyadan gıdaya kadar hemen hemen her sanayi kolunda liderdir. Şehir içindeki sanayi tesisleri zamanla şehir dışına ve Kocaeli-Sakarya hattına doğru kaymaktadır.",
      sections: [
        {
          h2: "İstanbul'daki Başlıca Sanayi Bölgeleri",
          content: "İstanbul, çok sayıda Organize Sanayi Bölgesi (OSB) ile üretimin kalbidir.",
          type: "list",
          data: ["İkitelli OSB", "Dudullu OSB", "Tuzla Kimya Sanayicileri", "Beylikdüzü Mermerciler"]
        }
      ],
      faqs: [
        { q: "İstanbul'da sanayi neden çok gelişmiştir?", a: "Pazarlama imkanları, ulaşım kolaylığı, nitelikli iş gücü ve sermaye birikimi nedeniyle sanayi İstanbul'da yoğunlaşmıştır." },
        { q: "İstanbul sanayisi nereye doğru genişlemektedir?", a: "İstanbul sanayisi, yer darlığı ve çevresel etkiler nedeniyle doğuda Kocaeli, batıda ise Tekirdağ yönüne doğru genişlemektedir." }
      ]
    }
  }
};

const ilOzetlerUpdate = {
  "bilecik": [
    "Türkiye'nin mermer ve seramik üretim merkezidir.",
    "Şerbetçiotu üretiminde Türkiye'de tek üretim alanıdır.",
    "Bozüyük ilçesi, kavşak noktası olması nedeniyle sanayide gelişmiştir.",
    "Marmara, Ege ve İç Anadolu bölgelerinin kesişim noktasında yer alır.",
    "İpekyolu üzerinde tarihi bir öneme sahiptir."
  ],
  "adana": [
    "Türkiye'nin en büyük alüvyal ovası olan Çukurova üzerindedir.",
    "Soya fasulyesi üretiminde Türkiye 1.sidir.",
    "Mısır ve yer fıstığı üretiminde çok önemli paya sahiptir.",
    "Sanayileşmiş tarımın en iyi örneğidir.",
    "Feke ve Mansurlu'da önemli demir yatakları bulunur.",
    "İskenderun Demir-Çelik fabrikasının hammadde tedarikçisidir.",
    "Pamuk üretimi eskiden 1. iken şu an GAP ile Şanlıurfa'ya geçmiştir."
  ]
};

function updateMatris(ilSlug, konuSlug, data) {
  const filePath = path.join(matrisDir, `${konuSlug}.json`);
  if (!fs.existsSync(filePath)) return;
  const matris = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  matris.iller[ilSlug] = { ...matris.iller[ilSlug], super_detay: { ...data, last_updated: "Mayıs 2026" } };
  fs.writeFileSync(filePath, JSON.stringify(matris, null, 2));
}

function updateOzetler() {
  const filePath = path.join(dataDir, 'il-ozetler.json');
  const ozetler = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.entries(ilOzetlerUpdate).forEach(([il, notlar]) => { ozetler[il] = notlar; });
  fs.writeFileSync(filePath, JSON.stringify(ozetler, null, 2));
}

Object.entries(additionalData).forEach(([il, konular]) => {
  Object.entries(konular).forEach(([k, d]) => updateMatris(il, k, d));
});

updateOzetler();
console.log("Mock data generated for Bursa, İstanbul, Bilecik and Adana.");
