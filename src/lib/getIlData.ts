import { Il, IlKonuData, MatrisData, BolgeVerisi } from "@/types";
import { fetchPublicData } from "./fetchData";

export const bolgeler = [
  { slug: "akdeniz", ad: "Akdeniz", url: "akdenizbolgesi" },
  { slug: "ege", ad: "Ege", url: "egebolgesi" },
  { slug: "marmara", ad: "Marmara", url: "marmarabolgesi" },
  { slug: "ic-anadolu", ad: "İç Anadolu", url: "ic-anadolubolgesi" },
  { slug: "dogu-anadolu", ad: "Doğu Anadolu", url: "dogu-anadolubolgesi" },
  { slug: "guneydogu-anadolu", ad: "Güneydoğu Anadolu", url: "guneydogu-anadolubolgesi" },
  { slug: "karadeniz", ad: "Karadeniz", url: "karadenizbolgesi" },
];

export async function getAllIller(): Promise<Il[]> {
  const data = await fetchPublicData<Il[]>("data/iller.json");
  return data || [];
}

export async function getIl(slug: string): Promise<Il | undefined> {
  const iller = await getAllIller();
  return iller.find((il) => il.slug === slug);
}

export async function getKonuMatris(konuSlug: string): Promise<Record<string, IlKonuData> | null> {
  const data = await fetchPublicData<MatrisData>(`data/matris/${konuSlug}.json`);
  return data?.iller ?? null;
}

export async function getIlKonuData(ilSlug: string, konuSlug: string): Promise<IlKonuData | null> {
  const matris = await getKonuMatris(konuSlug);
  return matris?.[ilSlug] ?? null;
}

export async function getIlOzet(slug: string): Promise<string[] | null> {
  const ozetler = await fetchPublicData<Record<string, string[]>>("data/il-ozetler.json");
  return ozetler?.[slug] ?? null;
}

export function getBolgeByUrl(url: string) {
  return bolgeler.find((b) => b.url === url);
}

export async function getIllerByBolge(bolgeSlug: string): Promise<Il[]> {
  const iller = await getAllIller();
  return iller.filter((il) => il.bolge_slug === bolgeSlug);
}

export async function getBolgeVerileri(bolgeSlug: string): Promise<BolgeVerisi | null> {
  const veriler = await fetchPublicData<Record<string, BolgeVerisi>>("data/bolge-verileri.json");
  return veriler?.[bolgeSlug] ?? null;
}
