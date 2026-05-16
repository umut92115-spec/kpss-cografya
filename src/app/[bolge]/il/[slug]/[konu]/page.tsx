import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIl, getIlKonuData, getAllIller } from '@/lib/getIlData';
import { getKonu, getAllKonular, getKonuFaq } from '@/lib/getKonuData';
import SuperDetayRender from '@/components/SuperDetayRender';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  const iller = getAllIller();
  const konular = getAllKonular();
  
  const params = [];
  for (const il of iller) {
    for (const konu of konular) {
      if (konu.slug === 'sozluk') continue;
      params.push({
        bolge: `${il.bolge_slug}bolgesi`,
        slug: il.slug,
        konu: konu.slug
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { bolge: string; slug: string; konu: string };
}): Promise<Metadata> {
  const il = getIl(params.slug);
  const konu = getKonu(params.konu);
  if (!il || !konu || konu.slug === 'sozluk') return {};

  const data = getIlKonuData(il.slug, konu.slug);
  const superDetay = data?.super_detay;

  const title = superDetay?.title || `${il.ad} ${konu.baslik} Akademik Analizi (2026 KPSS)`;
  const description = superDetay?.meta || `${il.ad} ilinde ${konu.baslik.toLowerCase()} konusuna dair 2026 KPSS müfredatına uygun akademik detaylar, haritalar ve SSS bölümü.`;

  return {
    title,
    description,
    keywords: [
      `${il.ad} ${konu.baslik.toLowerCase()}`,
      `${il.ad} ${konu.kisa_baslik.toLowerCase()} kpss`,
      `kpss ${il.ad.toLowerCase()} ${konu.baslik.toLowerCase()}`,
      `${konu.baslik.toLowerCase()} ${il.bolge} bölgesi`,
    ],
    alternates: {
      canonical: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}/${konu.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}/${konu.slug}`,
      siteName: 'kpsscografya.com.tr',
      locale: 'tr_TR',
      type: 'article',
      images: ['/og-default.jpg'],
    },
    twitter: { 
      card: 'summary_large_image', 
      title,
      images: ['/og-default.jpg'],
    },
    other: {
      'geo.region': `TR-${String(il.plaka).padStart(2, '0')}`,
      'geo.placename': `${il.ad}, Türkiye`,
      'geo.position': `${il.lat};${il.lng}`,
      'ICBM': `${il.lat}, ${il.lng}`,
    },
  };
}

export default function IlKonuDetayPage({
  params,
}: {
  params: { bolge: string; slug: string; konu: string };
}) {
  const il = getIl(params.slug);
  const konu = getKonu(params.konu);
  if (!il || !konu || konu.slug === 'sozluk') notFound();

  const data = getIlKonuData(il.slug, konu.slug);

  // Tüm iller için bu konunun matris verisini topla (Harita boyaması için)
  const iller = getAllIller();
  const matrisData = iller.reduce((acc, curr) => {
    const d = getIlKonuData(curr.slug, konu.slug);
    if (d) acc[curr.slug] = d;
    return acc;
  }, {} as Record<string, any>);

  // GÖREV 3 ✅ — FAQ Fallback: matris boşsa faq-konular.json'dan genel soruları kullan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matrisFaqs: { q: string; a: string }[] = (data as any)?.faqs ?? [];
  const superDetayFaqs: { q: string; a: string }[] = data?.super_detay?.faqs ?? [];
  const effectiveFaqs =
    matrisFaqs.length > 0 ? matrisFaqs
    : superDetayFaqs.length > 0 ? superDetayFaqs
    : getKonuFaq(konu.slug); // ← faq-konular.json fallback (15 soru)

  if (!data?.super_detay) {
    // super_detay olmasa bile FAQPage + Breadcrumb schema'sını gönder
    // ÖNEMLI: Google FAQPage rich result için görünür içerik de zorunlu — accordion ekliyoruz
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* BreadcrumbList schema */}
        <JsonLd
          tip="BreadcrumbList"
          veri={{
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://kpsscografya.com.tr" },
              { "@type": "ListItem", position: 2, name: il.bolge, item: `https://kpsscografya.com.tr/${params.bolge}` },
              { "@type": "ListItem", position: 3, name: il.ad, item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}` },
              { "@type": "ListItem", position: 4, name: konu.kisa_baslik, item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}/${konu.slug}` },
            ]
          }}
        />
        {/* FAQPage schema — görünür accordion ile eşleşiyor (Google uyumlu) */}
        {effectiveFaqs.length > 0 && (
          <JsonLd
            tip="FAQPage"
            veri={{
              mainEntity: effectiveFaqs
                .filter(f => f.q && f.a)
                .map(f => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            }}
          />
        )}

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-400 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <span>›</span>
          <Link href={`/${params.bolge}`} className="hover:text-blue-600 transition-colors">{il.bolge} Bölgesi</Link>
          <span>›</span>
          <Link href={`/${params.bolge}/il/${il.slug}`} className="hover:text-blue-600 transition-colors">{il.ad}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{konu.kisa_baslik}</span>
        </nav>

        {/* Sayfa başlığı */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            {konu.icon} {konu.kisa_baslik}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{il.ad} {konu.baslik}</h1>
          <p className="text-gray-500 leading-relaxed">
            {il.ad} ili için {konu.baslik.toLowerCase()} konusundaki KPSS hazırlık içeriği hazırlanıyor. 
            Bu aşamada konuya dair sık sorulan sorular aşağıda listelenmiştir.
          </p>
        </div>

        {/* Görünür FAQ Accordion — Google rich result için zorunlu */}
        {effectiveFaqs.length > 0 && (
          <section id="sss" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">?</span>
              {il.ad} {konu.kisa_baslik} — Sıkça Sorulan Sorular
            </h2>
            <div className="bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-100">
              <FaqAccordion faqs={effectiveFaqs} />
            </div>
          </section>
        )}

        {/* İl sayfasına geri dön */}
        <div className="flex gap-4 flex-wrap">
          <Link
            href={`/${params.bolge}/il/${il.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 transition-colors"
          >
            ← {il.ad} Ana Sayfası
          </Link>
          <Link
            href={`/konu/${konu.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
          >
            📖 {konu.baslik} Konu Anlatımı →
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
        <span>›</span>
        <Link href={`/${params.bolge}`} className="hover:text-blue-600 transition-colors">{il.bolge} Bölgesi</Link>
        <span>›</span>
        <Link href={`/${params.bolge}/il/${il.slug}`} className="hover:text-blue-600 transition-colors">{il.ad}</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{konu.kisa_baslik}</span>
      </nav>

      <JsonLd
        tip="BreadcrumbList"
        veri={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://kpsscografya.com.tr" },
            { "@type": "ListItem", position: 2, name: il.bolge, item: `https://kpsscografya.com.tr/${params.bolge}` },
            { "@type": "ListItem", position: 3, name: il.ad, item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}` },
            { "@type": "ListItem", position: 4, name: konu.kisa_baslik, item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}/${konu.slug}` },
          ]
        }}
      />

      <SuperDetayRender 
        data={{
          ...data.super_detay,
          faqs: effectiveFaqs,
        }} 
        ilAd={il.ad} 
        konuBaslik={konu.baslik}
        konuSlug={konu.slug}
        ilSlug={il.slug}
        matrisData={matrisData}
        temaRenk={konu.harita_renk}
      />

      {/* İlgili Diğer Konular */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">{il.ad} İçin Diğer Konular</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getAllKonular().filter(k => k.slug !== konu.slug && k.slug !== 'sozluk').slice(0, 4).map(k => (
            <Link 
              key={k.slug}
              href={`/${params.bolge}/il/${il.slug}/${k.slug}`}
              className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl mb-2 block">{k.icon}</span>
              <span className="text-sm font-medium text-gray-700">{k.kisa_baslik}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
