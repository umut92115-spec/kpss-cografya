import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, "..");
const quizDir = path.join(projectRoot, "data", "quiz");

console.log("🛠️ KPSS Coğrafya Quiz Veri Seti Düzeltme Başlatılıyor...\n");

if (!fs.existsSync(quizDir)) {
  console.error(`❌ Quiz dizini bulunamadı: ${quizDir}`);
  process.exit(1);
}

const quizFiles = fs.readdirSync(quizDir).filter((file) => file.endsWith(".json"));
console.log(`📂 Toplam ${quizFiles.length} quiz dosyası üzerinde düzeltme yapılacak.\n`);

quizFiles.forEach((file) => {
  const filePath = path.join(quizDir, file);
  const konuSlug = path.basename(file, ".json");
  
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`❌ ${file} okunamadı!`);
    return;
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error(`❌ ${file} geçersiz JSON formatına sahip!`);
    return;
  }

  let sorular = [];
  let isLegacy = false;

  if (Array.isArray(data)) {
    sorular = data;
    isLegacy = true;
  } else if (data && Array.isArray(data.sorular)) {
    sorular = data.sorular;
  } else {
    console.error(`❌ ${file} beklenmeyen formatta!`);
    return;
  }

  let modifiedCount = 0;
  
  sorular.forEach((q, idx) => {
    const originalId = q.id;
    // 1. Yeni sıralı ID ata (konuSlug-001 formatında)
    const padding = String(idx + 1).padStart(3, "0");
    const newId = `${konuSlug}-${padding}`;
    if (q.id !== newId) {
      q.id = newId;
      modifiedCount++;
    }

    // 2. harita_il düzeltmeleri
    if (q.harita_il) {
      const originalIl = q.harita_il;
      if (q.harita_il.toLowerCase() === "muğla") {
        q.harita_il = "mugla";
        modifiedCount++;
        console.log(`✍️ ${file} [${newId}]: harita_il "${originalIl}" -> "mugla" yapıldı.`);
      } else if (q.harita_il.toLowerCase() === "izmit") {
        q.harita_il = "kocaeli";
        modifiedCount++;
        console.log(`✍️ ${file} [${newId}]: harita_il "${originalIl}" -> "kocaeli" yapıldı (Kocaeli il merkezi).`);
      }
    }

    // 3. sanayi.json'daki "Bölgenın" yazım hatasını düzelt
    if (file === "sanayi.json") {
      if (q.dogru === "Bölgenın iklim özellikleri") {
        q.dogru = "Bölgenin iklim özellikleri";
        modifiedCount++;
        console.log(`✍️ ${file} [${newId}]: dogru cevap yazım hatası giderildi ("Bölgenın" -> "Bölgenin").`);
      }
    }
  });

  // 4. Dosyayı kaydet
  let finalData = data;
  if (isLegacy) {
    // Legacy dizisini modern formata dönüştür
    finalData = {
      konu: konuSlug,
      sorular: sorular
    };
    modifiedCount++;
    console.log(`🔄 ${file} eski array formatından modern konu/sorular formatına dönüştürüldü.`);
  } else {
    finalData.sorular = sorular;
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), "utf8");
    if (modifiedCount > 0) {
      console.log(`✅ ${file}: ${modifiedCount} alanda düzeltme yapıldı ve kaydedildi.`);
    } else {
      console.log(`🟢 ${file}: Değişiklik gerekmedi.`);
    }
  } catch (error) {
    console.error(`❌ ${file} kaydedilirken hata oluştu:`, error.message);
  }
});

console.log("\n✨ Tüm düzeltmeler tamamlandı! Test etmek için doğrulama aracını çalıştırabilirsiniz.");
