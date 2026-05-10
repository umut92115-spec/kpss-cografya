import { SuperDetay } from '@/types';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from './FaqAccordion';
import Link from 'next/link';

interface SuperDetayRenderProps {
  data: SuperDetay;
  ilAd: string;
  konuBaslik: string;
}

export default function SuperDetayRender({ data, ilAd, konuBaslik }: SuperDetayRenderProps) {
  return (
    <article className="space-y-8">
      {/* Schema Markup */}
      {data?.faqs && (
        <JsonLd
          tip="FAQPage"
          veri={{
            mainEntity: (data.faqs || [])
              .filter(faq => faq.q && faq.a)
              .map(faq => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a
                }
              }))
          }}
        />
      )}

      {/* Hero / Snippet Section */}
      <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{data.h1}</h1>
        <p className="text-gray-700 leading-relaxed text-lg italic">
          {data.snippet}
        </p>
      </section>

      {/* Dynamic Sections */}
      {data?.sections?.map((section, idx) => (
        <section key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">{section.h2}</h2>
          </div>
          <div className="p-6">
            <div className="text-gray-600 leading-relaxed mb-4">
              {section.content}
            </div>

            {section.type === 'table' && section.data && Array.isArray(section.data) && section.data.length > 0 && (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm text-left text-gray-500 border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 font-bold">
                    <tr>
                      {Array.isArray(section.data[0]) 
                        ? section.data[0].map((header, hIdx) => (
                            <th key={hIdx} className="px-4 py-3 border-b border-r last:border-r-0">{header}</th>
                          ))
                        : Object.keys(section.data[0] || {}).map(key => (
                            <th key={key} className="px-4 py-3 border-b border-r last:border-r-0">{key}</th>
                          ))
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(section.data[0]) ? section.data.slice(1) : section.data).map((row: any, i: number) => (
                      <tr key={i} className="bg-white border-b hover:bg-gray-50 transition-colors">
                        {Array.isArray(row)
                          ? row.map((val, j) => (
                              <td key={j} className="px-4 py-3 border-r last:border-r-0 font-medium text-gray-900">{val}</td>
                            ))
                          : Object.values(row || {}).map((val: any, j: number) => (
                              <td key={j} className="px-4 py-3 border-r last:border-r-0 font-medium text-gray-900">{val}</td>
                            ))
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.type === 'vurgu' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 font-medium">
                🎯 {section.content}
              </div>
            )}

            {section.type === 'map' && (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-3xl mb-2">🗺️</p>
                  <p className="text-sm font-semibold text-gray-500">İnteraktif {konuBaslik} Haritası</p>
                  <p className="text-xs text-gray-400">({ilAd} vurgulanmış)</p>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* FAQ Section */}
      {data?.faqs && data.faqs.length > 0 && (
        <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            <span className="text-blue-600">❓</span> Sıkça Sorulan Sorular (SSS)
          </h2>
          <FaqAccordion faqs={data.faqs} />
        </section>
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span>© kpsscografya.com.tr</span>
          <Link href="/konu/sozluk" className="hover:text-blue-500 underline underline-offset-2">Coğrafya Sözlüğü</Link>
        </div>
        <span>Son Güncelleme: {data.last_updated} | 2026 KPSS Müfredatı</span>
      </div>
    </article>
  );
}
