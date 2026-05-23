import fs from 'fs';
import path from 'path';

const quizDir = './data/quiz';

if (!fs.existsSync(quizDir)) {
  console.error(`✗ Hata: ${quizDir} dizini bulunamadı.`);
  process.exit(1);
}

try {
  const files = fs.readdirSync(quizDir).filter(file => file.endsWith('.json'));
  let totalCleared = 0;

  files.forEach(file => {
    const filePath = path.join(quizDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let data;
    
    try {
      data = JSON.parse(fileContent);
    } catch (e) {
      console.error(`✗ ${file} dosyası ayrıştırılamadı (geçersiz JSON).`);
      return;
    }

    let originalCount = 0;
    const slug = file.replace('.json', '');

    if (Array.isArray(data)) {
      originalCount = data.length;
      // Convert legacy array to standard object
      data = {
        konu: slug,
        sorular: []
      };
    } else if (data && typeof data === 'object') {
      originalCount = Array.isArray(data.sorular) ? data.sorular.length : 0;
      data.sorular = [];
      if (!data.konu) {
        data.konu = slug;
      }
    } else {
      data = {
        konu: slug,
        sorular: []
      };
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    totalCleared += originalCount;
    console.log(`✓ Temizlendi: ${file} (${originalCount} soru silindi)`);
  });

  console.log(`\n★ Toplam temizleme işlemi bitti!`);
  console.log(`★ Toplam temizlenen dosya sayısı: ${files.length}`);
  console.log(`★ Toplam silinen soru sayısı: ${totalCleared}`);

} catch (error) {
  console.error('✗ Hata oluştu:', error.message);
}
