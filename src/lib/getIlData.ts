import fs from "node:fs";
import path from "node:path";
import { Il, IlKonuData, MatrisData, BolgeVerisi } from "@/types";

// Bölge tanımları ve URL slug eşleştirmeleri
export const bolgeler = [
  { slug: "akdeniz", ad: "Akdeniz", url: "akdenizbolgesi" },
  { slug: "ege", ad: "Ege", url: "egebolgesi" },
  { slug: "marmara", ad: "Marmara", url: "marmarabolgesi" },
  { slug: "ic-anadolu", ad: "İç Anadolu", url: "ic-anadolubolgesi" },
  { slug: "dogu-anadolu", ad: "Doğu Anadolu", url: "dogu-anadolubolgesi" },
  { slug: "guneydogu-anadolu", ad: "Güneydoğu Anadolu", url: "guneydogu-anadolubolgesi" },
  { slug: "karadeniz", ad: "Karadeniz", url: "karadenizbolgesi" },
];

const dataDir = path.join(process.cwd(), "data");

// ─── In-memory caches (build-time singleton) ────────────────────────────────
let illerCache: Il[] | null = null;
// Matris cache: her konu için ayrı entry
const matrisCache = new Map<string, Record<string, IlKonuData> | null>();
let ilOzetlerCache: Record<string, string[]> | null = null;
let bolgeVerileriCache: Record<string, BolgeVerisi> | null = null;

export function getAllIller(): Il[] {
  if (illerCache) return illerCache;
  const filePath = path.join(dataDir, "iller.json");
  illerCache = JSON.parse(fs.readFileSync(filePath, "utf8")) as Il[];
  return illerCache;
}

export function getIl(slug: string): Il | undefined {
  return getAllIller().find((il) => il.slug === slug);
}

export function getKonuMatris(konuSlug: string): Record<string, IlKonuData> | null {
  if (matrisCache.has(konuSlug)) return matrisCache.get(konuSlug)!;
  try {
    const filePath = path.join(dataDir, "matris", `${konuSlug}.json`);
    if (!fs.existsSync(filePath)) {
      matrisCache.set(konuSlug, null);
      return null;
    }
    const data: MatrisData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    matrisCache.set(konuSlug, data.iller);
    return data.iller;
  } catch (err) {
    console.error(`Matris verisi okunamadı: ${konuSlug}`, err);
    matrisCache.set(konuSlug, null);
    return null;
  }
}

export function getIlKonuData(ilSlug: string, konuSlug: string): IlKonuData | null {
  const matris = getKonuMatris(konuSlug);
  return matris?.[ilSlug] ?? null;
}

export function getIlOzet(slug: string): string[] | null {
  try {
    if (!ilOzetlerCache) {
      const filePath = path.join(dataDir, "il-ozetler.json");
      if (!fs.existsSync(filePath)) return null;
      ilOzetlerCache = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    return ilOzetlerCache![slug] ?? null;
  } catch {
    return null;
  }
}

export function getBolgeByUrl(url: string) {
  return bolgeler.find((b) => b.url === url);
}

export function getIllerByBolge(bolgeSlug: string): Il[] {
  return getAllIller().filter((il) => il.bolge_slug === bolgeSlug);
}

export function getBolgeVerileri(bolgeSlug: string): BolgeVerisi | null {
  try {
    if (!bolgeVerileriCache) {
      const filePath = path.join(dataDir, "bolge-verileri.json");
      if (!fs.existsSync(filePath)) return null;
      bolgeVerileriCache = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    return bolgeVerileriCache![bolgeSlug] ?? null;
  } catch {
    return null;
  }
}
