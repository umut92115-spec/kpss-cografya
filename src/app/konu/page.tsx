import Link from 'next/link';
import { getAllKonular } from '@/lib/getKonuData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KPSS Coğrafya Konuları — Süper Detay Anlatım | kpsscografya.com',
  description: 'KPSS coğrafya tüm konuları: Yer şekilleri, iklim, nüfus, tarım, madenler, ticaret ve daha fazlası. Görsel ve detaylı konu anlatımları.',
};

export default function KonularPage() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Başlık Bölümü */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-kpss-koyu mb-6 leading-tight">
            Tüm KPSS Coğrafya <span className="text-harita-mavi">Konuları</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Sınavda çıkan tüm başlıklar, "Süper Detay" formatında, güncel veriler ve sınav odaklı özetlerle hazırlandı.
          </p>
        </div>

        {/* Konu Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {konular.map((k) => (
            <div
              key={k.slug}
              className="group relative bg-white rounded-3xl border border-gray-100 p-8 hover:border-harita-mavi/30 hover:shadow-2xl hover:shadow-harita-mavi/10 transition-all duration-300 flex flex-col transform hover:-translate-y-2"
            >
              {/* Dekoratif Arka Plan Ikonu */}
              <div className="absolute top-4 right-4 text-6xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity select-none pointer-events-none">
                {k.icon}
              </div>

              {/* Üst Satır */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl group-hover:bg-harita-mavi/5 transition-colors">
                  {k.icon}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border ${
                    k.agirlik === 'yüksek'
                      ? 'bg-red-50 text-red-600 border-red-100'
                      : k.agirlik === 'orta'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      : 'bg-green-50 text-green-700 border-green-100'
                  }`}
                >
                  {k.agirlik} ÖNEM
                </span>
              </div>

              {/* İçerik */}
              <h3 className="font-black text-kpss-koyu text-2xl leading-tight mb-2 group-hover:text-harita-mavi transition-colors">
                {k.baslik}
              </h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-kpss-turuncu"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Ort. {k.kpss_soru_sayisi_ort} Soru
                  </span>
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                {k.aciklama}
              </p>

              {/* Linkler */}
              <div className="flex gap-3">
                <Link
                  href={`/konu/${k.slug}`}
                  className="flex-[2] text-center text-sm font-bold text-white bg-kpss-koyu hover:bg-black py-3.5 rounded-xl transition-all shadow-lg shadow-gray-200"
                >
                  📖 Konuyu Oku
                </Link>
                <Link
                  href={`/harita/${k.slug}`}
                  title="Harita Görünümü"
                  className="flex-1 text-center text-xl bg-gray-50 hover:bg-harita-mavi/10 text-gray-600 hover:text-harita-mavi py-3 rounded-xl transition-all border border-gray-100"
                >
                  🗺️
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Alt Bilgi */}
        <div className="mt-20 p-10 bg-gradient-to-br from-kpss-koyu to-black rounded-[40px] text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-64 h-64 bg-harita-mavi rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-kpss-turuncu rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Harita ile Öğrenmeyi Dene</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Sadece okumak yetmez. Tüm bu konuları Türkiye haritası üzerinde görselleştirerek hafızana kazı.
            </p>
            <Link 
              href="/harita/madenler-enerji"
              className="inline-block bg-harita-mavi hover:bg-harita-mavi-dark text-white font-black py-4 px-10 rounded-2xl transition-all transform hover:scale-105"
            >
              🗺️ İnteraktif Haritayı Aç
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
