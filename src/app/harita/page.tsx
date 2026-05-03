import Link from 'next/link';
import { getAllKonular } from '@/lib/getKonuData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KPSS İnteraktif Harita Atlası 2026 — Maden, Tarım, Sanayi Görselleştirme',
  description: 'Türkiye\'nin en kapsamlı KPSS İnteraktif Harita platformu. Madenler, tarım ürünleri ve sanayi tesislerini harita üzerinde görselleştirin, sınavda fark atın.',
  keywords: ['kpss interaktif harita', 'kpss harita çalışması', 'türkiye maden haritası interaktif', 'kpss coğrafya harita görselleştirme'],
  alternates: {
    canonical: 'https://kpsscografya.com.tr/harita',
  },
  openGraph: {
    title: 'KPSS İnteraktif Harita Atlası — Görsel Öğrenme Merkezi',
    description: 'Türkiye coğrafyasını interaktif haritalarla keşfedin. KPSS\'de en çok çıkan konuları görsel hafızanıza kazıyın.',
    url: 'https://kpsscografya.com.tr/harita',
    siteName: 'kpsscografya.com.tr',
    locale: 'tr_TR',
    type: 'website',
    images: ['/og-default.jpg'],
  },
};

export default function HaritaPage() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-[#050811] py-12 md:py-20 text-white relative overflow-hidden">
      {/* Arka plan ışık efektleri */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-blue-600 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-900 rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-xs font-bold mb-6 border border-blue-500/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            İnteraktif Görsel Hafıza Teknikleri
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            KPSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">İnteraktif Harita</span> Atlası
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Sınavda sorulan yerleri "görmeden" öğrenme! Türkiye&apos;nin madenlerini, tarım alanlarını ve sanayi tesislerini tek tıkla haritaya dök, görsel hafızanı güçlendir.
          </p>
        </div>

        {/* Avantajlar / Neden Harita? */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { t: "Görsel Hafıza", d: "Karmaşık listeler yerine yerleri harita üzerinde görerek öğrenin.", i: "🧠" },
            { t: "İl Bazlı Analiz", d: "Hangi ilde hangi ürünün 1. olduğunu anında keşfedin.", i: "📍" },
            { t: "Sınav Uyumu", d: "ÖSYM'nin harita sorularını kaçırmamanız için tasarlandı.", i: "🎯" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex items-start gap-4 hover:border-blue-500/30 transition-colors">
              <span className="text-2xl">{item.i}</span>
              <div>
                <h4 className="font-bold text-blue-300 mb-1">{item.t}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Konu Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {konular.map((k) => (
            <div
              key={k.slug}
              className="group bg-[#0d1221] hover:bg-[#131a31] rounded-[2.5rem] border border-white/5 p-2 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] hover:border-blue-500/30"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                    {k.icon}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    2026 Güncel
                  </div>
                </div>
                
                <h3 className="font-black text-2xl mb-4 group-hover:text-blue-400 transition-colors">
                  {k.baslik}
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 group-hover:text-gray-400 transition-colors">
                  {k.aciklama}
                </p>

                <div className="flex gap-3">
                  <Link
                    href={`/harita/${k.slug}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-4 rounded-2xl transition-all text-sm text-center shadow-lg shadow-blue-900/20 active:scale-95"
                  >
                    Haritayı Aç →
                  </Link>
                  <Link
                    href={`/quiz/${k.slug}`}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-2xl transition-all text-sm border border-white/10 active:scale-95"
                    title="Bu Konuda Test Çöz"
                  >
                    📝
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-24 p-10 md:p-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Detaylı İl Analizlerini Gördün mü?</h2>
            <p className="text-blue-100 text-lg mb-10 opacity-90 leading-relaxed">
              81 ilin kendine has coğrafi verilerini, madenlerini ve tarım potansiyelini "İl Kimlik Kartları" ile tek tek inceleyebilirsin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/il"
                className="bg-white text-blue-700 font-black py-4 px-10 rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1"
              >
                📍 81 İl Atlasını Keşfet
              </Link>
              <Link 
                href="/konu"
                className="bg-blue-900/30 backdrop-blur-md text-white border border-white/20 font-black py-4 px-10 rounded-2xl hover:bg-white/10 transition-all"
              >
                📖 Konu Özetleri
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

