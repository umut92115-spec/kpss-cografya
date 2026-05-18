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

const renkler: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 hover:border-blue-500 text-blue-700",
  green: "bg-green-50 border-green-200 hover:border-green-500 text-green-700",
  amber: "bg-amber-50 border-amber-200 hover:border-amber-500 text-amber-700",
  indigo: "bg-indigo-50 border-indigo-200 hover:border-indigo-500 text-indigo-700",
  rose: "bg-rose-50 border-rose-200 hover:border-rose-500 text-rose-700",
};

export default function HazirlikPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Hangi Seviyeden Hazırlanıyorsun?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            KPSS ve YKS (TYT/AYT) coğrafya hazırlığı için seviyene özel konu anlatımı, soru dağılımı
            ve interaktif quiz.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seviyeler.map((s) => (
            <Link
              key={s.slug}
              href={`/hazirlik/${s.slug}`}
              className={`group block border-2 rounded-2xl p-8 transition-all duration-200 hover:shadow-lg ${renkler[s.renk]}`}
            >
              <div className="text-5xl mb-4">{s.favicon}</div>
              <h2 className="text-xl font-black mb-2">{s.baslik}</h2>
              <p className="text-sm opacity-80 mb-4">{s.aciklama}</p>
              <div className="text-sm font-bold">{s.bankaSoruSayisi}+ Soru Bankası →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
