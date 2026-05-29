import React from "react";
import { getKonu, getAllKonular, getKonuFaq } from "@/lib/getKonuData";
import type { FAQ } from "@/types";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import KonuOzetKarti from "@/components/KonuOzetKarti";
import IcindekilerTablosu, { TocItem } from "@/components/IcindekilerTablosu";
import KpssNotKutusu from "@/components/KpssNotKutusu";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import JsonLd from "@/components/JsonLd";
import IlgiliBaglantilar from "@/components/IlgiliBaglantilar";
import GorselHafizaKarti from "@/components/GorselHafizaKarti";
import SmartFAQ from "@/components/SmartFAQ";
import StatCards from "@/components/StatCards";

import { linkKeywords, getNextPrevKonu } from "@/lib/linkUtils";
import remarkGfm from "remark-gfm";

const mdxComponents = {
  KpssNot: KpssNotKutusu,
  SmartFAQ: () => null,
  StatCards: StatCards,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = String(props.children)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return (
      <h2
        id={id}
        {...props}
        className="text-2xl font-bold text-ink-900 mt-12 mb-4 scroll-mt-24 pb-2 border-b border-ink-100"
      />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = String(props.children)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return (
      <h3
        id={id}
        {...props}
        className="text-xl font-semibold text-ink-800 mt-8 mb-4 scroll-mt-24"
      />
    );
  },
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="block my-8">
      <img
        {...props}
        alt={alt || ""}
        className="rounded-2xl border border-ink-100 shadow-card w-full"
        loading="lazy"
      />
      {alt && <span className="block text-center text-sm text-ink-400 mt-3 italic">{alt}</span>}
    </span>
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
    interface PropsWithChildren {
      children?: React.ReactNode;
    }
    const children = props.children;
    const textContent = Array.isArray(children)
      ? children
          .map((c) => {
            if (typeof c === "string") return c;
            if (React.isValidElement(c) && (c.props as PropsWithChildren).children)
              return String((c.props as PropsWithChildren).children);
            return "";
          })
          .join("")
      : typeof children === "string"
        ? children
        : React.isValidElement(children) && (children.props as PropsWithChildren).children
          ? String((children.props as PropsWithChildren).children)
          : "";

    const match = String(textContent).match(
      /\[!(IMPORTANT|TIP|NOTE|WARNING|CAUTION|onemli|dikkat|ezber|soru|uyari)\]/i
    );

    if (match) {
      const type = match[1].toLowerCase();
      const typeMap: Record<string, string> = {
        important: "onemli",
        note: "onemli",
        tip: "onemli",
        warning: "uyari",
        caution: "dikkat",
        onemli: "onemli",
        dikkat: "dikkat",
        ezber: "ezber",
        soru: "soru",
        uyari: "uyari",
      };

      const kpssType = typeMap[type] || "onemli";
      const renderChildren = Array.isArray(children) ? children : [children];
      const cleanedChildren = renderChildren.map((child, idx: number) => {
        if (typeof child === "string") {
          return child.replace(/\[!.*?\]/, "").trim();
        }
        if (
          React.isValidElement(child) &&
          (child.props as PropsWithChildren).children &&
          typeof (child.props as PropsWithChildren).children === "string"
        ) {
          const newText = String((child.props as PropsWithChildren).children)
            .replace(/\[!.*?\]/, "")
            .trim();
          return <span key={idx}>{newText}</span>;
        }
        return child;
      });

      return <KpssNotKutusu tip={kpssType as "onemli"}>{cleanedChildren}</KpssNotKutusu>;
    }

    return (
      <blockquote {...props} className="border-l-4 border-ink-200 pl-4 italic my-6 text-ink-600" />
    );
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8 rounded-xl border border-ink-100 bg-white">
      <table {...props} className="min-w-full border-collapse text-sm" />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} className="bg-focus-600 text-white" />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="px-5 py-3 font-bold text-left uppercase tracking-wider text-[11px]" />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      {...props}
      className="border-b border-ink-50 last:border-0 hover:bg-ink-50 transition-colors"
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="px-5 py-3.5 text-ink-700 leading-relaxed" />
  ),
};

async function getMdxContent(slug: string) {
  const filePath = path.join(process.cwd(), "content", "konu", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  return { content, frontmatter: data };
}

function parseToc(content: string, faqs: FAQ[]): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1];
      if (text.includes("Sık Sorulan Sorular") || text.includes("SSS")) continue;
      items.push({
        id: text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        text,
        level: 2,
      });
    } else if (h3) {
      const text = h3[1];
      items.push({
        id: text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        text,
        level: 3,
      });
    }
  }

  if (faqs && faqs.length > 0) {
    items.push({ id: "faq", text: "Sık Sorulan Sorular", level: 2 });
  }

  return items;
}

export async function generateStaticParams() {
  const konular = getAllKonular();
  return konular.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const konu = getKonu(params.slug);
  const mdx = await getMdxContent(params.slug);
  if (!konu) return {};
  const title = mdx?.frontmatter?.title || `${konu.baslik}`;
  const description = mdx?.frontmatter?.description || konu.aciklama;
  const keywords = mdx?.frontmatter?.keywords?.length
    ? mdx.frontmatter.keywords
    : [
        `${konu.baslik.toLowerCase()} kpss`,
        `kpss ${konu.baslik.toLowerCase()}`,
        `${konu.kisa_baslik.toLowerCase()} konu anlatımı`,
        `türkiye ${konu.baslik.toLowerCase()}`,
        "kpss coğrafya",
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
      siteName: "kpsscografya.com.tr",
      locale: "tr_TR",
      type: "article",
      images: [
        {
          url: `/images/konu/${params.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${konu.baslik} Konu Görseli`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/images/konu/${params.slug}.png`],
    },
    other: {
      "geo.region": "TR",
      "geo.placename": "Türkiye",
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

  const linkedContent = mdx ? linkKeywords(mdx.content, params.slug) : "";
  const metaDesc = mdx?.frontmatter?.description || konu.aciklama;

  return (
    <div className="min-h-screen bg-[var(--background)]">
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
            url: "https://kpsscografya.com.tr",
          },
        }}
      />
      <JsonLd
        tip="BreadcrumbList"
        veri={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Ana Sayfa",
              item: "https://kpsscografya.com.tr",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Konular",
              item: "https://kpsscografya.com.tr/konu",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: konu.baslik,
              item: `https://kpsscografya.com.tr/konu/${konu.slug}`,
            },
          ],
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
                  text: f.a,
                },
              })),
          }}
        />
      )}

      <JsonLd
        tip="DiscussionForumPosting"
        veri={{
          headline: `KPSS Coğrafya — ${konu.baslik}`,
          articleBody: metaDesc,
          author: {
            "@type": "Organization",
            name: "kpsscografya.com.tr",
            url: "https://kpsscografya.com.tr",
          },
          datePublished: "2026-05-15T08:00:00+03:00",
          dateModified: "2026-05-17T08:00:00+03:00",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Özet Kartı */}
        <KonuOzetKarti konu={konu} />

        {/* Görsel Hafıza + Aksiyonlar */}
        <div className="mb-10 bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-focus-50 text-focus-700 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-focus-100">
                Görsel Hafıza Kartı
              </span>
              <h2 className="text-2xl font-bold text-ink-900 mb-3">{konu.baslik} Özeti</h2>
              <p className="text-ink-500 text-sm leading-relaxed mb-5">
                Bu konuyla ilgili en kritik verileri ve sınavda çıkma ihtimali yüksek noktaları
                incele.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/harita/${konu.slug}`}
                  className="bg-focus-600 text-white font-semibold py-2.5 px-5 rounded-xl text-sm hover:bg-focus-700 transition-colors shadow-sm"
                >
                  Haritada İncele
                </Link>
                <Link
                  href={`/quiz/${konu.slug}`}
                  className="bg-ink-800 text-white font-semibold py-2.5 px-5 rounded-xl text-sm hover:bg-ink-900 transition-colors"
                >
                  Test Çöz
                </Link>
              </div>
            </div>
            <GorselHafizaKarti konu={konu} />
          </div>
        </div>

        {/* İçerik Grid */}
        <div className="flex gap-8 relative" id="mdx-content">
          {/* Sol: İçindekiler */}
          {tocItems.length > 0 && <IcindekilerTablosu items={tocItems} />}

          {/* Orta: MDX */}
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
              <div className="p-6 bg-glow-50 border border-glow-200 rounded-xl text-glow-800">
                <p className="font-semibold">Bu konunun içeriği henüz hazırlanıyor.</p>
                <p className="text-sm mt-1">Yakında eklenecek.</p>
              </div>
            )}

            {/* FAQ */}
            {faqs && faqs.length > 0 && (
              <section className="mt-16 pt-8 border-t border-ink-100" id="faq">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-focus-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">?</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink-900">Sık Sorulan Sorular</h2>
                    <p className="text-ink-400 text-sm">Sınavda çıkabilecek konular</p>
                  </div>
                </div>
                <SmartFAQ items={faqs} />
              </section>
            )}

            <IlgiliBaglantilar tip="konu" slug={konu.slug} />

            {/* Navigasyon */}
            <div className="mt-12 flex flex-col sm:flex-row gap-3 border-t border-ink-100 pt-8">
              {prev && (
                <Link
                  href={`/konu/${prev.slug}`}
                  className="flex-1 p-4 bg-ink-50 rounded-xl border border-ink-100 hover:border-focus-200 hover:bg-focus-50 transition-all group"
                >
                  <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block mb-1">
                    Önceki
                  </span>
                  <span className="text-ink-900 font-bold text-sm group-hover:text-focus-700 transition-colors">
                    ← {prev.baslik}
                  </span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/konu/${next.slug}`}
                  className="flex-1 p-4 bg-ink-50 rounded-xl border border-ink-100 hover:border-focus-200 hover:bg-focus-50 transition-all group text-right"
                >
                  <span className="text-[10px] text-ink-400 font-bold uppercase tracking-wider block mb-1">
                    Sonraki
                  </span>
                  <span className="text-ink-900 font-bold text-sm group-hover:text-focus-700 transition-colors">
                    {next.baslik} →
                  </span>
                </Link>
              )}
            </div>

            {/* Bölgesel Analiz */}
            <section className="mt-14 bg-ink-900 rounded-2xl p-8 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-focus-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Bölgelere Göre {konu.baslik}</h3>
                <p className="text-ink-300 text-sm mb-6">7 coğrafi bölge bazında incele.</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { ad: "Marmara", url: "marmarabolgesi" },
                    { ad: "Ege", url: "egebolgesi" },
                    { ad: "Akdeniz", url: "akdenizbolgesi" },
                    { ad: "İç Anadolu", url: "ic-anadolubolgesi" },
                    { ad: "Karadeniz", url: "karadenizbolgesi" },
                    { ad: "Doğu Anadolu", url: "dogu-anadolubolgesi" },
                    { ad: "G.Doğu Anadolu", url: "guneydogu-anadolubolgesi" },
                  ].map((b) => (
                    <Link
                      key={b.url}
                      href={`/${b.url}`}
                      className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-medium"
                    >
                      <span>{b.ad}</span>
                      <span className="text-ink-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </article>

          {/* Sağ Kenar */}
          <aside className="hidden lg:flex flex-col gap-4 w-52 shrink-0">
            <div className="bg-white border border-ink-100 rounded-xl p-4 shadow-card sticky top-24">
              <p className="text-[10px] font-bold uppercase text-ink-400 mb-3 tracking-wider">
                Araçlar
              </p>
              <Link
                href={`/harita/${konu.slug}`}
                className="flex items-center gap-2 w-full bg-focus-600 hover:bg-focus-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm mb-2"
              >
                Harita
              </Link>
              <Link
                href={`/quiz/${konu.slug}`}
                className="flex items-center gap-2 w-full bg-ink-100 hover:bg-ink-200 text-ink-700 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Quiz
              </Link>
            </div>
            <div className="bg-white border border-ink-100 rounded-xl p-4 shadow-card sticky top-52">
              <p className="text-[10px] font-bold uppercase text-ink-400 mb-3 tracking-wider">
                Diğer Konular
              </p>
              <ul className="space-y-1.5">
                {tumKonular
                  .filter((k) => k.slug !== konu.slug)
                  .slice(0, 5)
                  .map((k) => (
                    <li key={k.slug}>
                      <Link
                        href={`/konu/${k.slug}`}
                        className="flex items-center gap-2 text-sm text-ink-500 hover:text-focus-600 transition-colors py-1"
                      >
                        <span className="text-base">{k.icon}</span>
                        <span className="truncate">{k.kisa_baslik}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Alt Quiz CTA */}
        <div className="mt-14 p-6 bg-focus-600 rounded-2xl text-white text-center">
          <h3 className="text-xl font-bold mb-2">Bu konuyu ne kadar öğrendin?</h3>
          <p className="text-focus-200 text-sm mb-5">Çıkmış sorularla kendin test et, pekiştir!</p>
          <Link
            href={`/quiz/${konu.slug}`}
            className="inline-block bg-white text-focus-700 font-bold py-2.5 px-6 rounded-xl hover:bg-focus-50 transition-colors text-sm"
          >
            Quiz Başlat →
          </Link>
        </div>
      </div>
    </div>
  );
}
