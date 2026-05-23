import Link from "next/link";
import { Metadata } from "next";
import { seviyeler } from "@/lib/hazirlikConfig";

export const metadata: Metadata = {
  title: "KPSS & YKS Coğrafya Hazırlık — Lisans, TYT, AYT, Önlisans",
  description:
    "Hangi sınava hazırlanıyorsun? KPSS (Lisans, Önlisans, Ortaöğretim) ve YKS (TYT, AYT) için ayrı hazırlık rehberleri, konu anlatımları ve interaktif quizler.",
  alternates: {
    canonical: "https://kpsscografya.com.tr/hazirlik",
  },
  openGraph: {
    title: "KPSS & YKS Coğrafya Hazırlık — Seviyene Özel Rehber",
    description: "KPSS ve YKS (TYT/AYT) coğrafya hazırlık konuları, soru dağılımı ve quiz.",
    url: "https://kpsscografya.com.tr/hazirlik",
    siteName: "kpsscografya.com.tr",
    locale: "tr_TR",
    type: "website",
    images: ["/og-default.jpg"],
  },
};

const renkler: Record<string, { card: string; badge: string }> = {
  blue: {
    card: "border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-ink-800",
    badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  },
  green: {
    card: "border-green-100 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600 bg-white dark:bg-ink-800",
    badge: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  },
  amber: {
    card: "border-amber-100 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-600 bg-white dark:bg-ink-800",
    badge: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  },
  indigo: {
    card: "border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-ink-800",
    badge: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  },
  rose: {
    card: "border-rose-100 dark:border-rose-800 hover:border-rose-300 dark:hover:border-rose-600 bg-white dark:bg-ink-800",
    badge: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
  },
};

export default function HazirlikPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-3 tracking-tight">
            Sınav Hazırlığı
          </h1>
          <p className="text-ink-500 text-base max-w-xl leading-relaxed">
            Hedefine göre seç. Her seviyeye özel konu kapsamı, soru dağılımı ve quiz.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seviyeler.map((s) => {
            const stil = renkler[s.renk] ?? renkler.blue;
            return (
              <Link
                key={s.slug}
                href={`/hazirlik/${s.slug}`}
                className={`group block border rounded-xl p-6 transition-all duration-200 hover:shadow-card-hover ${stil.card}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{s.favicon}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${stil.badge}`}
                  >
                    {s.bankaSoruSayisi}+ soru
                  </span>
                </div>
                <h2 className="text-lg font-bold text-ink-900 mb-1 group-hover:text-focus-700 transition-colors">
                  {s.baslik}
                </h2>
                <p className="text-sm text-ink-500 leading-relaxed">{s.aciklama}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
