import { Metadata } from "next";
import Link from "next/link";
import { getAllIller, bolgeler } from "@/lib/getIlData";
import { Il } from "@/types";

export const metadata: Metadata = {
  title: "Türkiye İlleri KPSS Coğrafya — 81 İl | kpsscografya.com.tr",
  description:
    "Türkiye'nin tüm 81 iline ait KPSS coğrafya bilgileri: madenler, tarım, iklim, nüfus ve sanayi verileri. Bölgeye göre gruplanmış kapsamlı rehber.",
  alternates: {
    canonical: "https://kpsscografya.com.tr/il",
  },
};

const bolgeStil: Record<string, { accent: string; bg: string; icon: string }> = {
  Marmara: { accent: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: "🌊" },
  Ege: { accent: "text-sky-600", bg: "bg-sky-50 border-sky-100", icon: "🏖️" },
  Akdeniz: { accent: "text-orange-600", bg: "bg-orange-50 border-orange-100", icon: "☀️" },
  "İç Anadolu": { accent: "text-amber-600", bg: "bg-amber-50 border-amber-100", icon: "🌾" },
  Karadeniz: { accent: "text-green-600", bg: "bg-green-50 border-green-100", icon: "🌲" },
  "Doğu Anadolu": { accent: "text-purple-600", bg: "bg-purple-50 border-purple-100", icon: "⛰️" },
  "Güneydoğu Anadolu": { accent: "text-red-600", bg: "bg-red-50 border-red-100", icon: "🏜️" },
};

export default async function IllerPage() {
  const iller = await getAllIller();

  const bolgeMap: Record<string, Il[]> = {};
  for (const il of iller) {
    if (!bolgeMap[il.bolge]) bolgeMap[il.bolge] = [];
    bolgeMap[il.bolge].push(il);
  }
  for (const bolge in bolgeMap) {
    bolgeMap[bolge].sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-3 tracking-tight">
            81 İl Rehberi
          </h1>
          <p className="text-ink-500 text-base max-w-xl leading-relaxed">
            Her ilin coğrafi kimliğini incele: madenler, tarım, iklim, nüfus ve daha fazlası.
          </p>
        </div>

        {/* Regions */}
        <div className="space-y-10">
          {bolgeler.map((b) => {
            const regionName = b.ad;
            const regionIller = bolgeMap[regionName] ?? [];
            const stil = bolgeStil[regionName] ?? {
              accent: "text-ink-600",
              bg: "bg-ink-50 border-ink-100",
              icon: "📍",
            };

            return (
              <section key={b.slug}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{stil.icon}</span>
                  <h2 className={`text-lg font-bold ${stil.accent}`}>{regionName}</h2>
                  <span className="text-xs text-ink-400">{regionIller.length} il</span>
                  <Link
                    href={`/${b.url}`}
                    className="ml-auto text-xs font-semibold text-ink-400 hover:text-focus-600 transition-colors"
                  >
                    Bölge detayı →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {regionIller.map((il) => (
                    <Link
                      key={il.slug}
                      href={`/${b.url}/il/${il.slug}`}
                      className={`group flex items-center gap-2.5 border rounded-lg px-3 py-2.5 transition-all duration-200 hover:shadow-card hover:border-focus-200 ${stil.bg}`}
                    >
                      <span className="text-[10px] font-bold text-ink-300 w-5">{il.plaka}</span>
                      <span className="font-medium text-ink-800 text-sm group-hover:text-focus-700 transition-colors truncate">
                        {il.ad}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
