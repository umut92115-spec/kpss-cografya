import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, "..");
const quizDir = path.join(projectRoot, "data", "quiz");
const illerFilePath = path.join(projectRoot, "data", "iller.json");

console.log("🔍 KPSS Coğrafya Quiz Veri Seti Doğrulama Başlatılıyor...\n");

// 1. Şehir listesini yükle (harita_il alanlarını doğrulamak için)
let validCities = new Set();
try {
  const illerData = JSON.parse(fs.readFileSync(illerFilePath, "utf8"));
  illerData.forEach((il) => {
    validCities.add(il.slug);
  });
  console.log(`✅ ${validCities.size} il bilgisi başarıyla yüklendi.`);
} catch (error) {
  console.warn("⚠️ data/iller.json dosyası yüklenemedi, il doğrulama atlanacak.", error.message);
}

// 2. Quiz dosyalarını tara
if (!fs.existsSync(quizDir)) {
  console.error(`❌ Quiz dizini bulunamadı: ${quizDir}`);
  process.exit(1);
}

const quizFiles = fs.readdirSync(quizDir).filter((file) => file.endsWith(".json"));
console.log(`📂 Toplam ${quizFiles.length} quiz dosyası bulundu.\n`);

let globalStats = {
  totalQuestions: 0,
  difficulties: { kolay: 0, orta: 0, zor: 0 },
  hasMapHighlight: 0,
  errors: 0,
  warnings: 0,
};

const allQuestionIds = new Set();

quizFiles.forEach((file) => {
  const filePath = path.join(quizDir, file);
  console.log(`--------------------------------------------------`);
  console.log(`📄 Dosya: ${file}`);
  
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`  ❌ Okuma Hatası: Dosya okunamadı!`);
    globalStats.errors++;
    return;
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error(`  ❌ JSON Sözdizimi Hatası: JSON formatı geçersiz!`);
    console.error(`     Detay: ${error.message}`);
    globalStats.errors++;
    return;
  }

  // Yapı doğrulaması
  let konu = "";
  let sorular = [];

  if (Array.isArray(data)) {
    console.log(`  ⚠️ Uyarı: Dosya eski (Legacy) array formatında. Otomatik dönüştürülebilir.`);
    globalStats.warnings++;
    sorular = data;
    konu = path.basename(file, ".json");
  } else {
    if (!data.konu) {
      console.error(`  ❌ Hata: 'konu' alanı eksik veya boş!`);
      globalStats.errors++;
    }
    if (!Array.isArray(data.sorular)) {
      console.error(`  ❌ Hata: 'sorular' alanı eksik veya bir dizi (array) değil!`);
      globalStats.errors++;
      return;
    }
    konu = data.konu;
    sorular = data.sorular;
  }

  console.log(`  🎯 Konu: ${konu} | Soru Sayısı: ${sorular.length}`);

  let fileErrors = 0;
  let fileWarnings = 0;

  sorular.forEach((q, idx) => {
    const qIndexStr = `Soru [İndeks: ${idx}]`;
    const qId = q.id || `eksik-id-${idx}`;

    // 1. ID doğrulaması
    if (!q.id) {
      console.error(`  ❌ ${qIndexStr}: 'id' alanı eksik!`);
      fileErrors++;
    } else {
      if (allQuestionIds.has(q.id)) {
        console.error(`  ❌ ${qIndexStr} (ID: ${q.id}): Mükerrer ID! Bu ID başka bir soruda da kullanılmış.`);
        fileErrors++;
      } else {
        allQuestionIds.add(q.id);
      }
    }

    // 2. Soru metni doğrulaması
    if (!q.soru || typeof q.soru !== "string" || q.soru.trim().length === 0) {
      console.error(`  ❌ ${qIndexStr} (ID: ${qId}): Soru metni eksik veya boş!`);
      fileErrors++;
    }

    // 3. Şıklar doğrulaması
    if (!Array.isArray(q.siklar) || q.siklar.length < 2) {
      console.error(`  ❌ ${qIndexStr} (ID: ${qId}): Şıklar dizisi eksik veya 2'den az seçenek var!`);
      fileErrors++;
    } else {
      if (q.siklar.length !== 4 && q.siklar.length !== 5) {
        console.log(`  ⚠️ ${qIndexStr} (ID: ${qId}): KPSS standardı için 4 veya 5 şık önerilir. Mevcut şık sayısı: ${q.siklar.length}`);
        fileWarnings++;
      }
      
      // Şıkların boş olup olmadığını kontrol et
      q.siklar.forEach((s, sIdx) => {
        if (!s || typeof s !== "string" || s.trim().length === 0) {
          console.error(`  ❌ ${qIndexStr} (ID: ${qId}): Şık ${sIdx + 1} boş veya geçersiz!`);
          fileErrors++;
        }
      });
    }

    // 4. Doğru cevap doğrulaması
    if (!q.dogru || typeof q.dogru !== "string" || q.dogru.trim().length === 0) {
      console.error(`  ❌ ${qIndexStr} (ID: ${qId}): Doğru cevap ('dogru') belirtilmemiş!`);
      fileErrors++;
    } else if (Array.isArray(q.siklar)) {
      if (!q.siklar.includes(q.dogru)) {
        console.error(`  ❌ ${qIndexStr} (ID: ${qId}): Doğru cevap şıkların arasında bulunamadı!`);
        console.error(`     Cevap: "${q.dogru}"`);
        console.error(`     Şıklar: ${JSON.stringify(q.siklar)}`);
        fileErrors++;
      }
    }

    // 5. Açıklama doğrulaması
    if (!q.aciklama || typeof q.aciklama !== "string" || q.aciklama.trim().length === 0) {
      console.log(`  ⚠️ ${qIndexStr} (ID: ${qId}): Açıklama ('aciklama') alanı eksik veya boş! Premium kullanıcı deneyimi için önerilir.`);
      fileWarnings++;
    }

    // 6. Zorluk doğrulaması
    if (q.zorluk) {
      if (!["kolay", "orta", "zor"].includes(q.zorluk)) {
        console.error(`  ❌ ${qIndexStr} (ID: ${qId}): Geçersiz zorluk seviyesi "${q.zorluk}"! ('kolay', 'orta' veya 'zor' olmalı)`);
        fileErrors++;
      } else {
        globalStats.difficulties[q.zorluk]++;
      }
    } else {
      globalStats.difficulties["orta"]++; // Varsayılan
    }

    // 7. Harita il doğrulaması
    if (q.harita_il !== undefined && q.harita_il !== null) {
      if (typeof q.harita_il !== "string") {
        console.error(`  ❌ ${qIndexStr} (ID: ${qId}): 'harita_il' alanı string veya null olmalıdır!`);
        fileErrors++;
      } else if (validCities.size > 0 && !validCities.has(q.harita_il.toLowerCase())) {
        console.error(`  ❌ ${qIndexStr} (ID: ${qId}): 'harita_il' değeri ("${q.harita_il}") geçerli bir il slug'ı değil!`);
        fileErrors++;
      } else {
        globalStats.hasMapHighlight++;
      }
    }

    globalStats.totalQuestions++;
  });

  if (fileErrors > 0) {
    console.error(`  🔴 Hatalı dosya! Toplam ${fileErrors} hata, ${fileWarnings} uyarı bulundu.`);
  } else if (fileWarnings > 0) {
    console.log(`  🟡 Geçerli ama uyarılar var. Toplam ${fileWarnings} uyarı.`);
  } else {
    console.log(`  🟢 Kusursuz dosya! Hata veya uyarı yok.`);
  }
  
  globalStats.errors += fileErrors;
  globalStats.warnings += fileWarnings;
});

console.log(`\n==================================================`);
console.log(`📊 GENEL DEĞERLENDİRME RAPORU`);
console.log(`==================================================`);
console.log(`🔹 Toplam İncelenen Soru : ${globalStats.totalQuestions}`);
console.log(`🔹 Benzersiz Soru ID'leri: ${allQuestionIds.size}`);
console.log(`🔹 Zorluk Dağılımı       : Kolay: ${globalStats.difficulties.kolay} | Orta: ${globalStats.difficulties.orta} | Zor: ${globalStats.difficulties.zor}`);
console.log(`🔹 Harita ile İlişkili   : ${globalStats.hasMapHighlight} soru (${Math.round((globalStats.hasMapHighlight / globalStats.totalQuestions) * 100)}%)`);
console.log(`--------------------------------------------------`);
console.log(`❌ Toplam Hata Sayısı    : ${globalStats.errors}`);
console.log(`⚠️ Toplam Uyarı Sayısı   : ${globalStats.warnings}`);
console.log(`==================================================`);

if (globalStats.errors > 0) {
  console.error(`\n🚨 Veri doğrulaması BAŞARISIZ oldu! Lütfen yukarıdaki hataları düzeltin.`);
  process.exit(1);
} else {
  console.log(`\n🎉 Tebrikler! Tüm quiz verileri 100% standartlara uygun ve çalışmaya hazır!`);
  process.exit(0);
}
