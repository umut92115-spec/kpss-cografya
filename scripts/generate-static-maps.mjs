import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const trMap = {
  'ç': 'c', 'ğ': 'g', 'ş': 's', 'ü': 'u', 'ı': 'i', 'ö': 'o',
  'Ç': 'C', 'Ğ': 'G', 'Ş': 'S', 'Ü': 'U', 'İ': 'I', 'Ö': 'O'
};
function slugify(text) {
  let str = text.trim();
  for (let key in trMap) {
    str = str.replace(new RegExp(key, 'g'), trMap[key]);
  }
  return str.replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-').toLowerCase();
}

const geojsonPath = path.join(process.cwd(), 'public', 'maps', 'turkey-iller.geojson');
const outDir = path.join(process.cwd(), 'public', 'haritalar', 'iller');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const rawData = fs.readFileSync(geojsonPath, 'utf8');
const geoData = JSON.parse(rawData);

async function main() {
  console.log("Puppeteer başlatılıyor...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  for (const feature of geoData.features) {
    const ilAdi = feature.properties.name || feature.properties.il_adi;
    if (!ilAdi) continue;
    
    const slug = slugify(ilAdi);
    const outputPath = path.join(outDir, `${slug}.jpg`);
    
    if (fs.existsSync(outputPath)) {
        console.log(`[ATLANDI] ${ilAdi} (Zaten var)`);
        continue;
    }

    console.log(`[HAZIRLANIYOR] ${ilAdi}...`);
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 800px; height: 600px; background: #f8fafc; }
        #map { width: 100%; height: 100%; background: #f8fafc; }
        .leaflet-control-container { display: none; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const feature = ${JSON.stringify(feature)};
        const map = L.map('map', { zoomControl: false, attributionControl: false, fadeAnimation: false });
        
        // OpenTopoMap (Fiziki/OSM tabanlı)
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

        const layer = L.geoJSON(feature, {
          style: {
            color: '#dc2626', // red-600
            weight: 5,
            fillColor: '#ef4444', // red-500
            fillOpacity: 0.15
          }
        }).addTo(map);

        map.fitBounds(layer.getBounds(), { padding: [50, 50] });
      </script>
    </body>
    </html>
    `;

    try {
        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 800)); // Ekstra render payı
        await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90 });
        console.log(`[TAMAMLANDI] ${ilAdi} -> ${slug}.jpg`);
    } catch (e) {
        console.error(`[HATA] ${ilAdi} için hata: ${e.message}`);
    }
  }

  await browser.close();
  console.log("Tüm haritalar başarıyla oluşturuldu!");
}

main().catch(console.error);
