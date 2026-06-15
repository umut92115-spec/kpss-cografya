import { QuizData } from "@/types/quiz";
import { fetchPublicData } from "./fetchData";

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

export async function getQuizData(konuSlug: string): Promise<QuizData | null> {
  const rawData = await fetchPublicData<unknown>(`data/quiz/${konuSlug}.json`);
  if (!rawData) return null;

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
}

export async function quizMevcut(konuSlug: string): Promise<boolean> {
  const data = await fetchPublicData<unknown>(`data/quiz/${konuSlug}.json`);
  return data !== null;
}
