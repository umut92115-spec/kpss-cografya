import Link from 'next/link';
import { getAllKonular } from '@/lib/getKonuData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İnteraktif KPSS Coğrafya Haritası | kpsscografya.com',
  description: 'Türkiye coğrafyasını harita üzerinde keşfet. Madenler, tarım, ulaşım, sanayi ve daha fazlası il bazlı görselleştirme ile.',
  alternates: {
    canonical: 'https://kpsscografya.com/harita',
  },
};

export default function HaritaPage() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-gray-900 py-12 md:py-20 text-white relative overflow-hidden">
      {/* Arka plan ışık efektleri */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-indigo-900 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs font-bold mb-6 border border-blue-500/30">
            🗺️ Görsel Öğrenme Deneyimi
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            İnteraktif <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Coğrafya Atlası</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Türkiye&apos;nin zenginliğini harita üzerinde keşfedin. Hangi ilde ne var? Hangi maden nerede çıkar? Her şey tek bir tık uzağınızda.
          </p>
        </div>

        {/* Konu Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {konular.map((k) => (
            <Link
              key={k.slug}
              href={`/harita/${k.slug}`}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{k.icon}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
              
              <h3 className="font-black text-xl mb-3 group-hover:text-blue-400 transition-colors">
                {k.baslik}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                {k.aciklama}
              </p>

              <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-hover:text-blue-300 transition-colors">
                Haritayı Keşfet
              </div>
            </Link>
          ))}
        </div>

        {/* Bilgi Kartı */}
        <div className="mt-16 p-8 bg-blue-600 rounded-3xl text-center shadow-2xl shadow-blue-900/50">
          <h2 className="text-2xl font-black mb-2">Hızlı Erişim: 81 İl</h2>
          <p className="text-blue-100 mb-6">Her ilin kendine has coğrafi verilerini görmek için iller sayfasına da göz atabilirsin.</p>
          <Link 
            href="/il"
            className="inline-block bg-white text-blue-600 font-black py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors"
          >
            📍 İller Atlasına Git
          </Link>
        </div>
      </div>
    </div>
  );
}
