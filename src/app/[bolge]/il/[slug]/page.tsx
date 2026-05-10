import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllIller, getIl, getIlKonuData, getIlOzet } from '@/lib/getIlData';
import { getAllKonular, getKonuFaq } from '@/lib/getKonuData';
import IlTablar from '@/components/IlTablar';
import JsonLd from '@/components/JsonLd';
import IlgiliBaglantilar from '@/components/IlgiliBaglantilar';
import { getIlJsonLd } from '@/lib/geoMeta';

// ─── Statik Param Üretimi ──────────────────────────────────────────────────
export async function generateStaticParams() {
  const iller = getAllIller();
  return iller.map((il) => ({
    bolge: `${il.bolge_slug}bolgesi`,
    slug: il.slug
  }));
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { bolge: string; slug: string } }): Promise<Metadata> {
  const il = getIl(params.slug);
  if (!il) return {};
  const ilOzet = getIlOzet(params.slug);
  return {
    title: `${il.ad} Hakkında Coğrafi Bilgiler — Coğrafya Ansiklopedisi`,
    description: `${il.ad} ili KPSS coğrafya özeti: ${ilOzet?.[0] || ''}`,
    alternates: { canonical: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}` },
  };
}

export default function IlPage({ params }: { params: { bolge: string; slug: string } }) {
  const il = getIl(params.slug);
  if (!il) notFound();

  const tumKonular = getAllKonular();
  const ilOzet = getIlOzet(params.slug);
  const tumKonularFiltreli = tumKonular.filter(k => k.slug !== 'sozluk');
  const konuVerileri = Object.fromEntries(
    tumKonularFiltreli.map((konu) => [konu.slug, getIlKonuData(il.slug, konu.slug)])
  );

  // GÖREV 2 ✅ — İl FAQPage: faq-konular.json'dan konu başına 2 soru → toplam ~10 soru/il
  const ilFaqs = tumKonularFiltreli
    .flatMap((k) => getKonuFaq(k.slug).slice(0, 2))
    .filter((f) => f?.q && f?.a)
    .slice(0, 10);

  const nufusFormatli = new Intl.NumberFormat('tr-TR').format(il.nufus_2023);
  const alanFormatli = new Intl.NumberFormat('tr-TR').format(il.yuzolcumu_km2);
  const plakaKod = String(il.plaka).padStart(2, '0');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <JsonLd tip="AdministrativeArea" veri={getIlJsonLd(il)} />
      <JsonLd tip="BreadcrumbList" veri={{
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://kpsscografya.com.tr" },
          { "@type": "ListItem", position: 2, name: il.bolge, item: `https://kpsscografya.com.tr/${params.bolge}` },
          { "@type": "ListItem", position: 3, name: il.ad, item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}` },
        ]
      }} />
      {/* GÖREV 2 ✅ — İl FAQPage JSON-LD (81 il × 10 soru = 810 FAQ görünür) */}
      {ilFaqs.length > 0 && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: ilFaqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wiki Breadcrumb */}
        <nav className="mb-6 text-xs text-gray-500 border-b border-gray-200 pb-4 flex items-center gap-2">
          <Link href="/" className="hover:underline">Ana Sayfa</Link>
          <span>/</span>
          <Link href={`/${params.bolge}`} className="hover:underline">{il.bolge}</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{il.ad}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Wiki Content */}
          <main className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-4xl font-serif font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">
                {il.ad}
              </h1>

              {/* Wiki Abstract */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {il.ad}, Türkiye&apos;nin <strong>{il.bolge}</strong> Bölgesi&apos;nde yer alır. 
                Güncel verilere göre şehrin nüfusu <strong>{nufusFormatli}</strong>, yüzölçümü ise <strong>{alanFormatli} km²</strong>&apos;dir.
              </p>

              {/* Table of Contents */}
              <div className="bg-gray-50 rounded-lg p-6 mb-12 border border-gray-100">
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">İçindekiler</h2>
                <ul className="space-y-2 text-sm">
                  <li><a href="#ozellikler" className="text-blue-600 hover:underline">1. Akademik Kimlik Kartı</a></li>
                  <li><a href="#matris" className="text-blue-600 hover:underline">2. Coğrafi Konu Matrisi</a></li>
                  <li><a href="#bolgesel" className="text-blue-600 hover:underline">3. Bölgesel Yakınlık</a></li>
                </ul>
              </div>

              {/* Section 1: Ozet */}
              <section id="ozellikler" className="scroll-mt-20 mb-16">
                <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-2">1. Akademik Kimlik Kartı</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ilOzet?.map((not, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed text-gray-700">
                      <span className="font-bold text-blue-600 mr-2">#{idx+1}</span>
                      {not}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: Konu Matrisi (Tabs) */}
              <section id="matris" className="scroll-mt-20 mb-16">
                <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-2">2. Coğrafi Konu Matrisi</h2>
                <div className="mt-8">
                  <IlTablar
                    params_slug={params.slug}
                    bolge_slug={params.bolge}
                    tumKonular={tumKonularFiltreli}
                    konuVerileri={konuVerileri}
                  />
                </div>
              </section>

              {/* Section 3: Regional Connections */}
              <section id="bolgesel" className="scroll-mt-20">
                <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-2">3. Bölgesel Yakınlık</h2>
                <div className="flex flex-wrap gap-2">
                  {getAllIller()
                    .filter((i) => i.bolge === il.bolge && i.slug !== il.slug)
                    .map((komsu) => (
                      <Link
                        key={komsu.slug}
                        href={`/${params.bolge}/il/${komsu.slug}`}
                        className="text-xs bg-gray-100 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg transition-all font-bold border border-gray-200"
                      >
                        {komsu.ad}
                      </Link>
                    ))}
                </div>
              </section>
            </div>
            
            <IlgiliBaglantilar tip="il" slug={il.slug} />
          </main>

          {/* Wiki Sidebar (Infobox) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8">
              <div className="bg-gray-100 p-4 text-center border-b border-gray-200">
                <h3 className="font-black text-xl text-gray-800">{il.ad}</h3>
                <span className="text-xs text-gray-500 font-bold tracking-widest">TÜRKİYE CUMHURİYETİ</span>
              </div>
              
              <div className="p-4">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-3 px-2 bg-gray-50/50 w-1/3">Bölge</th>
                      <td className="py-3 px-2">
                        <Link href={`/${params.bolge}`} className="text-blue-600 hover:underline">{il.bolge}</Link>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-3 px-2 bg-gray-50/50">Plaka Kodu</th>
                      <td className="py-3 px-2 font-mono font-bold text-lg">{plakaKod}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-3 px-2 bg-gray-50/50">Nüfus (2023)</th>
                      <td className="py-3 px-2 font-bold">{nufusFormatli}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-3 px-2 bg-gray-50/50">Yüzölçümü</th>
                      <td className="py-3 px-2">{alanFormatli} km²</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <th className="text-left py-3 px-2 bg-gray-50/50">Koordinatlar</th>
                      <td className="py-3 px-2 text-xs font-mono">{il.lat.toFixed(2)}°N {il.lng.toFixed(2)}°E</td>
                    </tr>
                  </tbody>
                </table>

                {/* Quiz CTA in Wiki Style */}
                <div className="mt-6 bg-blue-600 rounded-xl p-6 text-white text-center">
                  <h4 className="font-black text-lg mb-2">Bilgini Test Et</h4>
                  <p className="text-[10px] opacity-80 mb-4 leading-tight">{il.ad} ile ilgili KPSS formatında soruları çöz.</p>
                  <Link 
                    href="/quiz/madenler-enerji" 
                    className="inline-block w-full bg-white text-blue-600 font-black py-3 rounded-lg text-xs hover:bg-gray-100 transition-colors"
                  >
                    SINAVA BAŞLA
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
