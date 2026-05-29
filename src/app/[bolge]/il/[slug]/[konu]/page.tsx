export const dynamicParams = false;
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getIl, getIlKonuData, getAllIller } from "@/lib/getIlData";
import { getKonu, getAllKonular, getKonuFaq } from "@/lib/getKonuData";
import SuperDetayRender from "@/components/SuperDetayRender";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";

export async function generateStaticParams() {
  const iller = getAllIller();
  const konular = getAllKonular();

  const params = [];
  for (const il of iller) {
    for (const konu of konular) {
      if (konu.slug === "sozluk") continue;
      params.push({
        bolge: `${il.bolge_slug}bolgesi`,
        slug: il.slug,
        konu: konu.slug,
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
  if (!il || !konu || konu.slug === "sozluk") return {};

  const data = getIlKonuData(il.slug, konu.slug);
  const superDetay = data?.super_detay;

  const title = superDetay?.title || `${il.ad} ${konu.baslik} Akademik Analizi (2026 KPSS)`;
  const description =
    superDetay?.meta ||
    `${il.ad} ilinde ${konu.baslik.toLowerCase()} konusuna dair 2026 KPSS müfredatına uygun akademik detaylar, haritalar ve SSS bölümü.`;

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
      siteName: "kpsscografya.com.tr",
      locale: "tr_TR",
      type: "article",
      images: ["/og-default.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og-default.jpg"],
    },
    other: {
      "geo.region": `TR-${String(il.plaka).padStart(2, "0")}`,
      "geo.placename": `${il.ad}, Türkiye`,
      "geo.position": `${il.lat};${il.lng}`,
      ICBM: `${il.lat}, ${il.lng}`,
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
  if (!il || !konu || konu.slug === "sozluk") notFound();

  const data = getIlKonuData(il.slug, konu.slug);

  const iller = getAllIller();
  const matrisData = iller.reduce(
    (acc, curr) => {
      const d = getIlKonuData(curr.slug, konu.slug);
      if (d) acc[curr.slug] = d;
      return acc;
    },
    {} as Record<string, any>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matrisFaqs: { q: string; a: string }[] = ((data as any)?.faqs ?? []).filter(
    (f: { q?: string; a?: string }) => f.q && f.a
  );
  const superDetayFaqs: { q: string; a: string }[] = (data?.super_detay?.faqs ?? []).filter(
    (f) => f.q && f.a
  );
  const effectiveFaqs =
    matrisFaqs.length > 0
      ? matrisFaqs
      : superDetayFaqs.length > 0
        ? superDetayFaqs
        : getKonuFaq(konu.slug).filter((f) => f.q && f.a);

  if (!data?.super_detay) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-4 py-10">
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
                  name: il.bolge,
                  item: `https://kpsscografya.com.tr/${params.bolge}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: il.ad,
                  item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: konu.kisa_baslik,
                  item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}/${konu.slug}`,
                },
              ],
            }}
          />
          <JsonLd
            tip="DiscussionForumPosting"
            veri={{
              headline: `${il.ad} ${konu.baslik} Analizi`,
              articleBody: `${il.ad} ili için ${konu.baslik.toLowerCase()} konusundaki KPSS hazırlık içeriği`,
              author: {
                "@type": "Organization",
                name: "kpsscografya.com.tr",
                url: "https://kpsscografya.com.tr",
              },
              datePublished: "2026-05-15T08:00:00+03:00",
              dateModified: "2026-05-17T08:00:00+03:00",
            }}
          />
          {effectiveFaqs.length > 0 && (
            <JsonLd
              tip="FAQPage"
              veri={{
                mainEntity: effectiveFaqs
                  .filter((f) => f.q && f.a)
                  .map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
              }}
            />
          )}

          {/* Breadcrumb */}
          <nav className="mb-6 text-xs text-ink-400 flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-focus-600 transition-colors">
              Ana Sayfa
            </Link>
            <span className="text-ink-300">/</span>
            <Link href={`/${params.bolge}`} className="hover:text-focus-600 transition-colors">
              {il.bolge}
            </Link>
            <span className="text-ink-300">/</span>
            <Link
              href={`/${params.bolge}/il/${il.slug}`}
              className="hover:text-focus-600 transition-colors"
            >
              {il.ad}
            </Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-700 font-semibold">{konu.kisa_baslik}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-focus-50 text-focus-700 text-xs font-bold rounded-full mb-3 border border-focus-100">
              {konu.icon} {konu.kisa_baslik}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-ink-900 mb-3">
              {il.ad} {konu.baslik}
            </h1>
            <p className="text-ink-500 text-sm leading-relaxed">
              {il.ad} ili için {konu.baslik.toLowerCase()} konusundaki KPSS hazırlık içeriği
              hazırlanıyor.
            </p>
          </div>

          {/* FAQ */}
          {effectiveFaqs.length > 0 && (
            <section className="mb-10">
              <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-6">
                <h2 className="text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-focus-600 text-white rounded-lg flex items-center justify-center text-xs">
                    ?
                  </span>
                  Sık Sorulan Sorular
                </h2>
                <FaqAccordion faqs={effectiveFaqs} />
              </div>
            </section>
          )}

          {/* Links */}
          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/${params.bolge}/il/${il.slug}`}
              className="text-sm font-semibold text-focus-700 bg-focus-50 px-4 py-2 rounded-lg border border-focus-100 hover:bg-focus-100 transition-colors"
            >
              ← {il.ad}
            </Link>
            <Link
              href={`/konu/${konu.slug}`}
              className="text-sm font-semibold text-ink-600 bg-ink-50 px-4 py-2 rounded-lg border border-ink-100 hover:bg-ink-100 transition-colors"
            >
              {konu.baslik} Konu Anlatımı →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-ink-400 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-focus-600 transition-colors">
            Ana Sayfa
          </Link>
          <span className="text-ink-300">/</span>
          <Link href={`/${params.bolge}`} className="hover:text-focus-600 transition-colors">
            {il.bolge}
          </Link>
          <span className="text-ink-300">/</span>
          <Link
            href={`/${params.bolge}/il/${il.slug}`}
            className="hover:text-focus-600 transition-colors"
          >
            {il.ad}
          </Link>
          <span className="text-ink-300">/</span>
          <span className="text-ink-700 font-semibold">{konu.kisa_baslik}</span>
        </nav>

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
                name: il.bolge,
                item: `https://kpsscografya.com.tr/${params.bolge}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: il.ad,
                item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: konu.kisa_baslik,
                item: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}/${konu.slug}`,
              },
            ],
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

        {/* Diğer Konular */}
        <div className="mt-12 pt-8 border-t border-ink-100">
          <h3 className="text-lg font-bold text-ink-900 mb-4">{il.ad} — Diğer Konular</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getAllKonular()
              .filter((k) => k.slug !== konu.slug && k.slug !== "sozluk")
              .slice(0, 4)
              .map((k) => (
                <Link
                  key={k.slug}
                  href={`/${params.bolge}/il/${il.slug}/${k.slug}`}
                  className="p-3 rounded-xl border border-ink-100 hover:border-focus-200 hover:bg-focus-50 transition-all text-center bg-white"
                >
                  <span className="text-xl mb-1 block">{k.icon}</span>
                  <span className="text-xs font-semibold text-ink-700">{k.kisa_baslik}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
