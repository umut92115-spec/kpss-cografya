import fs from 'fs';
import path from 'path';
import { QuizData } from '@/types/quiz';

const quizDir = path.join(process.cwd(), 'data', 'quiz');

export function getQuizData(konuSlug: string): QuizData | null {
  try {
    const filePath = path.join(quizDir, `${konuSlug}.json`);
    if (!fs.existsSync(filePath)) return null;
    
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Eğer dosya direkt bir array ise (legacy format), QuizData objesine çevir
    if (Array.isArray(rawData)) {
      interface LegacyQuizItem {
        id?: string;
        soru?: string;
        question?: string;
        siklar?: string[];
        options?: string[];
        dogru?: string;
        correct_index?: number;
        aciklama?: string;
        explanation?: string;
        harita_il?: string | null;
        zorluk?: 'kolay' | 'orta' | 'zor';
      }

      return {
        konu: konuSlug,
        sorular: (rawData as LegacyQuizItem[]).map((item, index) => ({
          id: item.id || `q-${index}`,
          soru: item.soru || item.question || '',
          siklar: item.siklar || item.options || [],
          dogru: item.dogru || (item.options && item.correct_index !== undefined ? item.options[item.correct_index] : '') || '',
          aciklama: item.aciklama || item.explanation || '',
          harita_il: item.harita_il || null,
          zorluk: item.zorluk || 'orta'
        }))
      };
    }
    
    return rawData as QuizData;
  } catch (error) {
    console.error(`Error loading quiz data for ${konuSlug}:`, error);
    return null;
  }
}

export function quizMevcut(konuSlug: string): boolean {
  return fs.existsSync(path.join(quizDir, `${konuSlug}.json`));
}
