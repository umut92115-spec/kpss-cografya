/* eslint-disable @typescript-eslint/no-require-imports */
import { Il, IlKonuData, MatrisData, BolgeVerisi } from "@/types";
import illerData from "../../data/iller.json";
import ilOzetlerData from "../../data/il-ozetler.json";
import bolgeVerileriData from "../../data/bolge-verileri.json";

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

// Matris cache: her konu için ayrı entry
const matrisCache = new Map<string, Record<string, IlKonuData> | null>();

export function getAllIller(): Il[] {
  return illerData as Il[];
}

export function getIl(slug: string): Il | undefined {
  return getAllIller().find((il) => il.slug === slug);
}

export function getKonuMatris(konuSlug: string): Record<string, IlKonuData> | null {
  if (matrisCache.has(konuSlug)) return matrisCache.get(konuSlug)!;

  // Edge runtime ortamında dosya okuma yapılamadığı için sadece Node runtime'da (derleme/build sırasında) okuyoruz
  if (typeof process !== "undefined" && process.env.NEXT_RUNTIME !== "edge") {
    try {
      const fs = require("node:fs");
      const path = require("node:path");
      const filePath = path.join(process.cwd(), "data", "matris", `${konuSlug}.json`);
      if (fs.existsSync(filePath)) {
        const data: MatrisData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        matrisCache.set(konuSlug, data.iller);
        return data.iller;
      }
    } catch (err) {
      console.error(`Matris verisi okunamadı: ${konuSlug}`, err);
    }
  }

  matrisCache.set(konuSlug, null);
  return null;
}

export function getIlKonuData(ilSlug: string, konuSlug: string): IlKonuData | null {
  const matris = getKonuMatris(konuSlug);
  return matris?.[ilSlug] ?? null;
}

export function getIlOzet(slug: string): string[] | null {
  const ozetler = ilOzetlerData as Record<string, string[]>;
  return ozetler[slug] ?? null;
}

export function getBolgeByUrl(url: string) {
  return bolgeler.find((b) => b.url === url);
}

export function getIllerByBolge(bolgeSlug: string): Il[] {
  return getAllIller().filter((il) => il.bolge_slug === bolgeSlug);
}

export function getBolgeVerileri(bolgeSlug: string): BolgeVerisi | null {
  const veriler = bolgeVerileriData as Record<string, BolgeVerisi>;
  return veriler[bolgeSlug] ?? null;
}
