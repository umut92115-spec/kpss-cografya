import { Metadata } from 'next';
import Link from 'next/link';
import { getAllIller, bolgeler } from '@/lib/getIlData';
import { Il } from '@/types';

export const metadata: Metadata = {
  title: "Türkiye İlleri KPSS Coğrafya — 81 İl | kpsscografya.com",
  description:
    "Türkiye'nin tüm 81 iline ait KPSS coğrafya bilgileri: madenler, tarım, iklim, nüfus ve sanayi verileri. Bölgeye göre gruplanmış kapsamlı rehber.",
};

// Bölge renk ve ikon eşleştirmesi
const bolgeAyarlar: Record<string, { renk: string; bg: string; icon: string }> = {
  Marmara:              { renk: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   icon: '🌊' },
  Ege:                  { renk: 'text-sky-700',    bg: 'bg-sky-50 border-sky-200',     icon: '🏖️' },
  Akdeniz:              { renk: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: '☀️' },
  'İç Anadolu':         { renk: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: '🌾' },
  Karadeniz:            { renk: 'text-green-700',  bg: 'bg-green-50 border-green-200', icon: '🌲' },
  'Doğu Anadolu':       { renk: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: '⛰️' },
  'Güneydoğu Anadolu':  { renk: 'text-red-700',   bg: 'bg-red-50 border-red-200',     icon: '🏜️' },
};

export default function IllerPage() {
  const iller = getAllIller();

  // Bölgeye göre grupla
  const bolgeMap: Record<string, Il[]> = {};
  for (const il of iller) {
    if (!bolgeMap[il.bolge]) bolgeMap[il.bolge] = [];
    bolgeMap[il.bolge].push(il);
  }
  // Her bölgeyi il adına göre sırala
  for (const bolge in bolgeMap) {
    bolgeMap[bolge].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Başlık */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Türkiye&apos;nin 81 İli
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          İlgilendiğin ile tıkla ve KPSS coğrafya konularındaki bilgilerine ulaş.
          Her sayfa harita, maden, tarım, iklim ve quiz içerir.
        </p>
      </div>

      {/* Hızlı istatistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { etiket: 'Toplam İl', deger: '81' },
          { etiket: 'Bölge', deger: '7' },
          { etiket: 'KPSS Konusu', deger: '10' },
          { etiket: 'İnteraktif Harita', deger: '10' },
        ].map(stat => (
          <div key={stat.etiket} className="text-center bg-white border border-gray-200 rounded-xl py-4 shadow-sm">
            <p className="text-3xl font-bold text-blue-600">{stat.deger}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.etiket}</p>
          </div>
        ))}
      </div>

      {/* Bölgeler */}
      <div className="space-y-10">
        {bolgeler.map((b) => {
          const regionName = b.ad;
          const regionIller = bolgeMap[regionName] ?? [];
          const ayar = bolgeAyarlar[regionName] ?? { renk: 'text-gray-700', bg: 'bg-gray-50 border-gray-200', icon: '📍' };

          return (
            <section key={b.slug} id={b.slug}>
              {/* Bölge Başlığı */}
              <Link
                href={`/${b.url}`}
                className={`flex items-center justify-between border rounded-xl px-5 py-3 mb-4 hover:shadow-md transition-all ${ayar.bg}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ayar.icon}</span>
                  <div>
                    <h2 className={`text-xl font-bold ${ayar.renk}`}>{regionName} Bölgesi</h2>
                    <p className="text-xs text-gray-500">{regionIller.length} il</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-400">Bölgeyi İncele →</span>
              </Link>

              {/* İl Kartları */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {regionIller.map((il) => (
                  <Link
                    key={il.slug}
                    href={`/${b.url}/il/${il.slug}`}
                    className="group flex flex-col bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400 leading-none">{il.plaka}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors leading-tight">
                      {il.ad}
                    </p>
                    <p className="text-xs text-gray-400 mt-auto pt-2">
                      {(il.nufus_2023 / 1_000_000).toFixed(1)}M kişi
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Alt Bağlantı */}
      <div className="mt-16 p-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Haritadan İl Seç</h3>
        <p className="text-gray-400 mb-6">
          İnteraktif Türkiye haritasında tıklayarak il bazlı KPSS verilerini görüntüle.
        </p>
        <Link
          href="/harita/madenler-enerji"
          className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors"
        >
          🗺️ Haritayı Aç →
        </Link>
      </div>
    </div>
  );
}
