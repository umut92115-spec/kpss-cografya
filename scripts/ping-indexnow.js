const fs = require('fs');
const path = require('path');
const https = require('https');

const baseUrl = 'https://kpsscografya.com.tr';
const key = '9c8e7f6d5a4b3c2d1e0f9a8b7c6d5e4f';
const keyLocation = `${baseUrl}/9c8e7f6d5a4b3c2d1e0f9a8b7c6d5e4f.txt`;

// Verileri oku
const iller = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/iller.json'), 'utf8'));
const konular = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/konular.json'), 'utf8'));

// URL listesi oluştur
const urlList = [
    baseUrl,
    `${baseUrl}/quiz`,
    `${baseUrl}/konu`,
    `${baseUrl}/il`
];

// Bölge sayfaları
const bolgeler = [...new Set(iller.map(il => il.bolge_slug))];
bolgeler.forEach(b => urlList.push(`${baseUrl}/${b}bolgesi`));

// İl ve İl-Konu sayfaları
iller.forEach(il => {
    urlList.push(`${baseUrl}/${il.bolge_slug}bolgesi/il/${il.slug}`);
    konular.filter(k => k.slug !== 'sozluk').forEach(konu => {
        urlList.push(`${baseUrl}/${il.bolge_slug}bolgesi/il/${il.slug}/${konu.slug}`);
    });
});

console.log(`🚀 Toplam ${urlList.length} URL hazırlandı. Bing ve Yandex'e bildiriliyor...`);

// IndexNow API verisi
const data = JSON.stringify({
    host: 'kpsscografya.com.tr',
    key: key,
    keyLocation: keyLocation,
    urlList: urlList.slice(0, 1000) // Bing 1000 URL sınırı (tek seferde)
});

const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`✅ IndexNow Durumu: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('❌ Hata:', error);
});

req.write(data);
req.end();

// Google Sitemap Ping (Opsiyonel)
https.get(`https://www.google.com/ping?sitemap=${baseUrl}/sitemap.xml`, (res) => {
    console.log(`🌐 Google Sitemap Ping: ${res.statusCode}`);
});
