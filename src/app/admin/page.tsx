/* eslint-disable @typescript-eslint/no-require-imports */
import AdminClient from "./AdminClient";
import { getAllKonular } from "@/lib/getKonuData";

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

  if (typeof process !== "undefined" && process.env.NEXT_RUNTIME !== "edge") {
    try {
      const fs = require("node:fs/promises");
      const path = require("node:path");
      const quizDir = path.join(process.cwd(), "data/quiz");

      // Klasörün varlığını garanti edelim
      await fs.mkdir(quizDir, { recursive: true });

      const files = await fs.readdir(quizDir);

      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(quizDir, file);
          const fileContent = await fs.readFile(filePath, "utf-8");
          try {
            const data = JSON.parse(fileContent);
            if (data.konu) {
              quizzes.push({
                konu: data.konu,
                sorular: data.sorular || [],
              });
            }
          } catch (err) {
            console.error(`Error parsing ${file}:`, err);
          }
        }
      }
    } catch (err) {
      console.error("Admin Page read error:", err);
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
