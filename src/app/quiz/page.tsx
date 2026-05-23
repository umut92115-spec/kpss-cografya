import { getAllKonular } from "@/lib/getKonuData";
import { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "KPSS Coğrafya Soru Bankası — 2000+ Soru & Güncel Deneme Sınavları",
  description:
    "KPSS coğrafya konularına göre hazırlanmış interaktif testler. Çıkmış sorular, süreli sınavlar, doğru-yanlış analizleri ve skor tablosu. Hemen kendini test et!",
  alternates: {
    canonical: "https://kpsscografya.com.tr/quiz",
  },
};

export default function QuizPage() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-[var(--background)] py-14 md:py-20">
      <QuizClient konular={konular} />
    </div>
  );
}
