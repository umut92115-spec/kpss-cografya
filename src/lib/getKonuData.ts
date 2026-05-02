import fs from 'fs';
import path from 'path';
import { Konu } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

export function getAllKonular(): Konu[] {
  const filePath = path.join(dataDir, 'konular.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getKonu(slug: string): Konu | undefined {
  const konular = getAllKonular();
  return konular.find((konu) => konu.slug === slug);
}
