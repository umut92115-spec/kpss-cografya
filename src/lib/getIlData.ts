import { Il, IlKonuData, MatrisData, BolgeVerisi } from "@/types";

import illerData from "../../data/iller.json";
import bolgeVerileriData from "../../data/bolge-verileri.json";
import ilOzetlerData from "../../data/il-ozetler.json";

// Matris imports
import matrisAkarsular from "../../data/matris/akarsular.json";
import matrisBeseriCografya from "../../data/matris/beseri-cografya.json";
import matrisBolgeJeopolitik from "../../data/matris/bolge-jeopolitik.json";
import matrisCografiKonum from "../../data/matris/cografi-konum.json";
import matrisDaglar from "../../data/matris/daglar.json";
import matrisGoller from "../../data/matris/goller.json";
import matrisIklimBitki from "../../data/matris/iklim-bitki.json";
import matrisJeolojikYapi from "../../data/matris/jeolojik-yapi.json";
import matrisKalkinmaProjeleri from "../../data/matris/kalkinma-projeleri.json";
import matrisKiyiTipleri from "../../data/matris/kiyi-tipleri.json";
import matrisMadenlerEnerji from "../../data/matris/madenler-enerji.json";
import matrisSanayi from "../../data/matris/sanayi.json";
import matrisSinirKapilari from "../../data/matris/sinir-kapilari.json";
import matrisTarim from "../../data/matris/tarim.json";
import matrisTicaret from "../../data/matris/ticaret.json";
import matrisToprakCevre from "../../data/matris/toprak-cevre.json";
import matrisTurizm from "../../data/matris/turizm.json";
import matrisUlasim from "../../data/matris/ulasim.json";
import matrisYerSekilleri from "../../data/matris/yer-sekilleri.json";

const matrisMap: Record<string, any> = {
  akarsular: matrisAkarsular,
  "beseri-cografya": matrisBeseriCografya,
  "bolge-jeopolitik": matrisBolgeJeopolitik,
  "cografi-konum": matrisCografiKonum,
  daglar: matrisDaglar,
  goller: matrisGoller,
  "iklim-bitki": matrisIklimBitki,
  "jeolojik-yapi": matrisJeolojikYapi,
  "kalkinma-projeleri": matrisKalkinmaProjeleri,
  "kiyi-tipleri": matrisKiyiTipleri,
  "madenler-enerji": matrisMadenlerEnerji,
  sanayi: matrisSanayi,
  "sinir-kapilari": matrisSinirKapilari,
  tarim: matrisTarim,
  ticaret: matrisTicaret,
  "toprak-cevre": matrisToprakCevre,
  turizm: matrisTurizm,
  ulasim: matrisUlasim,
  "yer-sekilleri": matrisYerSekilleri,
};

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

export function getAllIller(): Il[] {
  return illerData as Il[];
}

export function getIl(slug: string): Il | undefined {
  return getAllIller().find((il) => il.slug === slug);
}

export function getKonuMatris(konuSlug: string): Record<string, IlKonuData> | null {
  const matrisFile = matrisMap[konuSlug];
  if (!matrisFile) return null;
  const data = matrisFile as MatrisData;
  return data.iller ?? null;
}

export function getIlKonuData(ilSlug: string, konuSlug: string): IlKonuData | null {
  const matris = getKonuMatris(konuSlug);
  return matris?.[ilSlug] ?? null;
}

export function getIlOzet(slug: string): string[] | null {
  const data = ilOzetlerData as Record<string, string[]>;
  return data[slug] ?? null;
}

export function getBolgeByUrl(url: string) {
  return bolgeler.find((b) => b.url === url);
}

export function getIllerByBolge(bolgeSlug: string): Il[] {
  return getAllIller().filter((il) => il.bolge_slug === bolgeSlug);
}

export function getBolgeVerileri(bolgeSlug: string): BolgeVerisi | null {
  const data = bolgeVerileriData as Record<string, BolgeVerisi>;
  return data[bolgeSlug] ?? null;
}
