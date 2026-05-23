import { SuperDetay, IlKonuData } from "@/types";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "./FaqAccordion";
import Link from "next/link";
import { getAllIller, getIl } from "@/lib/getIlData";
import MiniIlHaritasi from "@/components/MiniIlHaritasi";

interface SuperDetayRenderProps {
  data: SuperDetay;
  ilAd: string;
  konuBaslik: string;
  konuSlug?: string;
  ilSlug?: string;
  matrisData?: Record<string, IlKonuData> | null;
  temaRenk?: string;
}

export default function SuperDetayRender({
  data,
  ilAd,
  konuBaslik,
  konuSlug,
  ilSlug,
}: SuperDetayRenderProps) {
  return (
    <article className="space-y-8">
      {/* Schema Markup */}
      <JsonLd
        tip="DiscussionForumPosting"
        veri={{
          headline: `${ilAd} ${konuBaslik} Analizi`,
          articleBody: data.snippet,
          author: {
            "@type": "Organization",
            name: "kpsscografya.com.tr",
            url: "https://kpsscografya.com.tr",
          },
          datePublished: "2026-05-15T08:00:00+03:00",
          dateModified: "2026-05-17T08:00:00+03:00",
        }}
      />
      {data?.faqs && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: (data.faqs || [])
              .filter((faq) => faq.q && faq.a)
              .map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
          }}
        />
      )}

      {/* Hero / Snippet Section */}
      <section className="bg-blue-50 dark:bg-blue-950/25 border-l-4 border-blue-500 p-6 rounded-r-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-ink-900 dark:text-white mb-4">
          {data.h1}
        </h1>
        <p className="text-ink-700 dark:text-ink-300 leading-relaxed text-lg italic">
          {data.snippet}
        </p>
      </section>

      {/* Dynamic Sections */}
      {data?.sections?.map((section, idx) => (
        <section
          key={idx}
          className="bg-white dark:bg-ink-800 rounded-2xl border border-ink-150 dark:border-ink-700 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-ink-100 dark:border-ink-700/60 bg-ink-50/50 dark:bg-ink-900/50">
            <h2 className="text-xl font-bold text-ink-800 dark:text-white">{section.h2}</h2>
          </div>
          <div className="p-6">
            <div className="text-ink-650 dark:text-ink-350 leading-relaxed mb-4">
              {section.content}
            </div>

            {section.type === "table" &&
              section.data &&
              Array.isArray(section.data) &&
              section.data.length > 0 && (
                <div className="overflow-x-auto my-4">
                  <table className="w-full text-sm text-left text-ink-550 dark:text-ink-400 border border-ink-200 dark:border-ink-700 rounded-lg overflow-hidden">
                    <thead className="text-xs text-ink-700 dark:text-ink-200 uppercase bg-ink-100 dark:bg-ink-900 font-bold border-b border-ink-200 dark:border-ink-700">
                      <tr>
                        {Array.isArray(section.data[0])
                          ? section.data[0].map((header, hIdx) => (
                              <th
                                key={hIdx}
                                className="px-4 py-3 border-b border-r border-ink-200 dark:border-ink-700 last:border-r-0"
                              >
                                {header}
                              </th>
                            ))
                          : Object.keys(section.data[0] || {}).map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 border-b border-r border-ink-200 dark:border-ink-700 last:border-r-0"
                              >
                                {key}
                              </th>
                            ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(section.data[0]) ? section.data.slice(1) : section.data).map(
                        (row: any, i: number) => (
                          <tr
                            key={i}
                            className="bg-white dark:bg-ink-800 border-b border-ink-200 dark:border-ink-700 last:border-b-0 hover:bg-ink-50 dark:hover:bg-ink-900/40 transition-colors"
                          >
                            {Array.isArray(row)
                              ? row.map((val, j) => (
                                  <td
                                    key={j}
                                    className="px-4 py-3 border-r border-ink-200 dark:border-ink-700 last:border-r-0 font-medium text-ink-900 dark:text-ink-100"
                                  >
                                    {val}
                                  </td>
                                ))
                              : Object.values(row || {}).map((val: any, j: number) => (
                                  <td
                                    key={j}
                                    className="px-4 py-3 border-r border-ink-200 dark:border-ink-700 last:border-r-0 font-medium text-ink-900 dark:text-ink-100"
                                  >
                                    {val}
                                  </td>
                                ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            {section.type === "vurgu" && section.data && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 rounded-xl p-4 text-amber-900 dark:text-amber-200 font-medium">
                🎯 {typeof section.data === "string" ? section.data : String(section.data)}
              </div>
            )}

            {section.type === "map" && ilSlug && (
              <div className="w-full h-[400px] md:h-[500px] relative mt-6 rounded-2xl overflow-hidden shadow-sm border border-ink-150 dark:border-ink-700 bg-white dark:bg-ink-800">
                {(() => {
                  const il = getIl(ilSlug);
                  const bolgeIlleri = il
                    ? getAllIller()
                        .filter((i) => i.bolge_slug === il.bolge_slug)
                        .map((i) => i.slug)
                    : [];
                  return il ? (
                    <MiniIlHaritasi
                      secilenIlSlug={ilSlug}
                      bolgeIlleri={bolgeIlleri}
                      ilAdi={il.ad}
                      bolgeAdi={il.bolge}
                    />
                  ) : null;
                })()}
              </div>
            )}
            {section.type === "map" && (!konuSlug || !ilSlug) && (
              <div className="aspect-video bg-ink-50 dark:bg-ink-900 rounded-xl flex items-center justify-center border-2 border-dashed border-ink-200 dark:border-ink-700 mt-6">
                <div className="text-center">
                  <p className="text-3xl mb-2">🗺️</p>
                  <p className="text-sm font-semibold text-ink-500 dark:text-ink-400">
                    İnteraktif {konuBaslik} Haritası
                  </p>
                  <p className="text-xs text-ink-400 dark:text-ink-500">({ilAd} vurgulanmış)</p>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* FAQ Section */}
      {data?.faqs && data.faqs.length > 0 && (
        <section className="bg-ink-50 dark:bg-ink-900 rounded-2xl p-6 md:p-8 border border-ink-150 dark:border-ink-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-ink-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">❓</span> Sıkça Sorulan Sorular (SSS)
          </h2>
          <FaqAccordion faqs={data.faqs} />
        </section>
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ink-450 dark:text-ink-500 pt-6 border-t border-ink-150 dark:border-ink-800">
        <div className="flex items-center gap-4">
          <span>© kpsscografya.com.tr</span>
          <Link
            href="/konu/sozluk"
            className="hover:text-blue-500 dark:hover:text-blue-400 underline underline-offset-2"
          >
            Coğrafya Sözlüğü
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span>Yayın Tarihi: 15 Mayıs 2026</span>
          <span>Son Güncelleme: {data.last_updated} | 2026 KPSS Müfredatı</span>
        </div>
      </div>
    </article>
  );
}
