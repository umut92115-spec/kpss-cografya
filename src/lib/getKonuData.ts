import { Konu, FAQ } from "@/types";
import konularData from "../../data/konular.json";
import rawFaqData from "../../data/faq-konular.json";

const faqData: Record<string, FAQ[]> = rawFaqData as Record<string, FAQ[]>;

export function getAllKonular(): Konu[] {
  return konularData as Konu[];
}

export function getKonu(slug: string): Konu | undefined {
  return getAllKonular().find((konu) => konu.slug === slug);
}

export function getKonuFaq(slug: string): FAQ[] {
  return faqData[slug] ?? [];
}
