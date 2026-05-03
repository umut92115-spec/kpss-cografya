import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeviye, seviyeler } from '@/lib/hazirlikConfig';
import { getAllKonular } from '@/lib/getKonuData';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return seviyeler.map((s) => ({ seviye: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { seviye: string };
}): Promise<Metadata> {
  const s = getSeviye(params.seviye);
  if (!s) return {};

  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: {
      canonical: `https://kpsscografya.com.tr/hazirlik/${s.slug}`,
    },
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      url: `https://kpsscografya.com.tr/hazirlik/${s.slug}`,
      siteName: 'kpsscografya.com.tr',
      locale: 'tr_TR',
      type: 'article',
      images: ['/og-default.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: s.seoTitle,
      images: ['/og-default.jpg'],
    },
    other: {
      'geo.region': 'TR',
      language: 'Turkish',
    },
  };
}

// Soru dağılım tablosu verisi
const konuDagilim = [
  { konu: 'Fiziki Coğrafya (Dağlar, Ovalar, Akarsular)', soru: '5-6', oncelik: 'Kritik' },
  { konu: 'Nüfus ve Yerleşme', soru: '3-4', oncelik: 'Kritik' },
  { konu: 'Madenler ve Enerji Kaynakları', soru: '2-3', oncelik: 'Önemli' },
  { konu: 'İklim ve Bitki Örtüsü', soru: '2-3', oncelik: 'Önemli' },
  { konu: 'Tarım ve Hayvancılık', soru: '1-2', oncelik: 'Normal' },
  { konu: 'Sanayi, Ulaşım, Turizm', soru: '2-3', oncelik: 'Normal' },
];

const oncelikRenk: Record<string, string> = {
  Kritik: 'bg-red-100 text-red-700',
  Önemli: 'bg-amber-100 text-amber-700',
  Normal: 'bg-green-100 text-green-700',
};

export default function SeviyePage({ params }: { params: { seviye: string } }) {
  const s = getSeviye(params.seviye);
  if (!s) notFound();

  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD: FAQPage */}
      <JsonLd
        tip="FAQPage"
        veri={{
          mainEntity: s.faqlar.map((f) => ({
            '@type': 'Question',
            name: f.soru,
            acceptedAnswer: { '@type': 'Answer', text: f.cevap },
          })),
        }}
      />

      {/* JSON-LD: LearningResource */}
      <JsonLd
        tip="LearningResource"
        veri={{
          name: s.seoTitle,
          description: s.seoDescription,
          url: `https://kpsscografya.com.tr/hazirlik/${s.slug}`,
          educationalLevel: s.baslik,
          teaches: 'KPSS Coğrafya',
          inLanguage: 'tr',
          provider: {
            '@type': 'Organization',
            name: 'KPSS Coğrafya',
            url: 'https://kpsscografya.com.tr',
          },
        }}
      />

      {/* HERO */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-8 text-gray-400">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">›</span>
            <Link href="/hazirlik" className="hover:text-white">Hazırlık</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{s.baslik}</span>
          </nav>

          <div className="text-5xl mb-6">{s.favicon}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {s.h1}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            {s.h2}
          </p>

          {/* Hızlı bilgi badge'leri */}
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              📝 {s.bankaSoruSayisi}+ Özgün Soru
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              ⏱️ {s.sinav_suresi}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              📅 {s.sinav_periyot}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              👤 {s.hedef_kitle}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">


        {/* SORU DAĞILIM TABLOSU */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            {s.baslik} Coğrafya Soru Dağılımı
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-bold text-gray-700">Konu</th>
                  <th className="text-center p-4 font-bold text-gray-700">Soru Sayısı</th>
                  <th className="text-center p-4 font-bold text-gray-700">Öncelik</th>
                </tr>
              </thead>
              <tbody>
                {konuDagilim.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{row.konu}</td>
                    <td className="p-4 text-center font-bold text-gray-900">{row.soru}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${oncelikRenk[row.oncelik]}`}>
                        {row.oncelik}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="p-4 font-black text-gray-900">TOPLAM</td>
                  <td className="p-4 text-center font-black text-gray-900">{s.soruSayisi} soru</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* KONU KARTI IZGARASI */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Konuları Harita ile Öğren
          </h2>
          <p className="text-gray-600 mb-8">
            Her konu için harita destekli anlatım ve quiz.
            Tıkla, öğren, test et.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {konular.map((konu) => (
              <div key={konu.slug} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-400 transition-all">
                <div className="text-3xl mb-3">{konu.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{konu.baslik}</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Ortalama {konu.kpss_soru_sayisi_ort} soru
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/konu/${konu.slug}`}
                    className="flex-1 text-center bg-gray-50 text-gray-700 hover:bg-gray-100 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Konu Anlatımı
                  </Link>
                  <Link
                    href={`/harita/${konu.slug}`}
                    className="flex-1 text-center bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Harita
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HAZIRLIK STRATEJİSİ */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            {s.baslik} Coğrafya — 30 Günlük Hazırlık Planı
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-black text-gray-900 mb-2">1-10. Gün</h3>
              <p className="text-sm text-gray-600">
                Fiziki coğrafya + iklim. Her gün harita üzerinde tekrar.
                Dağ, ova, akarsu konumlarını ezberle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-black text-gray-900 mb-2">11-20. Gün</h3>
              <p className="text-sm text-gray-600">
                Nüfus, madenler, tarım. Her konudan 20 quiz sorusu çöz.
                Hatalı soruları tekrar et.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-black text-gray-900 mb-2">21-30. Gün</h3>
              <p className="text-sm text-gray-600">
                Sanayi, ulaşım, turizm + tam deneme. Zayıf konulara odaklan,
                harita üzerinde son tekrar.
              </p>
            </div>
          </div>
        </section>

        {/* QUIZ CTA */}
        <section className="mb-16">
          <div className="bg-orange-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-black mb-3">
              {s.baslik} Sınavına Hazır mısın?
            </h2>
            <p className="text-orange-100 mb-6">
              {s.bankaSoruSayisi}+ soruluk dev soru bankası ile hazırlık düzeyini ölç.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="bg-white text-orange-600 font-black px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Quiz Başlat →
              </Link>
              <Link
                href="/harita/yer-sekilleri"
                className="bg-orange-600 text-white font-black px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors border border-orange-400"
              >
                Haritada Çalış →
              </Link>
            </div>
          </div>
        </section>

        {/* REHBER MAKALE */}
        <section className="mb-16">
          <div className="prose prose-lg max-w-none bg-blue-50/50 p-8 md:p-12 rounded-3xl border border-blue-100">
            <h2 className="text-3xl font-black text-gray-900 mb-8 border-b border-blue-200 pb-4">
              {s.baslik} Coğrafya Başarı Rehberi
            </h2>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed space-y-6">
              {s.makale}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {s.faqlar.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-black text-gray-900 mb-3">{faq.soru}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.cevap}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DİĞER SEVİYELER */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Diğer KPSS Seviyeleri
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {seviyeler
              .filter((sv) => sv.slug !== s.slug)
              .map((sv) => (
                <Link
                  key={sv.slug}
                  href={`/hazirlik/${sv.slug}`}
                  className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-sm transition-all"
                >
                  <span className="text-3xl">{sv.favicon}</span>
                  <div>
                    <div className="font-black text-gray-900">{sv.baslik}</div>
                    <div className="text-sm text-gray-500">{sv.aciklama}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

      </div>
    </div>
  );
}
