const fs = require('fs');
const path = require('path');

const HOST = 'kpsscografya.com.tr';
const KEY = '7d5b29d9c6de4ec2b72bd6c56597b98e';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Veri dosyalarını oku
const iller = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/iller.json'), 'utf8'));
const konular = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/konular.json'), 'utf8')).filter(k => k.slug !== 'sozluk');

const urls = [];

// 1. Ana Sayfa
urls.push(`https://${HOST}/`);

// 2. Bölge Sayfaları
const bolgeler = [...new Set(iller.map(il => il.bolge_slug))];
bolgeler.forEach(b => {
  urls.push(`https://${HOST}/${b}bolgesi`);
});

// 3. İl ve İl-Konu Sayfaları
iller.forEach(il => {
  const bolgePath = `${il.bolge_slug}bolgesi`;
  urls.push(`https://${HOST}/${bolgePath}/il/${il.slug}`);
  
  konular.forEach(konu => {
    urls.push(`https://${HOST}/${bolgePath}/il/${il.slug}/${konu.slug}`);
  });
});

// 4. Genel Konu Sayfaları
konular.forEach(konu => {
  urls.push(`https://${HOST}/konu/${konu.slug}`);
});

console.log(`🚀 Toplam ${urls.length} URL toplandı. Gönderim başlıyor...`);

async function submitToIndexNow() {
  try {
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls
      })
    });

    if (response.ok) {
      console.log('✅ BAŞARILI! Tüm URL\'ler Bing ve Yandex\'e bildirildi.');
      console.log(`Durum Kodu: ${response.status}`);
    } else {
      const text = await response.text();
      console.log(`⚠️ Uyarı: Beklenmedik bir yanıt alındı (${response.status})`);
      console.log('Yanıt:', text);
    }
  } catch (error) {
    console.error('❌ HATA: Gönderim sırasında bir sorun oluştu:');
    console.error(error.message);
  }
}

submitToIndexNow();
