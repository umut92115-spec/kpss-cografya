import React from 'react';
import { getKonu, getAllKonular, getKonuFaq } from '@/lib/getKonuData';
import type { FAQ } from '@/types';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import KonuOzetKarti from '@/components/KonuOzetKarti';
import IcindekilerTablosu, { TocItem } from '@/components/IcindekilerTablosu';
import KpssNotKutusu from '@/components/KpssNotKutusu';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import JsonLd from '@/components/JsonLd';
import IlgiliBaglantilar from '@/components/IlgiliBaglantilar';
import GorselHafizaKarti from '@/components/GorselHafizaKarti';
import SmartFAQ from '@/components/SmartFAQ';
import StatCards from '@/components/StatCards';

import { linkKeywords, getNextPrevKonu } from '@/lib/linkUtils';
import remarkGfm from 'remark-gfm';
// MDX içinde kullanılabilecek özel bileşenler
const mdxComponents = {
  KpssNot: KpssNotKutusu,
  SmartFAQ: () => null, // Artık MDX içindeki SmartFAQ'ları devre dışı bırakıyoruz, kendimiz render edeceğiz
  StatCards: StatCards,
  // ... (rest of mdxComponents is same)
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = String(props.children).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return <h2 id={id} {...props} className="text-2xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24 pb-2 border-b-2 border-blue-100" />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = String(props.children).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return <h3 id={id} {...props} className="text-xl font-semibold text-gray-800 mt-8 mb-4 scroll-mt-24 flex items-center gap-2" />;
  },
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="block my-10 group">
      <img 
        {...props} 
        alt={alt || ''}
        className="rounded-2xl border border-gray-200 shadow-xl w-full hover:shadow-2xl transition-shadow duration-300" 
        loading="lazy" 
      />
      {alt && (
        <span className="block text-center text-sm text-gray-400 mt-3 italic font-medium">
          📸 {alt}
        </span>
      )}
    </span>
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
    interface PropsWithChildren {
      children?: React.ReactNode;
    }
    const children = props.children;
    const textContent = Array.isArray(children) 
      ? children.map(c => {
          if (typeof c === 'string') return c;
          if (React.isValidElement(c) && (c.props as PropsWithChildren).children) return String((c.props as PropsWithChildren).children);
          return '';
        }).join('')
      : (typeof children === 'string' ? children : (React.isValidElement(children) && (children.props as PropsWithChildren).children ? String((children.props as PropsWithChildren).children) : ''));

    const match = String(textContent).match(/\[!(IMPORTANT|TIP|NOTE|WARNING|CAUTION|onemli|dikkat|ezber|soru|uyari)\]/i);
    
    if (match) {
      const type = match[1].toLowerCase();
      const typeMap: Record<string, string> = {
        important: 'onemli', note: 'onemli', tip: 'onemli',
        warning: 'uyari', caution: 'dikkat',
        onemli: 'onemli', dikkat: 'dikkat', ezber: 'ezber', soru: 'soru', uyari: 'uyari'
      };
      
      const kpssType = typeMap[type] || 'onemli';
      const renderChildren = Array.isArray(children) ? children : [children];
      const cleanedChildren = renderChildren.map((child, idx: number) => {
        if (typeof child === 'string') {
          return child.replace(/\[!.*?\]/, '').trim();
        }
        if (React.isValidElement(child) && (child.props as PropsWithChildren).children && typeof (child.props as PropsWithChildren).children === 'string') {
          const newText = String((child.props as PropsWithChildren).children).replace(/\[!.*?\]/, '').trim();
          return <span key={idx}>{newText}</span>;
        }
        return child;
      });

      return <KpssNotKutusu tip={kpssType as 'onemli'}>{cleanedChildren}</KpssNotKutusu>;
    }
    
    return <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic my-6 text-gray-700" />;
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-10 rounded-2xl border border-gray-200 shadow-premium bg-white">
      <table {...props} className="min-w-full border-collapse text-sm" />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} className="bg-gradient-to-r from-[#4B7BA7] to-[#3b6082] text-white" />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="px-6 py-4 font-bold text-left uppercase tracking-wider text-[11px]" />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props} className="border-b border-gray-50 last:border-0 hover:bg-academic-gri/50 transition-colors group" />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="px-6 py-4 text-gray-700 leading-relaxed first:border-l-4 first:border-[#4B7BA7] group-hover:bg-gray-50/80 transition-colors" />
  ),
};

async function getMdxContent(slug: string) {
  const filePath = path.join(process.cwd(), 'content', 'konu', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(raw);
  return { content, frontmatter: data };
}

// Başlıkları parse ederek ToC oluştur
function parseToc(content: string, faqs: FAQ[]): TocItem[] {
  const lines = content.split('\n');
  const items: TocItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1];
      if (text.includes('Sık Sorulan Sorular') || text.includes('SSS')) continue; // MDX içindeki SSS başlığını ToC'ye ekleme
      items.push({ id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), text, level: 2 });
    } else if (h3) {
      const text = h3[1];
      items.push({ id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), text, level: 3 });
    }
  }
  
  // Eğer FAQ varsa ToC sonuna ekle
  if (faqs && faqs.length > 0) {
    items.push({ id: 'faq', text: 'Sık Sorulan Sorular', level: 2 });
  }
  
  return items;
}

export async function generateStaticParams() {
  const konular = getAllKonular();
  return konular.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const konu = getKonu(params.slug);
  const mdx = await getMdxContent(params.slug);
  if (!konu) return {};
  const title = mdx?.frontmatter?.title || `${konu.baslik} — KPSS Coğrafya`;
  const description = mdx?.frontmatter?.description || konu.aciklama;
  const keywords = mdx?.frontmatter?.keywords?.length
    ? mdx.frontmatter.keywords
    : [
        `${konu.baslik.toLowerCase()} kpss`,
        `kpss ${konu.baslik.toLowerCase()}`,
        `${konu.kisa_baslik.toLowerCase()} konu anlatımı`,
        `türkiye ${konu.baslik.toLowerCase()}`,
        'kpss coğrafya',
      ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://kpsscografya.com.tr/konu/${konu.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://kpsscografya.com.tr/konu/${konu.slug}`,
      siteName: 'kpsscografya.com.tr',
      locale: 'tr_TR',
      type: 'article',
      images: [{ url: `/images/konu/${params.slug}.png`, width: 1200, height: 630, alt: `${konu.baslik} Konu Görseli` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/images/konu/${params.slug}.png`],
    },
    other: {
      'geo.region': 'TR',
      'geo.placename': 'Türkiye',
    },
  };
}

export default async function KonuPage({ params }: { params: { slug: string } }) {
  const konu = getKonu(params.slug);
  const mdx = await getMdxContent(params.slug);
  const faqs = getKonuFaq(params.slug);

  if (!konu) notFound();

  const tumKonular = getAllKonular();
  const { prev, next } = getNextPrevKonu(params.slug);
  const tocItems = mdx ? parseToc(mdx.content, faqs) : [];
  
  const linkedContent = mdx ? linkKeywords(mdx.content, params.slug) : '';
  const metaDesc = mdx?.frontmatter?.description || konu.aciklama;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd
        tip="LearningResource"
        veri={{
          name: `KPSS Coğrafya — ${konu.baslik}`,
          description: metaDesc,
          educationalLevel: "university",
          teaches: konu.baslik,
          inLanguage: "tr",
          isAccessibleForFree: true,
          provider: {
            "@type": "EducationalOrganization",
            name: "kpsscografya.com.tr",
            url: "https://kpsscografya.com.tr"
          }
        }}
      />
      <JsonLd
        tip="BreadcrumbList"
        veri={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://kpsscografya.com.tr" },
            { "@type": "ListItem", position: 2, name: "Konular", item: "https://kpsscografya.com.tr/konu" },
            { "@type": "ListItem", position: 3, name: konu.baslik, item: `https://kpsscografya.com.tr/konu/${konu.slug}` },
          ]
        }}
      />
      
      {faqs && faqs.length > 0 && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: faqs
              .filter((f: FAQ) => f.q && f.a)
              .map((f: FAQ) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.a
                }
              }))
          }}
        />
      )}

      {/* Konu Özet Kartı */}
      <KonuOzetKarti konu={konu} />

      {/* Görsel Hafıza Kartı */}
      <div className="mb-12 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-2">
        <div className="bg-gray-50 rounded-2xl p-6 md:p-10 border border-gray-100 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
              ✨ Görsel Hafıza Kartı
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">{konu.baslik} Konu Özeti</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Bu konuyla ilgili en kritik verileri, sınavda çıkma ihtimali yüksek noktaları ve görsel haritaları aşağıda detaylıca inceleyebilirsin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/harita/${konu.slug}`} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                🗺️ Haritada İncele
              </Link>
              <Link href={`/quiz/${konu.slug}`} className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors">
                📝 Hemen Test Çöz
              </Link>
            </div>
          </div>
          <GorselHafizaKarti konu={konu} />
        </div>
      </div>

      <div className="flex gap-10 relative" id="mdx-content">
        {/* Sol: İçindekiler Tablosu */}
        {tocItems.length > 0 && <IcindekilerTablosu items={tocItems} />}

        {/* Orta: MDX İçeriği */}
        <article className="flex-1 min-w-0 prose prose-gray max-w-none prose-headings:scroll-mt-24">
          {mdx ? (
            <MDXRemote 
              source={linkedContent} 
              components={mdxComponents as any}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          ) : (
            <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
              <p className="font-semibold">Bu konunun içeriği henüz hazırlanmıyor.</p>
              <p className="text-sm mt-1">Yakında eklenecek.</p>
            </div>
          )}

          {/* Sık Sorulan Sorular (Dinamik) */}
          {faqs && faqs.length > 0 && (
            <section className="mt-20 border-t-4 border-blue-50 pt-10" id="faq">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                  ❓
                </span>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-1">Sık Sorulan Sorular</h2>
                  <p className="text-gray-500 text-sm">Konu hakkında en çok merak edilen ve sınavda çıkabilecek sorular.</p>
                </div>
              </div>
              <SmartFAQ items={faqs} />
            </section>
          )}

          <IlgiliBaglantilar tip="konu" slug={konu.slug} />

          {/* Navigasyon */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-8">
            {prev && (
              <Link 
                href={`/konu/${prev.slug}`}
                className="flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Önceki Konu</span>
                <span className="text-gray-900 font-bold flex items-center gap-2 group-hover:text-blue-700 transition-colors">
                  ← {prev.baslik}
                </span>
              </Link>
            )}
            {next && (
              <Link 
                href={`/konu/${next.slug}`}
                className="flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group text-right"
              >
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Sıradaki Konu</span>
                <span className="text-gray-900 font-bold flex items-center gap-2 justify-end group-hover:text-blue-700 transition-colors">
                  {next.baslik} →
                </span>
              </Link>
            )}
          </div>

          {/* Bölgesel Analiz */}
          <section className="mt-16 bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-4">Bölgelere Göre {konu.baslik}</h3>
              <p className="text-blue-100 mb-10 max-w-2xl">
                {konu.baslik} konusunu Türkiye&apos;nin 7 coğrafi bölgesi bazında incele.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { ad: 'Marmara', url: 'marmarabolgesi' },
                  { ad: 'Ege', url: 'egebolgesi' },
                  { ad: 'Akdeniz', url: 'akdenizbolgesi' },
                  { ad: 'İç Anadolu', url: 'ic-anadolubolgesi' },
                  { ad: 'Karadeniz', url: 'karadenizbolgesi' },
                  { ad: 'Doğu Anadolu', url: 'dogu-anadolubolgesi' },
                  { ad: 'Güneydoğu Anadolu', url: 'guneydogu-anadolubolgesi' },
                ].map((b) => (
                  <Link
                    key={b.url}
                    href={`/${b.url}`}
                    className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group backdrop-blur-sm"
                  >
                    <span className="font-bold text-white">{b.ad} Analizi</span>
                    <span className="text-blue-300 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </article>

        {/* Sağ Kenar Çubuğu */}
        <aside className="hidden lg:flex flex-col gap-4 w-56 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-24">
            <p className="text-xs font-bold uppercase text-gray-400 mb-3">Haritada Gör</p>
            <Link
              href={`/harita/${konu.slug}`}
              className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              🗺️ İnteraktif Harita
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-56">
            <p className="text-xs font-bold uppercase text-gray-400 mb-3">İlgili Konular</p>
            <ul className="space-y-2">
              {tumKonular
                .filter((k) => k.slug !== konu.slug)
                .slice(0, 5)
                .map((k) => (
                  <li key={k.slug}>
                    <Link
                      href={`/konu/${k.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <span>{k.icon}</span> {k.kisa_baslik}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Alt Quiz CTA */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Bu konuyu ne kadar öğrendin?</h3>
        <p className="text-blue-200 mb-6">Çıkmış sorularla kendin test et, pekiştir!</p>
        <Link
          href={`/quiz/${konu.slug}`}
          className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors text-lg"
        >
          Quiz&apos;i Başlat →
        </Link>
      </div>
    </div>
  );
}
