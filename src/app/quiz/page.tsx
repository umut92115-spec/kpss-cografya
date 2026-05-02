import Link from 'next/link';
import { getAllKonular } from '@/lib/getKonuData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KPSS Coğrafya Quiz Modu — Kendini Test Et | kpsscografya.com',
  description: 'KPSS coğrafya konularına göre hazırlanmış interaktif testler. Süreli sınavlar, doğru-yanlış analizleri ve skor tablosu.',
  alternates: {
    canonical: 'https://kpsscografya.com/quiz',
  },
};

export default function QuizPage() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-kpss-turuncu/10 text-kpss-turuncu px-4 py-2 rounded-full text-xs font-bold mb-6">
            <span className="animate-pulse">✍️</span> 200+ Güncel Soru
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-kpss-koyu mb-6 leading-tight">
            Coğrafya <span className="text-kpss-turuncu">Sınav Modu</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Hangi konuda ne kadar iyisin? İstediğin konuyu seç, testi başlat ve performansını analiz et.
          </p>
        </div>

        {/* Konu Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {konular.map((k) => (
            <Link
              key={k.slug}
              href={`/quiz/${k.slug}`}
              className="group bg-white rounded-3xl border border-gray-100 p-8 hover:border-kpss-turuncu/30 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:bg-kpss-turuncu/5 group-hover:scale-110 transition-all duration-300">
                {k.icon}
              </div>
              
              <h3 className="font-black text-kpss-koyu text-xl mb-2 group-hover:text-kpss-turuncu transition-colors">
                {k.baslik}
              </h3>
              
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {k.kpss_soru_sayisi_ort} Soru Beklentisi
              </p>

              <div className="mt-auto w-full pt-6 border-t border-gray-50 text-kpss-turuncu font-bold text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Teste Başla <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bilgi Kutusu */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⏱️', title: 'Süreli Sınav', desc: 'Gerçek sınav atmosferi için her soruya özel süre.' },
            { icon: '📊', title: 'Detaylı Analiz', desc: 'Hangi konuda hata yaptığını anında gör.' },
            { icon: '🏆', title: 'Skor Tablosu', desc: 'En yüksek skorunu yap ve kendini geliştir.' },
          ].map((item) => (
            <div key={item.title} className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="font-bold text-kpss-koyu mb-2">{item.title}</h4>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
