import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllIller, getIl, getIlKonuData, getIlOzet } from "@/lib/getIlData";
import { getAllKonular, getKonuFaq } from "@/lib/getKonuData";
import IlTablar from "@/components/IlTablar";
import JsonLd from "@/components/JsonLd";
import IlgiliBaglantilar from "@/components/IlgiliBaglantilar";
import FaqAccordion from "@/components/FaqAccordion";
import { getIlJsonLd } from "@/lib/geoMeta";
import MiniIlHaritasi from "@/components/MiniIlHaritasi";

export async function generateStaticParams() {
  const iller = getAllIller();
  return iller.map((il) => ({
    bolge: `${il.bolge_slug}bolgesi`,
    slug: il.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { bolge: string; slug: string };
}): Promise<Metadata> {
  const il = getIl(params.slug);
  if (!il) return {};
  const ilOzet = getIlOzet(params.slug);
  const description = `${il.ad} ili KPSS coğrafya özeti: ${ilOzet?.[0] || `${il.ad} ilinin fiziki, beşeri ve ekonomik coğrafya özellikleri.`}`;
  return {
    title: `${il.ad} Coğrafyası — KPSS Hazırlık Ansiklopedisi`,
    description,
    keywords: [
      `${il.ad} coğrafyası`,
      `${il.ad} kpss`,
      `${il.ad} yer şekilleri`,
      `${il.ad} ekonomisi`,
      `${il.ad} nüfusu`,
      `kpss ${il.ad}`,
    ],
    alternates: { canonical: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}` },
    openGraph: {
      title: `${il.ad} Coğrafyası — KPSS Hazırlık Ansiklopedisi`,
      description,
      url: `https://kpsscografya.com.tr/${params.bolge}/il/${il.slug}`,
      siteName: "kpsscografya.com.tr",
      locale: "tr_TR",
      type: "article",
      images: [
        { url: "/og-default.jpg", width: 1200, height: 630, alt: `${il.ad} Coğrafya Haritası` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${il.ad} Coğrafyası — KPSS Hazırlık`,
      description,
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

export default function IlPage({ params }: { params: { bolge: string; slug: string } }) {
  const il = getIl(params.slug);
  if (!il) notFound();

  const tumKonular = getAllKonular();
  const ilOzet = getIlOzet(params.slug);
  const tumKonularFiltreli = tumKonular.filter((k) => k.slug !== "sozluk");
  const konuVerileri = Object.fromEntries(
    tumKonularFiltreli.map((konu) => [konu.slug, getIlKonuData(il.slug, konu.slug)])
  );

  const ilFaqs = tumKonularFiltreli
    .flatMap((k) => getKonuFaq(k.slug).slice(0, 2))
    .filter((f) => f?.q && f?.a)
    .slice(0, 10);

  const nufusFormatli = new Intl.NumberFormat("tr-TR").format(il.nufus_2023);
  const alanFormatli = new Intl.NumberFormat("tr-TR").format(il.yuzolcumu_km2);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd tip="AdministrativeArea" veri={getIlJsonLd(il)} />
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
          ],
        }}
      />
      {ilFaqs.length > 0 && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: ilFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
      <JsonLd
        tip="DiscussionForumPosting"
        veri={{
          headline: `${il.ad} Coğrafyası`,
          articleBody:
            ilOzet?.[0] || `${il.ad} ilinin fiziki, beşeri ve ekonomik coğrafya özellikleri.`,
          author: {
            "@type": "Organization",
            name: "kpsscografya.com.tr",
            url: "https://kpsscografya.com.tr",
          },
          datePublished: "2026-05-15T08:00:00+03:00",
          dateModified: "2026-05-17T08:00:00+03:00",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-ink-400 flex items-center gap-1.5">
          <Link href="/" className="hover:text-focus-600 transition-colors">
            Ana Sayfa
          </Link>
          <span className="text-ink-300">/</span>
          <Link href={`/${params.bolge}`} className="hover:text-focus-600 transition-colors">
            {il.bolge}
          </Link>
          <span className="text-ink-300">/</span>
          <span className="text-ink-700 font-semibold">{il.ad}</span>
        </nav>

        {/* Hero */}
        <div className="bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 shadow-card p-6 md:p-10 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sol: Bilgi */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-focus-50 text-focus-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-focus-100">
                  {il.bolge}
                </span>
                <span className="text-ink-300 text-xs">Plaka: {il.plaka}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-4 tracking-tight">
                {il.ad}
              </h1>

              <p className="text-ink-500 leading-relaxed mb-6">
                {il.ad}, Türkiye&apos;nin <strong className="text-ink-700">{il.bolge}</strong>{" "}
                Bölgesi&apos;nde yer alan, nüfusu{" "}
                <strong className="text-ink-700">{nufusFormatli}</strong> ve yüzölçümü{" "}
                <strong className="text-ink-700">{alanFormatli} km²</strong> olan şehrimizdir.
              </p>

              {/* Özet Maddeleri */}
              {ilOzet && ilOzet.length > 0 && (
                <div className="space-y-2.5">
                  {ilOzet.map((not, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-700/50 border border-ink-100 dark:border-ink-700"
                    >
                      <span className="w-5 h-5 shrink-0 rounded-md bg-focus-100 flex items-center justify-center text-[10px] font-bold text-focus-700 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-ink-600 leading-relaxed">{not}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ: Mini Harita */}
            <div className="w-full lg:w-[360px] shrink-0">
              <div className="bg-ink-50 rounded-xl border border-ink-100 overflow-hidden h-[320px] lg:h-full min-h-[320px]">
                <MiniIlHaritasi
                  secilenIlSlug={il.slug}
                  bolgeIlleri={getAllIller()
                    .filter((i) => i.bolge_slug === il.bolge_slug)
                    .map((i) => i.slug)}
                  ilAdi={il.ad}
                  bolgeAdi={il.bolge}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Konu Matrisi */}
        <section id="matris" className="mb-8">
          <div className="bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 shadow-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-5">
              Coğrafi Konu Matrisi
            </h2>
            <IlTablar
              params_slug={params.slug}
              bolge_slug={params.bolge}
              tumKonular={tumKonularFiltreli}
              konuVerileri={konuVerileri}
            />
          </div>
        </section>

        {/* Bölgesel Yakınlık */}
        <section id="bolgesel" className="mb-8">
          <div className="bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 shadow-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">
              Aynı Bölgedeki İller
            </h2>
            <div className="flex flex-wrap gap-2">
              {getAllIller()
                .filter((i) => i.bolge === il.bolge && i.slug !== il.slug)
                .map((komsu) => (
                  <Link
                    key={komsu.slug}
                    href={`/${params.bolge}/il/${komsu.slug}`}
                    className="text-sm bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300 hover:bg-focus-50 dark:hover:bg-focus-900/20 hover:text-focus-700 dark:hover:text-focus-400 px-4 py-2 rounded-lg transition-colors font-medium border border-ink-100 dark:border-ink-600 hover:border-focus-200 dark:hover:border-focus-700"
                  >
                    {komsu.ad}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* SSS */}
        {ilFaqs.length > 0 && (
          <section id="sss" className="mb-8">
            <div className="bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 shadow-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-5">
                Sık Sorulan Sorular
              </h2>
              <FaqAccordion faqs={ilFaqs} />
            </div>
          </section>
        )}

        <IlgiliBaglantilar tip="il" slug={il.slug} />
      </div>
    </div>
  );
}
