import AdminClient from "./AdminClient";
import { getAllKonular } from "@/lib/getKonuData";
import { fetchPublicData } from "@/lib/fetchData";

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
  const quizzes: QuizData[] = [];

  const konular = await getAllKonular();

  // Quiz dosyalarını fetch ile yükle (Cloudflare uyumlu)
  for (const konu of konular) {
    const data = await fetchPublicData<QuizData>(`data/quiz/${konu.slug}.json`);
    if (data?.konu) {
      quizzes.push({ konu: data.konu, sorular: data.sorular || [] });
    }
  }

  // Konuları isimlerine göre sıralayalım
  quizzes.sort((a, b) => a.konu.localeCompare(b.konu));

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminClient initialQuizzes={quizzes} konular={konular} />
    </div>
  );
}
