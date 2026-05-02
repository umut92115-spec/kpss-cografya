import fs from 'fs';
import path from 'path';
import { Il, MatrisData, IlKonuData } from '@/types';

// Bölge tanımları ve URL slug eşleştirmeleri
export const bolgeler = [
  { slug: 'akdeniz', ad: 'Akdeniz', url: 'akdenizbolgesi' },
  { slug: 'ege', ad: 'Ege', url: 'egebolgesi' },
  { slug: 'marmara', ad: 'Marmara', url: 'marmarabolgesi' },
  { slug: 'ic-anadolu', ad: 'İç Anadolu', url: 'ic-anadolubolgesi' },
  { slug: 'dogu-anadolu', ad: 'Doğu Anadolu', url: 'dogu-anadolubolgesi' },
  { slug: 'guneydogu-anadolu', ad: 'Güneydoğu Anadolu', url: 'guneydogu-anadolubolgesi' },
  { slug: 'karadeniz', ad: 'Karadeniz', url: 'karadenizbolgesi' }
];

const dataDir = path.join(process.cwd(), 'data');

export function getAllIller(): Il[] {
  const filePath = path.join(dataDir, 'iller.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getIl(slug: string): Il | undefined {
  const iller = getAllIller();
  return iller.find((il) => il.slug === slug);
}

export function getKonuMatris(konuSlug: string): Record<string, IlKonuData> | null {
  try {
    const filePath = path.join(dataDir, 'matris', `${konuSlug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: MatrisData = JSON.parse(fileContents);
    return data.iller;
  } catch (error) {
    console.error(`Matris verisi okunamadı: ${konuSlug}`, error);
    return null;
  }
}

export function getIlKonuData(ilSlug: string, konuSlug: string): IlKonuData | null {
  const matris = getKonuMatris(konuSlug);
  if (!matris) return null;
  return matris[ilSlug] || null;
}

export function getIlOzet(slug: string): string[] | null {
  try {
    const filePath = path.join(dataDir, 'il-ozetler.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data[slug] || null;
  } catch (error) {
    return null;
  }
}

export function getBolgeByUrl(url: string) {
  return bolgeler.find(b => b.url === url);
}

export function getIllerByBolge(bolgeSlug: string): Il[] {
  const iller = getAllIller();
  return iller.filter(il => il.bolge_slug === bolgeSlug);
}

export function getBolgeVerileri(bolgeSlug: string) {
  try {
    const filePath = path.join(dataDir, 'bolge-verileri.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data[bolgeSlug] || null;
  } catch (error) {
    return null;
  }
}
