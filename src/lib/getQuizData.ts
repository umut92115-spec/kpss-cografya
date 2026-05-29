/* eslint-disable @typescript-eslint/no-require-imports */
import { QuizData } from "@/types/quiz";

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
  zorluk?: "kolay" | "orta" | "zor";
}

export function getQuizData(konuSlug: string): QuizData | null {
  try {
    const fs = require("node:fs");
    const path = require("node:path");
    const quizDir = path.join(process.cwd(), "public", "data", "quiz");
    const filePath = path.join(quizDir, `${konuSlug}.json`);
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, "utf8");
    const rawData: unknown = JSON.parse(fileContent);

    if (Array.isArray(rawData)) {
      return {
        konu: konuSlug,
        sorular: (rawData as LegacyQuizItem[]).map((item, index) => ({
          id: item.id || `q-${index}`,
          soru: item.soru || item.question || "",
          siklar: item.siklar || item.options || [],
          dogru:
            item.dogru ||
            (item.options && item.correct_index !== undefined
              ? item.options[item.correct_index]
              : "") ||
            "",
          aciklama: item.aciklama || item.explanation || "",
          harita_il: item.harita_il || null,
          zorluk: item.zorluk || "orta",
        })),
      };
    }

    return rawData as QuizData;
  } catch (error) {
    console.error(`Error loading quiz data for ${konuSlug}:`, error);
    return null;
  }
}

export function quizMevcut(konuSlug: string): boolean {
  try {
    const fs = require("node:fs");
    const path = require("node:path");
    return fs.existsSync(path.join(process.cwd(), "public", "data", "quiz", `${konuSlug}.json`));
  } catch {
    return false;
  }
}
