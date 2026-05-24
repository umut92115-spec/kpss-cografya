import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.join(process.cwd());
const ILLER_PATH = path.join(PROJECT_ROOT, 'data', 'iller.json');
const QUIZ_DIR = path.join(PROJECT_ROOT, 'data', 'quiz');

interface QuizSoru {
  id: string;
  soru: string;
  siklar: string[];
  dogru: string;
  aciklama: string;
  harita_il: string | null | string[];
  zorluk: 'kolay' | 'orta' | 'zor';
  gorsel: string | null;
  gorsel_veri: Record<string, string> | null | any;
}

interface QuizData {
  konu: string;
  sorular: QuizSoru[];
}

function normalizeSlug(text: string) {
  return text.toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .trim();
}

function main() {
  const illerData = JSON.parse(fs.readFileSync(ILLER_PATH, 'utf-8'));
  const validSlugs = new Set(illerData.map((i: any) => i.slug));

  const files = fs.readdirSync(QUIZ_DIR).filter(f => f.endsWith('.json'));

  let totalQuestions = 0;
  let fixedCount = 0;
  let warningCount = 0;

  for (const file of files) {
    const filePath = path.join(QUIZ_DIR, file);
    let changed = false;
    
    let quizData: QuizData;
    try {
      quizData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`Skipping ${file} - invalid JSON`);
      continue;
    }

    if (!quizData.sorular) continue;

    for (const q of quizData.sorular) {
      totalQuestions++;

      // 1. Fix harita_il
      if (q.harita_il) {
        if (typeof q.harita_il === 'string') {
          let slug = normalizeSlug(q.harita_il);
          if (validSlugs.has(slug)) {
            if (q.harita_il !== slug) {
              q.harita_il = slug;
              changed = true;
              fixedCount++;
            }
          } else {
            console.log(`[UYARI] ${q.id} - Geçersiz harita_il slug: ${q.harita_il}`);
            q.harita_il = null; // Geçersizse null yap ki UI patlamasın
            changed = true;
            fixedCount++;
          }
        } else if (Array.isArray(q.harita_il)) {
          // If the AI accidentally returned an array of provinces, just take the first one or null it
          const first = q.harita_il[0];
          if (first && typeof first === 'string') {
            let slug = normalizeSlug(first);
            q.harita_il = validSlugs.has(slug) ? slug : null;
          } else {
            q.harita_il = null;
          }
          changed = true;
          fixedCount++;
        }
      }

      // 2. Fix gorsel_veri if it's stringified
      if (typeof q.gorsel_veri === 'string') {
        try {
          q.gorsel_veri = JSON.parse(q.gorsel_veri);
          changed = true;
          fixedCount++;
        } catch(e) {
          console.log(`[UYARI] ${q.id} - gorsel_veri string ama JSON parse edilemedi.`);
          q.gorsel_veri = null;
          changed = true;
          fixedCount++;
        }
      }

      // 3. Detect "Phantom Visuals" (Question text implies a visual, but none exists)
      const visualKeywords = ["aşağıdaki", "yandaki", "yukarıdaki", "grafikte", "tabloda", "görselde", "haritada"];
      const lowerSoru = q.soru.toLowerCase();
      
      const hasKeyword = visualKeywords.some(kw => lowerSoru.includes(kw));
      const hasActualVisual = !!q.harita_il || !!q.gorsel_veri;

      if (hasKeyword && !hasActualVisual) {
        console.log(`[UYARI] ${q.id} - Soru metninde görsel/harita kelimesi geçiyor ancak veri yok!`);
        warningCount++;
        
        // Optionally, we could rewrite the question text here, but it's dangerous.
        // For now, we'll try to strip obvious floating prefixes like "Aşağıdaki haritada..."
        // Or we can just flag it for manual review.
        if (lowerSoru.startsWith("aşağıdaki haritada") || lowerSoru.startsWith("yukarıdaki haritada")) {
           // We might want to delete these questions as they are unanswerable without the map
           // For safety, let's tag them with a specific zorluk or add a "FIXME" in the ID
           if (!q.id.includes("FIXME")) {
             q.id = q.id + "-FIXME";
             changed = true;
           }
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2), 'utf-8');
    }
  }

  console.log('--- ÖZET ---');
  console.log(`İncelenen Toplam Soru: ${totalQuestions}`);
  console.log(`Otomatik Düzeltilen Hata: ${fixedCount}`);
  console.log(`Görseli Eksik Olup İşaretlenen (FIXME) / Uyarı Verilen: ${warningCount}`);
}

main();
