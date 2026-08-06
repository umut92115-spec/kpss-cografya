import { Konu, FAQ } from "@/types";
import konularData from "../../data/konular.json";
import { fetchPublicData } from "./fetchData";

export async function getAllKonular(): Promise<Konu[]> {
  return (konularData as Konu[]) || [];
}

export async function getKonu(slug: string): Promise<Konu | undefined> {
  const konular = await getAllKonular();
  return konular.find((konu) => konu.slug === slug);
}

export async function getKonuFaq(slug: string): Promise<FAQ[]> {
  const faqData = await fetchPublicData<Record<string, FAQ[]>>("data/faq-konular.json");
  return faqData?.[slug] ?? [];
}
