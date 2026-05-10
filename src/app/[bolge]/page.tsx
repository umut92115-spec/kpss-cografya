import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bolgeler, getBolgeByUrl, getIllerByBolge, getBolgeVerileri } from '@/lib/getIlData';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';

export async function generateStaticParams() {
  return bolgeler.map((b) => ({ bolge: b.url }));
}

export async function generateMetadata({ params }: { params: { bolge: string } }): Promise<Metadata> {
  const bolge = getBolgeByUrl(params.bolge);
  if (!bolge) return {};
  return {
    title: `${bolge.ad} Bölgesi — Coğrafya Ansiklopedisi`,
    description: `${bolge.ad} Bölgesi'nin fiziki, beşeri ve ekonomik coğrafya özellikleri. Akademik analizler ve detaylı veriler.`,
    openGraph: {
      images: [`/images/bolgeler/${bolge.slug}.png`],
    },
  };
}

export default function BolgePage({ params }: { params: { bolge: string } }) {
  const bolge = getBolgeByUrl(params.bolge);
  if (!bolge) notFound();

  const iller = getIllerByBolge(bolge.slug);
  const veriler = getBolgeVerileri(bolge.slug);

  const toplamNufus = iller.reduce((acc, curr) => acc + curr.nufus_2023, 0);
  const toplamAlan = iller.reduce((acc, curr) => acc + curr.yuzolcumu_km2, 0);
  const nufusFormatli = new Intl.NumberFormat('tr-TR').format(toplamNufus);
  const alanFormatli = new Intl.NumberFormat('tr-TR').format(toplamAlan);

  // Elimizde kesin olan görsellerin haritası
  const mevcutGorseller: Record<string, string[]> = {
    'akdeniz': ['iklim_bitki', 'tarim_hayvancilik'],
    'ege': ['tarim_hayvancilik', 'turizm'],
    'marmara': ['sanayi_ticaret', 'ulasim_sinir'],
    'karadeniz': ['su_ortusu'],
    'ic-anadolu': ['yer_sekilleri'],
    'dogu-anadolu': ['maden_enerji'],
    'guneydogu-anadolu': ['kalkinma']
  };

  const bolumler = [
    { id: 'konum', baslik: 'Coğrafi Konum', icon: '🌍' },
    { id: 'yer_sekilleri', baslik: 'Yer Şekilleri', icon: '⛰️' },
    { id: 'jeoloji', baslik: 'Jeolojik Yapı', icon: '🧬' },
    { id: 'su_ortusu', baslik: 'Su Örtüsü', icon: '🌊' },
    { id: 'iklim_bitki', baslik: 'İklim ve Bitki Örtüsü', icon: '☀️' },
    { id: 'toprak_cevre', baslik: 'Toprak ve Çevre', icon: '🌱' },
    { id: 'nufus', baslik: 'Nüfus ve Yerleşme', icon: '👥' },
    { id: 'tarim_hayvancilik', baslik: 'Tarım ve Hayvancılık', icon: '🌾' },
    { id: 'maden_enerji', baslik: 'Maden ve Enerji', icon: '⛏️' },
    { id: 'sanayi_ticaret', baslik: 'Sanayi ve Ticaret', icon: '🏭' },
    { id: 'ulasim_sinir', baslik: 'Ulaşım ve Sınır', icon: '🛤️' },
    { id: 'turizm', baslik: 'Turizm Potansiyeli', icon: '🏖️' },
    { id: 'kalkinma', baslik: 'Kalkınma Projeleri', icon: '🏗️' },
  ];

  // FAQ verisi için normalize et (soru/cevap veya q/a formatları)
  const bolgeFaqs = (veriler?.faqs || [])
    .filter((f: any) => (f.soru || f.q) && (f.cevap || f.a))
    .map((f: any) => ({ q: f.soru || f.q, a: f.cevap || f.a }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* GÖREV 1 ✅ — Bölge FAQPage JSON-LD (7 bölge × 30 soru = 210 FAQ görünür) */}
      {bolgeFaqs.length > 0 && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: bolgeFaqs.map((f: { q: string; a: string }) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-6 text-sm text-gray-500 border-b border-gray-200 pb-4">
          <Link href="/" className="hover:underline">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-bold">{bolge.ad} Bölgesi</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <h1 className="text-4xl font-serif font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">
                {bolge.ad} Bölgesi
              </h1>

              <div className="prose prose-blue max-w-none mb-12">
                <p className="text-lg leading-relaxed text-gray-700 italic">
                  {veriler?.konum?.split('.')[0]}. {bolge.ad} Bölgesi, Türkiye&apos;nin stratejik açıdan en önemli coğrafi alanlarından biridir.
                </p>
              </div>

              {veriler?.kpss_altin_not && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">⭐</span>
                    <h4 className="font-black text-amber-900 uppercase tracking-widest text-xs">KPSS Stratejik Not</h4>
                  </div>
                  <p className="text-amber-900 font-bold text-lg">{veriler.kpss_altin_not}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-100">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">İçindekiler</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {bolumler.map((b, idx) => (
                    <li key={b.id} className="text-sm">
                      <a href={`#${b.id}`} className="text-blue-600 hover:underline flex items-center gap-2">
                        <span className="text-gray-300 w-4 font-mono">{idx + 1}.</span>
                        {b.baslik}
                      </a>
                    </li>
                  ))}
                  <li className="text-sm"><a href="#sss" className="text-blue-600 hover:underline">Sıkça Sorulan Sorular</a></li>
                </ul>
              </div>

              <div className="space-y-16">
                {bolumler.map((b) => (
                  <section key={b.id} id={b.id} className="scroll-mt-20">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-2">
                      <span className="text-2xl">{b.icon}</span>
                      <h2 className="text-2xl font-black text-gray-900">{b.baslik}</h2>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                      <div className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                        {veriler?.[b.id as keyof typeof veriler] || "İçerik hazırlanıyor..."}
                      </div>

                      {/* Sadece elimizde olan görselleri göster */}
                      {mevcutGorseller[bolge.slug]?.includes(b.id) && (
                        <div className="my-4 aspect-video rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                          <img 
                            src={`/images/bolgeler/${bolge.slug}-${b.id}.png`} 
                            alt={`${bolge.ad} ${b.baslik} Haritası`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>

              <section id="sss" className="mt-24 pt-12 border-t-2 border-gray-100 scroll-mt-20">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <span className="text-blue-600">❓</span> Sıkça Sorulan Sorular
                </h2>
                <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100">
                  <FaqAccordion faqs={veriler?.faqs?.map((f: any) => ({ q: f.soru || f.q, a: f.cevap || f.a })) || []} />
                </div>
              </section>
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm sticky top-8">
              <div className="bg-gray-100 p-4 text-center border-b border-gray-200">
                <h3 className="font-black text-xl text-gray-800">{bolge.ad} Bölgesi</h3>
              </div>
              <div className="p-2">
                <div className="aspect-square rounded-lg bg-gray-100 mb-4 overflow-hidden border border-gray-100">
                  <img src={`/images/bolgeler/${bolge.slug}.png`} alt={bolge.ad} className="w-full h-full object-cover" />
                </div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-50"><th className="text-left py-3 px-2 bg-gray-50/50 w-1/3">Ülke</th><td className="py-3 px-2">🇹🇷 Türkiye</td></tr>
                    <tr className="border-b border-gray-50"><th className="text-left py-3 px-2 bg-gray-50/50">Nüfus</th><td className="py-3 px-2 font-bold">{nufusFormatli}</td></tr>
                    <tr className="border-b border-gray-50"><th className="text-left py-3 px-2 bg-gray-50/50">Yüzölçümü</th><td className="py-3 px-2">{alanFormatli} km²</td></tr>
                    <tr className="border-b border-gray-50"><th className="text-left py-3 px-2 bg-gray-50/50">Şehir Sayısı</th><td className="py-3 px-2">{iller.length}</td></tr>
                    <tr className="border-b border-gray-50"><th className="text-left py-3 px-2 bg-gray-50/50">En Büyük Şehir</th><td className="py-3 px-2 font-bold">{iller.sort((a,b) => b.nufus_2023-a.nufus_2023)[0]?.ad}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-blue-50/30 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase text-blue-400 mb-3 tracking-widest">Bölge İlleri</h4>
                <div className="flex flex-wrap gap-1.5">
                  {iller.map(il => (
                    <Link key={il.slug} href={`/${params.bolge}/il/${il.slug}`} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md font-bold">{il.ad}</Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
