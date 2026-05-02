import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllKonular, getKonu } from '@/lib/getKonuData';
import { getQuizData } from '@/lib/getQuizData';
import QuizModu from '@/components/QuizModu';
import JsonLd from '@/components/JsonLd';
import IlgiliBaglantilar from '@/components/IlgiliBaglantilar';

export async function generateStaticParams() {
  const konular = getAllKonular();
  return konular.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const konu = getKonu(params.slug);
  if (!konu) return {};
  return {
    title: `${konu.baslik} Quiz — KPSS Coğrafya Testi | kpsscografya.com`,
    description: `${konu.baslik} konusunu test et! Çıkmış KPSS sorularıyla hazırlanmış ${konu.kpss_soru_sayisi_ort * 10}+ soruluk interaktif quiz.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://kpsscografya.com/quiz/${konu.slug}`,
    },
    openGraph: {
      title: `${konu.baslik} Quiz — KPSS Coğrafya Testi`,
      url: `https://kpsscografya.com/quiz/${konu.slug}`,
      siteName: 'kpsscografya.com',
      locale: 'tr_TR',
      type: 'website',
    },
  };
}

export default function QuizPage({ params }: { params: { slug: string } }) {
  const konu = getKonu(params.slug);
  if (!konu) notFound();

  const quizData = getQuizData(params.slug);
  const tumKonular = getAllKonular();

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd
        tip="Quiz"
        veri={{
          name: `KPSS ${konu.baslik} Quiz'i`,
          about: {
            "@type": "Thing",
            name: konu.baslik
          },
          educationalAlignment: {
            "@type": "AlignmentObject",
            alignmentType: "educationalSubject",
            targetName: "KPSS Genel Kültür"
          },
          inLanguage: "tr"
        }}
      />
      {/* Üst Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/konu/${params.slug}`} className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            ← Konu Anlatımı
          </Link>
          <span className="text-sm font-semibold text-gray-700">{konu.icon} {konu.kisa_baslik} Quiz</span>
          <Link href={`/harita/${params.slug}`} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            🗺️ Harita
          </Link>
        </div>
      </div>

      {/* Quiz ya da "Yakında" mesajı */}
      {quizData ? (
        <QuizModu
          konuSlug={params.slug}
          konuMeta={konu}
          sorular={quizData.sorular}
        />
      ) : (
        <div className="max-w-xl mx-auto text-center py-20 px-4">
          <div className="text-6xl mb-4">🔜</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{konu.baslik}</h1>
          <p className="text-gray-500 mb-8">Bu konunun quiz bankası henüz hazırlanıyor. Yakında eklenecek!</p>

          <h3 className="font-semibold text-gray-700 mb-4">Şu an mevcut quiz&apos;ler:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {tumKonular
              .filter((k) => {
                // Gerçekte mevcut quiz'leri kontrol etmek için server-side check yapılabilir
                // Burada basit bir önizleme gösteriyoruz
                return k.slug === 'madenler-enerji';
              })
              .map((k) => (
                <Link
                  key={k.slug}
                  href={`/quiz/${k.slug}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {k.icon} {k.kisa_baslik}
                </Link>
              ))}
          </div>
        </div>
      )}
      <div className="max-w-xl mx-auto px-4 pb-12">
        <IlgiliBaglantilar tip="quiz" slug={konu.slug} />
      </div>
    </div>
  );
}
