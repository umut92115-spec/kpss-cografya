import fs from 'fs';
import path from 'path';

const dataDir = './data/leaflet';
const outputFile = path.join(dataDir, 'turkiye_cografya.json');

const files = [
  'daglar.json',
  'akarsular.json',
  'goller.json',
  'ovalar.json',
  'kiyi_olusumlar.json',
  'madenler.json',
  'limanlar.json',
  'sinir_kapilari.json',
  'turizm.json',
  'iller.json'
];

const mergedData = {};

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const category = content.kategori || file.replace('.json', '');
      mergedData[category] = content.noktalar || content;
      console.log(`✓ Başarıyla yüklendi ve birleştirildi: ${file} (${mergedData[category].length || 0} nokta)`);
    } catch (error) {
      console.error(`✗ Hata oluştu (${file}):`, error.message);
    }
  } else {
    console.warn(`! Dosya bulunamadı: ${file}`);
  }
});

try {
  fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), 'utf8');
  console.log(`\n★ Tüm coğrafya verileri başarıyla '${outputFile}' dosyasına kaydedildi!`);
} catch (error) {
  console.error('✗ Birleştirilmiş dosya yazılamadı:', error.message);
}
