import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIl, getIlKonuData, getAllIller } from '@/lib/getIlData';
import { getKonu, getAllKonular, getKonuFaq } from '@/lib/getKonuData';
import SuperDetayRender from '@/components/SuperDetayRender';
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
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
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
        {/* FAQPage schema — faq-konular.json fallback ile her zaman var */}
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{il.ad} {konu.baslik}</h1>
        <p className="text-gray-600 mb-8">Bu konu için henüz detaylı içerik hazırlanmamıştır.</p>
        <Link href={`/${params.bolge}/il/${il.slug}`} className="text-blue-600 hover:underline">
          ← İl sayfasına geri dön
        </Link>
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
