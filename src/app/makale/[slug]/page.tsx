import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllMakaleler, getMakale } from '@/lib/getMakaleData';
import JsonLd from '@/components/JsonLd';
import IlgiliBaglantilar from '@/components/IlgiliBaglantilar';

export async function generateStaticParams() {
  const makaleler = getAllMakaleler();
  return makaleler.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const makale = getMakale(params.slug);
  if (!makale) return {};
  
  return {
    title: `${makale.baslik} — KPSS Coğrafya`,
    description: makale.aciklama,
    alternates: {
      canonical: `https://kpsscografya.com/makale/${makale.slug}`,
    },
    openGraph: {
      title: makale.baslik,
      description: makale.aciklama,
      url: `https://kpsscografya.com/makale/${makale.slug}`,
      siteName: 'kpsscografya.com',
      locale: 'tr_TR',
      type: 'article',
      publishedTime: makale.guncelleme,
      modifiedTime: makale.guncelleme,
    },
  };
}

export default function MakalePage({ params }: { params: { slug: string } }) {
  const makale = getMakale(params.slug);
  
  if (!makale) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd
        tip="Article"
        veri={{
          headline: makale.baslik,
          description: makale.aciklama,
          datePublished: makale.guncelleme,
          dateModified: makale.guncelleme,
          author: {
            "@type": "Organization",
            name: "kpsscografya.com"
          },
          publisher: {
            "@type": "EducationalOrganization",
            name: "kpsscografya.com",
            url: "https://kpsscografya.com"
          },
          inLanguage: "tr",
          isAccessibleForFree: true
        }}
      />
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{makale.baslik}</h1>
        <p className="text-gray-500 mb-8">Son Güncelleme: {new Date(makale.guncelleme).toLocaleDateString('tr-TR')}</p>
        
        <p className="lead">{makale.aciklama}</p>
        <p>Buraya gerçek makale içeriği (MDX üzerinden) gelecek.</p>
        
        <IlgiliBaglantilar tip="makale" slug={makale.slug} />
      </article>
    </div>
  );
}
