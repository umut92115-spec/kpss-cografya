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
  const iller = getIllerByBolge(bolge.slug);

  return {
    title: `${bolge.ad} Bölgesi KPSS Coğrafya Notları ve Analizleri`,
    description: `${bolge.ad} Bölgesi'nin iklimi, yer şekilleri, tarım ürünleri ve sanayisi hakkında detaylı KPSS coğrafya bilgileri. ${iller.length} ilin kapsamlı analizi.`,
    alternates: {
      canonical: `https://kpsscografya.com/${params.bolge}`,
    },
    openGraph: {
      title: `${bolge.ad} Bölgesi — KPSS Coğrafya`,
      description: `${bolge.ad} Bölgesi hakkında kapsamlı coğrafi bilgiler ve il detayları.`,
      url: `https://kpsscografya.com/${params.bolge}`,
      siteName: 'kpsscografya.com',
      locale: 'tr_TR',
      type: 'website',
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

  const fizikiKonular = [
    { id: 'konum', baslik: 'Coğrafi Konum', icon: '🌍' },
    { id: 'yer_sekilleri', baslik: 'Yer Şekilleri', icon: '⛰️' },
    { id: 'jeoloji', baslik: 'Jeolojik Yapı', icon: '🧬' },
    { id: 'su_ortusu', baslik: 'Su Örtüsü (Akarsu/Göl)', icon: '🌊' },
    { id: 'iklim_bitki', baslik: 'İklim & Bitki', icon: '☀️' },
    { id: 'toprak_cevre', baslik: 'Toprak & Çevre', icon: '🌱' },
  ];

  const beseriKonular = [
    { id: 'nufus', baslik: 'Nüfus & Yerleşme', icon: '👥' },
    { id: 'tarim_hayvancilik', baslik: 'Tarım & Hayvancılık', icon: '🌾' },
    { id: 'maden_enerji', baslik: 'Maden & Enerji', icon: '⛏️' },
    { id: 'sanayi_ticaret', baslik: 'Sanayi & Ticaret', icon: '🏭' },
    { id: 'ulasim_sinir', baslik: 'Ulaşım & Sınır', icon: '🛤️' },
    { id: 'turizm', baslik: 'Turizm Potansiyeli', icon: '🏖️' },
    { id: 'kalkinma', baslik: 'Kalkınma Projeleri', icon: '🏗️' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <JsonLd
        tip="AdministrativeArea"
        veri={{
          name: `${bolge.ad} Bölgesi`,
          address: {
            "@type": "PostalAddress",
            addressCountry: "TR"
          },
          containedInPlace: {
            "@type": "Place",
            name: "Türkiye"
          }
        }}
      />
      <JsonLd
        tip="BreadcrumbList"
        veri={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://kpsscografya.com" },
            { "@type": "ListItem", position: 2, name: bolge.ad, item: `https://kpsscografya.com/${params.bolge}` },
          ]
        }}
      />

      {veriler?.faqs && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: veriler.faqs.map((f: any) => ({
              "@type": "Question",
              name: f.soru,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.cevap
              }
            }))
          }}
        />
      )}

      {/* Hero Section */}
      <section className="mb-16">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-medium">{bolge.ad} Bölgesi</span>
        </nav>

        <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              {bolge.ad} <span className="text-blue-400">Bölgesi</span>
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Toplam Nüfus</p>
                <p className="text-2xl md:text-3xl font-black">{nufusFormatli}</p>
              </div>
              <div>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Yüzölçümü</p>
                <p className="text-2xl md:text-3xl font-black">{alanFormatli} <span className="text-sm font-normal">km²</span></p>
              </div>
              <div>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Şehir Sayısı</p>
                <p className="text-2xl md:text-3xl font-black">{iller.length}</p>
              </div>
              <div>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Ülke Payı</p>
                <p className="text-2xl md:text-3xl font-black">%{((toplamAlan / 783562) * 100).toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Evaluation Cards */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Bölgesel Coğrafya Analizi</h2>
        </div>

        {/* Fiziki Coğrafya */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>Fiziki Analiz</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fizikiKonular.map((konu) => (
              <div key={konu.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-100 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{konu.icon}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{konu.baslik}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {veriler?.[konu.id as keyof typeof veriler] || "Bu bölge için veri henüz girilmemiş."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Beşeri ve Ekonomik Coğrafya */}
        <div>
          <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>Beşeri & Ekonomik Analiz</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beseriKonular.map((konu) => (
              <div key={konu.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-100 group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{konu.icon}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{konu.baslik}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {veriler?.[konu.id as keyof typeof veriler] || "Bu bölge için veri henüz girilmemiş."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {veriler?.faqs && (
        <section className="mb-20 bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sık Sorulan Sorular</h2>
          </div>
          <FaqAccordion faqs={veriler.faqs} />
        </section>
      )}

      {/* Provinces List */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{bolge.ad} Bölgesi İlleri</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {iller.map((il) => (
            <Link
              key={il.slug}
              href={`/${params.bolge}/il/${il.slug}`}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-center group"
            >
              <span className="text-xs font-bold text-gray-300 group-hover:text-blue-500 transition-colors block mb-1">
                {String(il.plaka).padStart(2, '0')}
              </span>
              <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {il.ad}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
