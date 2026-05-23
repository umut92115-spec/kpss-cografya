import Link from "next/link";
import { getAllKonular } from "@/lib/getKonuData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KPSS Coğrafya Konuları — Süper Detay Anlatım | kpsscografya.com.tr",
  description:
    "KPSS coğrafya tüm konuları: Yer şekilleri, iklim, nüfus, tarım, madenler, ticaret ve daha fazlası. Görsel ve detaylı konu anlatımları.",
  alternates: {
    canonical: "https://kpsscografya.com.tr/konu",
  },
};

export default function KonularPage() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-[var(--background)] py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-3 tracking-tight">
            Konu Anlatımları
          </h1>
          <p className="text-ink-500 text-base max-w-xl leading-relaxed">
            KPSS müfredatındaki 10 temel konu. Her biri sınav odaklı, detaylı ve güncel verilerle
            desteklendi.
          </p>
        </div>

        {/* Grid — 2 col on tablet, single on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {konular.map((k) => (
            <Link
              key={k.slug}
              href={`/konu/${k.slug}`}
              className="group flex items-start gap-4 bg-white dark:bg-ink-800 rounded-xl border border-ink-100 dark:border-ink-700 p-5 hover:border-focus-200 dark:hover:border-focus-700 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="w-12 h-12 shrink-0 rounded-lg bg-focus-50 border border-focus-100/50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                {k.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-ink-900 dark:text-white text-sm group-hover:text-focus-700 dark:group-hover:text-focus-400 transition-colors truncate">
                    {k.baslik}
                  </h3>
                  <span
                    className={`shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      k.agirlik === "yüksek"
                        ? "text-rose-600 border-rose-200 bg-rose-50"
                        : k.agirlik === "orta"
                          ? "text-amber-600 border-amber-200 bg-amber-50"
                          : "text-emerald-600 border-emerald-200 bg-emerald-50"
                    }`}
                  >
                    {k.agirlik}
                  </span>
                </div>
                <p className="text-ink-400 text-xs leading-relaxed line-clamp-2">{k.aciklama}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
                  <span>~{k.kpss_soru_sayisi_ort} soru/yıl</span>
                  <span className="text-focus-500 font-semibold group-hover:text-focus-600">
                    Oku →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
