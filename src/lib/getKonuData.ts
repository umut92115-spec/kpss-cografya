import fs from 'fs';
import path from 'path';
import { Konu } from '@/types';

const dataDir = path.join(process.cwd(), 'data');
let konularCache: Konu[] | null = null;

export function getAllKonular(): Konu[] {
  if (konularCache) return konularCache;
  const filePath = path.join(dataDir, 'konular.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  konularCache = JSON.parse(fileContents);
  return konularCache as Konu[];
}

export function getKonu(slug: string): Konu | undefined {
  const konular = getAllKonular();
  return konular.find((konu) => konu.slug === slug);
}

export function getKonuFaq(slug: string) {
  const filePath = path.join(dataDir, 'faq-konular.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const faqs = JSON.parse(fileContents);
  return faqs[slug] || [];
}
