import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllIller, getIl, getIlKonuData, getIlOzet } from '@/lib/getIlData';
import { getAllKonular } from '@/lib/getKonuData';
import IlTablar from '@/components/IlTablar';
import JsonLd from '@/components/JsonLd';
import IlgiliBaglantilar from '@/components/IlgiliBaglantilar';

// ─── Statik Param Üretimi ──────────────────────────────────────────────────
export async function generateStaticParams() {
  const iller = getAllIller();
  return iller.map((il) => ({
    bolge: `${il.bolge_slug}bolgesi`,
    slug: il.slug
  }));
}

// ─── SEO Metadata + Geo Tag ────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { bolge: string; slug: string };
}): Promise<Metadata> {
  const il = getIl(params.slug);
  if (!il) return {};

  const ilOzet = getIlOzet(params.slug);
  const tarimVerisi = getIlKonuData(il.slug, 'tarim')?.detay || '';
  const madenVerisi = getIlKonuData(il.slug, 'madenler-enerji')?.detay || '';
  const plakaKod = String(il.plaka).padStart(2, '0');

  const shortDescription = `${il.ad} KPSS Coğrafya Özeti: ${ilOzet?.[0] || ''} ${tarimVerisi.slice(0, 100)}... ${madenVerisi.slice(0, 80)}...`;

  return {
    title: `${il.ad} KPSS Coğrafya — Madenler, Tarım, İklim | kpsscografya.com.tr`,
    description: shortDescription,
    alternates: {
      canonical: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}`,
    },
    openGraph: {
      title: `${il.ad} — KPSS Coğrafya`,
      description: `${il.ad} ili KPSS coğrafya özeti ve tarım-maden bilgileri.`,
      url: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}`,
      siteName: 'kpsscografya.com.tr',
      locale: 'tr_TR',
      type: 'website',
      images: ['/og-default.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${il.ad} — KPSS Coğrafya`,
      images: ['/og-default.jpg'],
    },
    other: {
      'geo.region': `TR-${plakaKod}`,
      'geo.placename': `${il.ad}, Türkiye`,
      'geo.position': `${il.lat};${il.lng}`,
      'ICBM': `${il.lat}, ${il.lng}`,
    },
  };
}

// ─── JSON-LD Schema (Silindi, JsonLd bileşeni kullanılıyor) ────────────────────────────────────────────────────────

// ─── Sayfa Bileşeni ────────────────────────────────────────────────────────
export default function IlPage({ params }: { params: { bolge: string; slug: string } }) {
  const il = getIl(params.slug);
  if (!il) notFound();

  const tumKonular = getAllKonular();
  const ilOzet = getIlOzet(params.slug);

  // Her konu için il verisini hazırla
  const konuVerileri = Object.fromEntries(
    tumKonular.map((konu) => [konu.slug, getIlKonuData(il.slug, konu.slug)])
  );

  // Nüfus formatlama
  const nufusFormatli = new Intl.NumberFormat('tr-TR').format(il.nufus_2023);
  const alanFormatli = new Intl.NumberFormat('tr-TR').format(il.yuzolcumu_km2);
  const plakaKod = String(il.plaka).padStart(2, '0');

  return (
    <>
      <JsonLd
        tip="Place"
        veri={{
          name: `${il.ad}, Türkiye`,
          geo: {
            "@type": "GeoCoordinates",
            latitude: il.lat,
            longitude: il.lng,
          },
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Türkiye"
          }
        }}
      />
      <JsonLd
        tip="BreadcrumbList"
        veri={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://kpsscografya.com.tr" },
            { "@type": "ListItem", position: 2, name: il.bolge, item: `https://kpsscografya.com.tr/${params.bolge}` },
            { "@type": "ListItem", position: 3, name: il.ad, item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}` },
          ]
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <span>›</span>
          <Link href={`/${params.bolge}`} className="hover:text-blue-600 transition-colors">{il.bolge} Bölgesi</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{il.ad}</span>
        </nav>

        {/* ── Üst Hero Bölümü ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Sol: İl Bilgisi */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-black text-gray-200 select-none">{il.plaka}</span>
                <h1 className="text-4xl font-bold text-gray-900">{il.ad}</h1>
              </div>
              <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                <span>📍 {il.bolge} Bölgesi</span>
                <span>·</span>
                <span>TR-{plakaKod}</span>
              </p>
            </div>

            {/* Sağ: Harita Mini Koordinat Kartı */}
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <span>🌐</span>
              <span>{il.lat.toFixed(3)}°N, {il.lng.toFixed(3)}°E</span>
            </div>
          </div>

          {/* İstatistik Çipleri */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex flex-col bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 min-w-[130px]">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Nüfus (2023)</span>
              <span className="text-2xl font-bold text-blue-700 mt-1">{nufusFormatli}</span>
            </div>
            <div className="flex flex-col bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3 min-w-[130px]">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Yüzölçümü</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1">{alanFormatli} <span className="text-base font-normal">km²</span></span>
            </div>
            <div className="flex flex-col bg-purple-50 border border-purple-100 rounded-xl px-5 py-3 min-w-[130px]">
              <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Bölge</span>
              <span className="text-xl font-bold text-purple-700 mt-1">{il.bolge}</span>
            </div>
          </div>
        </div>

        {/* ── İl Kimlik Kartı (Süper Detay KPSS Notları) ── */}
        {ilOzet && ilOzet.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold flex items-center gap-2">
                <span className="text-xl">📇</span> {il.ad} — KPSS Coğrafya Kimlik Kartı
              </h2>
              <span className="text-xs text-gray-400 font-medium">2026 Müfredatı</span>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ilOzet.map((not, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-snug font-medium">{not}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400 italic">
                  * Bu bilgiler MEB ve ÖSYM güncel kaynaklarına göre hazırlanmıştır.
                </p>
                <div className="flex gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Güncel Veri</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Ana İçerik: Konular (Tab'lı) ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">KPSS Coğrafya Konuları</h2>
          <IlTablar
            params_slug={params.slug}
            bolge_slug={params.bolge}
            tumKonular={tumKonular}
            konuVerileri={konuVerileri}
          />
        </div>

        {/* ── Alt Bölüm ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Komşu İller */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Aynı Bölgedeki İller</h3>
            <div className="flex flex-wrap gap-2">
              {getAllIller()
                .filter((i) => i.bolge === il.bolge && i.slug !== il.slug)
                .slice(0, 10)
                .map((komsu) => (
                  <Link
                    key={komsu.slug}
                    href={`/${params.bolge}/il/${komsu.slug}`}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {komsu.ad}
                  </Link>
                ))}
            </div>
          </div>

          {/* Quiz CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Bu İlin Sorularını Çöz</h3>
              <p className="text-blue-200 text-sm">
                {il.ad} ile ilgili çıkmış KPSS sorularını incele ve puan kazan.
              </p>
            </div>
            <Link
              href={`/quiz/madenler-enerji`}
              className="mt-4 inline-block bg-white text-blue-700 font-bold py-2.5 px-6 rounded-xl hover:bg-blue-50 transition-colors text-sm text-center"
            >
              Quiz&apos;i Başlat →
            </Link>
          </div>
        </div>

        <IlgiliBaglantilar tip="il" slug={il.slug} />
      </div>
    </>
  );
}
