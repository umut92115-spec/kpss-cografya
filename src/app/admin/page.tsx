import AdminClient from "./AdminClient";
import { getAllKonular } from "@/lib/getKonuData";
import { getQuizData } from "@/lib/getQuizData";

interface Soru {
  id: string;
  soru: string;
  siklar: string[];
  dogru: string;
  aciklama: string;
  harita_il: string | null;
  zorluk: "kolay" | "orta" | "zor";
}

interface QuizData {
  konu: string;
  sorular: Soru[];
}

export const metadata = {
  title: "Admin Soru İnceleme Paneli | KPSS Coğrafya",
  description: "KPSS Coğrafya premium soru bankası yönetim ve inceleme paneli.",
};

export default async function AdminPage() {
  const quizSlugs = [
    "akarsular",
    "beseri-cografya",
    "bolge-jeopolitik",
    "cografi-konum",
    "daglar",
    "genel-cografya-200",
    "goller",
    "iklim-bitki",
    "jeolojik-yapi",
    "kalkinma-projeleri",
    "kiyi-tipleri",
    "madenler-enerji",
    "nufus-politikalari",
    "sanayi",
    "sinir-kapilari",
    "tarim",
    "ticaret",
    "toprak-cevre",
    "turizm",
    "ulasim",
    "yer-sekilleri",
  ];

  const quizzes: QuizData[] = [];

  for (const slug of quizSlugs) {
    const data = getQuizData(slug);
    if (data) {
      quizzes.push({
        konu: data.konu || slug,
        sorular: data.sorular || [],
      });
    }
  }

  // Konuları isimlerine göre sıralayalım
  quizzes.sort((a, b) => a.konu.localeCompare(b.konu));

  const konular = getAllKonular();

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminClient initialQuizzes={quizzes} konular={konular} />
    </div>
  );
}
