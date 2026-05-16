import fs from 'fs';
import path from 'path';
import { Konu, FAQ } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

// ─── In-memory caches (build-time singleton) ────────────────────────────────
let konularCache: Konu[] | null = null;
let faqCache: Record<string, FAQ[]> | null = null;

export function getAllKonular(): Konu[] {
  if (konularCache) return konularCache;
  const filePath = path.join(dataDir, 'konular.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  konularCache = JSON.parse(fileContents) as Konu[];
  return konularCache;
}

export function getKonu(slug: string): Konu | undefined {
  return getAllKonular().find((konu) => konu.slug === slug);
}

export function getKonuFaq(slug: string): FAQ[] {
  if (!faqCache) {
    const filePath = path.join(dataDir, 'faq-konular.json');
    if (!fs.existsSync(filePath)) return [];
    faqCache = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, FAQ[]>;
  }
  return faqCache[slug] ?? [];
}
