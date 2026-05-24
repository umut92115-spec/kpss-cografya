import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.join(process.cwd());
const QUIZ_DIR = path.join(PROJECT_ROOT, 'data', 'quiz');

interface QuizSoru {
  id: string;
  soru: string;
  siklar: string[];
  dogru: string;
  aciklama: string;
  harita_il: string | null;
  zorluk: 'kolay' | 'orta' | 'zor';
  gorsel: string | null;
  gorsel_veri: Record<string, string> | null | any;
}

interface QuizData {
  konu: string;
  sorular: QuizSoru[];
}

function main() {
  const files = fs.readdirSync(QUIZ_DIR).filter(f => f.endsWith('.json'));

  let initialTotal = 0;
  let deletedCount = 0;

  for (const file of files) {
    const filePath = path.join(QUIZ_DIR, file);
    
    let quizData: QuizData;
    try {
      quizData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      continue;
    }

    if (!quizData.sorular) continue;

    const initialLength = quizData.sorular.length;
    initialTotal += initialLength;

    const validQuestions = quizData.sorular.filter(q => {
      // 1. If it was already flagged by the previous script
      if (q.id.includes('-FIXME')) return false;

      const lowerSoru = q.soru.toLowerCase();
      const hasActualVisual = !!q.harita_il || !!q.gorsel_veri || !!q.gorsel;

      // 2. Strict visual phrase check
      const strictVisualPhrases = [
        "aşağıdaki haritada", "yukarıdaki haritada", "yandaki haritada", "haritada numaralandırılarak", "haritada işaretli",
        "aşağıdaki grafikte", "yukarıdaki grafikte", "yandaki grafikte", "grafikte gösterilen",
        "aşağıdaki tabloda", "yukarıdaki tabloda", "yandaki tabloda", "tabloda verilen",
        "aşağıdaki görselde", "yukarıdaki görselde", "yandaki görselde", "görseldeki"
      ];

      const hasPhantomVisual = strictVisualPhrases.some(phrase => lowerSoru.includes(phrase));

      if (hasPhantomVisual && !hasActualVisual) {
        return false; // Drop this question
      }

      return true; // Keep
    });

    const deletedInFile = initialLength - validQuestions.length;
    if (deletedInFile > 0) {
      deletedCount += deletedInFile;
      quizData.sorular = validQuestions;
      fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2), 'utf-8');
      console.log(`${file}: ${deletedInFile} hayalet görselli soru silindi.`);
    }
  }

  console.log('--- TEMİZLİK ÖZETİ ---');
  console.log(`Başlangıç Toplam Soru: ${initialTotal}`);
  console.log(`Silinen Hatalı Soru: ${deletedCount}`);
  console.log(`Kalan Sağlam Soru: ${initialTotal - deletedCount}`);
}

main();
