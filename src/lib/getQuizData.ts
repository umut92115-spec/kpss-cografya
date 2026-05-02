import fs from 'fs';
import path from 'path';
import { QuizData } from '@/types/quiz';

const quizDir = path.join(process.cwd(), 'data', 'quiz');

export function getQuizData(konuSlug: string): QuizData | null {
  try {
    const filePath = path.join(quizDir, `${konuSlug}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export function quizMevcut(konuSlug: string): boolean {
  return fs.existsSync(path.join(quizDir, `${konuSlug}.json`));
}
