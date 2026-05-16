import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllIller, getIl, getIlKonuData, getIlOzet } from '@/lib/getIlData';
import { getAllKonular, getKonuFaq } from '@/lib/getKonuData';
import IlTablar from '@/components/IlTablar';
import JsonLd from '@/components/JsonLd';
import IlgiliBaglantilar from '@/components/IlgiliBaglantilar';
import FaqAccordion from '@/components/FaqAccordion';
import { getIlJsonLd } from '@/lib/geoMeta';
import MiniIlHaritasi from '@/components/MiniIlHaritasi';
import { MapPin, Info, BookOpen, HelpCircle, Layers, Star } from 'lucide-react';

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

        <div className="grid grid-cols-1 gap-12">
          {/* Main Wiki Content */}
          <main className="space-y-12">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 overflow-hidden relative">
              {/* Dekoratif Arka Plan */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {il.bolge} BÖLGESİ
                  </span>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                  {il.ad}
                </h1>

                {/* Wiki Abstract */}
                <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-3xl">
                  {il.ad}, Türkiye&apos;nin <strong>{il.bolge}</strong> Bölgesi&apos;nde yer alan, 
                  nüfusu <strong>{nufusFormatli}</strong> ve yüzölçümü <strong>{alanFormatli} km²</strong> olan stratejik bir şehrimizdir.
                </p>

                {/* Table of Contents - Modernized */}
                <div className="inline-block bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 mb-12 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">İçindekiler</h2>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <li><a href="#ozellikler" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"><span className="w-4 h-4 flex items-center justify-center bg-white rounded-md border border-slate-200 text-[10px] font-bold">1</span> Akademik Kimlik Kartı</a></li>
                    <li><a href="#matris" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"><span className="w-4 h-4 flex items-center justify-center bg-white rounded-md border border-slate-200 text-[10px] font-bold">2</span> Coğrafi Konu Matrisi</a></li>
                    <li><a href="#bolgesel" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"><span className="w-4 h-4 flex items-center justify-center bg-white rounded-md border border-slate-200 text-[10px] font-bold">3</span> Bölgesel Yakınlık</a></li>
                    {ilFaqs.length > 0 && (
                      <li><a href="#sss" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"><span className="w-4 h-4 flex items-center justify-center bg-white rounded-md border border-slate-200 text-[10px] font-bold">4</span> Sıkça Sorulan Sorular</a></li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Section 1: Ozet & Harita */}
              <section id="ozellikler" className="scroll-mt-20 mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Akademik Kimlik Kartı ve Konum</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                  {/* Sol Taraf: Kimlik Kartı Maddeleri - Premium Cards */}
                  <div className="flex flex-col gap-4">
                    {ilOzet?.map((not, idx) => (
                      <div key={idx} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex items-start gap-4">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                          <Star className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 group-hover:text-gray-900 transition-colors">
                          {not}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Sağ Taraf: Vektörel Siyasi Harita - Glassmorphism Container */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-200/60 p-1 shadow-inner relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_100%)]"></div>
                    <div className="w-full h-full min-h-[400px] relative z-10">
                      <MiniIlHaritasi 
                        secilenIlSlug={il.slug} 
                        bolgeIlleri={getAllIller().filter(i => i.bolge_slug === il.bolge_slug).map(i => i.slug)}
                        ilAdi={il.ad}
                        bolgeAdi={il.bolge}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Konu Matrisi (Tabs) */}
              <section id="matris" className="scroll-mt-20 mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Coğrafi Konu Matrisi</h2>
                </div>
                <div className="mt-4">
                  <IlTablar
                    params_slug={params.slug}
                    bolge_slug={params.bolge}
                    tumKonular={tumKonularFiltreli}
                    konuVerileri={konuVerileri}
                  />
                </div>
              </section>

              {/* Section 3: Regional Connections */}
              <section id="bolgesel" className="scroll-mt-20 mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Bölgesel Yakınlık</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {getAllIller()
                    .filter((i) => i.bolge === il.bolge && i.slug !== il.slug)
                    .map((komsu) => (
                      <Link
                        key={komsu.slug}
                        href={`/${params.bolge}/il/${komsu.slug}`}
                        className="text-xs bg-white text-slate-600 hover:bg-emerald-600 hover:text-white px-5 py-3 rounded-xl transition-all duration-300 font-bold border border-slate-100 shadow-sm hover:shadow-emerald-100"
                      >
                        {komsu.ad}
                      </Link>
                    ))}
                </div>
              </section>

              {/* Section 4: SSS */}
              {ilFaqs.length > 0 && (
                <section id="sss" className="scroll-mt-20 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
                  <div className="bg-slate-50/50 rounded-3xl p-4 md:p-8 border border-slate-100 mt-4">
                    <FaqAccordion faqs={ilFaqs} />
                  </div>
                </section>
              )}
            </div>
            
            <IlgiliBaglantilar tip="il" slug={il.slug} />
          </main>


        </div>
      </div>
    </div>
  );
}
