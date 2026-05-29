/* eslint-disable @typescript-eslint/no-require-imports */
import { Il, IlKonuData, MatrisData, BolgeVerisi } from "@/types";

export const bolgeler = [
  { slug: "akdeniz", ad: "Akdeniz", url: "akdenizbolgesi" },
  { slug: "ege", ad: "Ege", url: "egebolgesi" },
  { slug: "marmara", ad: "Marmara", url: "marmarabolgesi" },
  { slug: "ic-anadolu", ad: "İç Anadolu", url: "ic-anadolubolgesi" },
  { slug: "dogu-anadolu", ad: "Doğu Anadolu", url: "dogu-anadolubolgesi" },
  { slug: "guneydogu-anadolu", ad: "Güneydoğu Anadolu", url: "guneydogu-anadolubolgesi" },
  { slug: "karadeniz", ad: "Karadeniz", url: "karadenizbolgesi" },
];

const matrisCache = new Map<string, Record<string, IlKonuData> | null>();
const illerCache = new Map<string, Il[]>();
const ozetlerCache = new Map<string, string[] | null>();
const bolgeVerileriCache = new Map<string, BolgeVerisi | null>();

function getData<T>(path: string, cache?: Map<string, T>): T | null {
  if (cache?.has(path)) return cache.get(path)!;

  try {
    const fs = require("node:fs");
    const filePath = require("node:path").join(process.cwd(), "public", path);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (cache) cache.set(path, data);
      return data;
    }
  } catch (err) {
    console.error(`Data okunamadı: ${path}`, err);
  }
  return null;
}

export function getAllIller(): Il[] {
  const cached = illerCache.get("iller");
  if (cached) return cached;
  const data = getData<Il[]>("data/iller.json", illerCache);
  return data || [];
}

export function getIl(slug: string): Il | undefined {
  return getAllIller().find((il) => il.slug === slug);
}

export function getKonuMatris(konuSlug: string): Record<string, IlKonuData> | null {
  if (matrisCache.has(konuSlug)) return matrisCache.get(konuSlug)!;

  try {
    const fs = require("node:fs");
    const filePath = require("node:path").join(
      process.cwd(),
      "public",
      "data",
      "matris",
      `${konuSlug}.json`
    );
    if (fs.existsSync(filePath)) {
      const data: MatrisData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      matrisCache.set(konuSlug, data.iller);
      return data.iller;
    }
  } catch (err) {
    console.error(`Matris verisi okunamadı: ${konuSlug}`, err);
  }

  matrisCache.set(konuSlug, null);
  return null;
}

export function getIlKonuData(ilSlug: string, konuSlug: string): IlKonuData | null {
  const matris = getKonuMatris(konuSlug);
  return matris?.[ilSlug] ?? null;
}

export function getIlOzet(slug: string): string[] | null {
  const cached = ozetlerCache.get(slug);
  if (cached !== undefined) return cached;

  const ozetler = getData<Record<string, string[]>>("data/il-ozetler.json");
  const result = ozetler?.[slug] ?? null;
  ozetlerCache.set(slug, result);
  return result;
}

export function getBolgeByUrl(url: string) {
  return bolgeler.find((b) => b.url === url);
}

export function getIllerByBolge(bolgeSlug: string): Il[] {
  return getAllIller().filter((il) => il.bolge_slug === bolgeSlug);
}

export function getBolgeVerileri(bolgeSlug: string): BolgeVerisi | null {
  const cached = bolgeVerileriCache.get(bolgeSlug);
  if (cached !== undefined) return cached;

  const veriler = getData<Record<string, BolgeVerisi>>("data/bolge-verileri.json");
  const result = veriler?.[bolgeSlug] ?? null;
  bolgeVerileriCache.set(bolgeSlug, result);
  return result;
}
