import Link from "next/link";
import { getAllKonular } from "@/lib/getKonuData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KPSS Coğrafya Quiz Modu — 2000+ Soru & Güncel Deneme Sınavları",
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
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-3 tracking-tight">
            Soru Bankası
          </h1>
          <p className="text-ink-500 text-base max-w-xl leading-relaxed">
            200+ özgün soru. Konunu seç, testini çöz, eksiklerini keşfet.
          </p>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {konular.map((k) => (
            <div
              key={k.slug}
              className="group bg-white dark:bg-ink-800 rounded-xl border border-ink-100 dark:border-ink-700 p-5 hover:border-focus-200 dark:hover:border-focus-700 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-focus-50 border border-focus-100/50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  {k.icon}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900 dark:text-white text-sm group-hover:text-focus-700 dark:group-hover:text-focus-400 transition-colors">
                    {k.baslik}
                  </h3>
                  <p className="text-xs text-ink-400">~{k.kpss_soru_sayisi_ort} soru/yıl</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/quiz/${k.slug}`}
                  className="flex-1 text-center py-2.5 rounded-lg bg-focus-600 text-white text-xs font-bold hover:bg-focus-700 transition-colors"
                >
                  Tam Quiz
                </Link>
                <Link
                  href={`/quiz/${k.slug}?mode=quick`}
                  className="flex-1 text-center py-2.5 rounded-lg bg-glow-50 text-glow-700 text-xs font-bold border border-glow-200 hover:bg-glow-100 transition-colors"
                >
                  Hızlı (10)
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features row */}
        <div className="mt-14 grid grid-cols-3 gap-4">
          {[
            { icon: "⏱️", label: "Süreli mod" },
            { icon: "📊", label: "Anlık analiz" },
            { icon: "🏆", label: "Skor takibi" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2.5 bg-white dark:bg-ink-800 rounded-lg border border-ink-100 dark:border-ink-700 px-4 py-3"
            >
              <span className="text-lg">{f.icon}</span>
              <span className="text-xs font-semibold text-ink-600">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
