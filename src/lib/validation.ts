import { z } from "zod";

// FAQ Schema
export const faqSchema = z.object({
  q: z.string().min(1, "FAQ question cannot be empty"),
  a: z.string().min(1, "FAQ answer cannot be empty"),
});

// Quiz Soru Schema
export const quizSoruSchema = z.object({
  id: z.string(),
  soru: z.string().min(1, "Question text is required"),
  siklar: z.array(z.string()).min(2, "At least 2 options required"),
  dogru: z.string().min(1, "Correct answer is required"),
  aciklama: z.string().optional(),
  harita_il: z.string().nullable().optional(),
  zorluk: z.enum(["kolay", "orta", "zor"]).default("orta"),
});

// Quiz Data Schema
export const quizDataSchema = z.object({
  konu: z.string(),
  sorular: z.array(quizSoruSchema),
});

// Il Schema
export const ilSchema = z.object({
  slug: z.string(),
  ad: z.string(),
  bolge_slug: z.string(),
  nufus: z.number().optional(),
  yuzolcumu: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Konu Schema
export const konuSchema = z.object({
  slug: z.string(),
  baslik: z.string(),
  kpss_soru_sayisi_ort: z.number().optional(),
  agirlik: z.enum(["düşük", "orta", "yüksek"]),
});

// Validation helper functions
export function validateQuizData(data: unknown) {
  return quizDataSchema.safeParse(data);
}

export function validateFaqList(data: unknown) {
  return z.array(faqSchema).safeParse(data);
}

export function validateIlList(data: unknown) {
  return z.array(ilSchema).safeParse(data);
}

export function validateKonuList(data: unknown) {
  return z.array(konuSchema).safeParse(data);
}
