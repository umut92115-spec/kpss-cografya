/* eslint-disable @typescript-eslint/no-require-imports */
import { Konu, FAQ } from "@/types";

const konularCache: Konu[] | null = null;
const faqCache = new Map<string, FAQ[]>();

function getData<T>(path: string): T | null {
  try {
    const fs = require("node:fs");
    const filePath = require("node:path").join(process.cwd(), "public", path);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (err) {
    console.error(`Data okunamadı: ${path}`, err);
  }
  return null;
}

export function getAllKonular(): Konu[] {
  if (konularCache) return konularCache;
  return getData<Konu[]>("data/konular.json") || [];
}

export function getKonu(slug: string): Konu | undefined {
  return getAllKonular().find((konu) => konu.slug === slug);
}

export function getKonuFaq(slug: string): FAQ[] {
  if (faqCache.has(slug)) return faqCache.get(slug)!;

  const faqData = getData<Record<string, FAQ[]>>("data/faq-konular.json");
  const result = faqData?.[slug] ?? [];
  faqCache.set(slug, result);
  return result;
}
