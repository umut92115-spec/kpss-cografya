import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { getAllKonular } from '@/lib/getKonuData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KPSS Coğrafya - Ücretsiz Notlar, Harita ve Soru Bankası',
  description: 'KPSS coğrafya sınavına harita ile hazırlan. 10 konu, 81 il, interaktif harita ve quiz modu. Madenler, tarım, iklim, ulaşım ve daha fazlası.',
  alternates: { canonical: 'https://kpsscografya.com.tr' },
  openGraph: {
    title: 'KPSS Coğrafya - Ücretsiz Notlar, Harita ve Soru Bankası',
    description: 'KPSS coğrafya sınavına harita ile hazırlan. 10 konu, 81 il, interaktif harita ve quiz modu.',
    url: 'https://kpsscografya.com.tr',
    siteName: 'kpsscografya.com.tr',
    locale: 'tr_TR',
    type: 'website',
  },
  other: {
    'geo.region': 'TR',
    'geo.placename': 'Türkiye',
    'geo.position': '39.0;35.0',
    'ICBM': '39.0, 35.0',
  },
};

// Öne çıkan araçlar
const araclar = [
  {
    icon: '🗺️',
    baslik: 'İnteraktif Harita',
    aciklama: 'İl bazlı veri görselleştirme. Her konuyu harita üzerinde keşfet.',
    href: '/harita',
    renk: 'from-harita-mavi/10 to-blue-50 border-harita-mavi/20 hover:border-harita-mavi/50',
    etiket: '81 il',
  },
  {
    icon: '✍️',
    baslik: 'Quiz Modu',
    aciklama: 'Çıkmış KPSS soruları ile kendin test et. Süre, skor ve analiz.',
    href: '/quiz',
    renk: 'from-kpss-turuncu/10 to-orange-50 border-kpss-turuncu/20 hover:border-kpss-turuncu/50',
    etiket: '200+ soru',
  },
  {
    icon: '📍',
    baslik: 'İl Rehberi',
    aciklama: 'Her ilin coğrafi özelliklerini, verilerini ve KPSS notlarını gör.',
    href: '/il',
    renk: 'from-green-500/10 to-green-50 border-green-500/20 hover:border-green-500/50',
    etiket: '81 il',
  },
];

export default function Home() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen">
      <JsonLd
        tip="EducationalOrganization"
        veri={{
          name: 'KPSS Coğrafya',
          alternateName: 'kpsscografya.com.tr',
          url: 'https://kpsscografya.com.tr',
          description: 'KPSS coğrafya sınavına hazırlanan adaylar için interaktif harita ve wiki platformu.',
          inLanguage: 'tr',
          areaServed: { '@type': 'Country', name: 'Türkiye' },
          teaches: ['KPSS Türkiye Coğrafyası', 'KPSS Madenler ve Enerji', 'KPSS Tarım Coğrafyası'],
        }}
      />

      {/* ════════════════════════════════════════
          BÖLÜM 1 — HERO
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-kpss-koyu text-white">
        {/* Türkiye SVG silueti — dekoratif arka plan */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center">
          <svg viewBox="0 0 600 300" className="w-full max-w-3xl" fill="white" aria-hidden="true">
            <path d="M30,150 Q60,80 120,90 L180,70 Q240,50 300,75 L380,60 Q440,55 500,90 L560,110 Q590,130 570,160 L540,190 Q510,210 480,195 L420,200 Q390,215 360,200 L300,210 Q260,225 220,205 L170,215 Q130,225 100,200 L60,185 Q20,175 30,150Z"/>
          </svg>
        </div>

        {/* Izgara deseni */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32 text-center">
          {/* Üst badge */}
          <div className="inline-flex items-center gap-2 bg-harita-mavi/20 border border-harita-mavi/30 text-harita-mavi-light rounded-full px-4 py-1.5 text-xs font-semibold mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-harita-mavi-light animate-ping inline-block" />
            KPSS 2026 hazırlığı başladı
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6 animate-fade-in">
            KPSS Coğrafya&apos;yı{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-harita-mavi-light to-blue-300">
              Harita Üzerinden
            </span>{' '}
            Öğren
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            10 konu · 81 il · interaktif harita
            <br className="hidden sm:block" />
            Tıkla, öğren, sınava hazırlan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link
              href="/harita"
              className="inline-flex items-center justify-center gap-2 bg-harita-mavi hover:bg-harita-mavi-dark text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg shadow-harita-mavi/30"
            >
              🗺️ Haritayı Aç
              <span className="text-blue-200">→</span>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all backdrop-blur-sm"
            >
              ✍️ Quiz&apos;i Dene
            </Link>
          </div>

          {/* İstatistik çipleri */}
          <div className="mt-14 flex flex-wrap justify-center gap-6 text-center">
            {[
              { sayi: '10', etiket: 'KPSS Konusu' },
              { sayi: '81', etiket: 'İnteraktif İl' },
              { sayi: '200+', etiket: 'Quiz Sorusu' },
              { sayi: '100%', etiket: 'Ücretsiz' },
            ].map(({ sayi, etiket }) => (
              <div key={etiket} className="flex flex-col">
                <span className="text-3xl font-black text-white">{sayi}</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">{etiket}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 2 — ÖNE ÇIKAN ARAÇLAR (TAŞINDI)
          ════════════════════════════════════════ */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-kpss-turuncu mb-3">Platform Araçları</p>
            <h2 className="text-3xl md:text-4xl font-black text-kpss-koyu">
              KPSS&apos;ye Hazırlanmanın Üç Yolu
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {araclar.map(({ icon, baslik, aciklama, href, renk, etiket }) => (
              <Link
                key={href}
                href={href}
                className={`group bg-gradient-to-br ${renk} border rounded-2xl p-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col`}
              >
                <div className="text-5xl mb-5">{icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-black text-kpss-koyu text-xl">{baslik}</h3>
                  <span className="text-xs bg-white/70 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {etiket}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{aciklama}</p>
                <div className="mt-5 text-sm font-bold text-harita-mavi group-hover:gap-2 flex items-center gap-1 transition-all">
                  Keşfet <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 3 — KONULAR IZGARASI
          ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-harita-mavi mb-3">10 KPSS Konusu</p>
          <h2 className="text-3xl md:text-4xl font-black text-kpss-koyu">
            Hangi Konudan Başlamak İstersin?
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Her konu: wiki anlatım, il bazlı harita ve soru bankası ile eksiksiz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {konular.map((k) => (
            <div
              key={k.slug}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-harita-mavi/40 hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              {/* Üst satır: ikon + zorluk */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{k.icon}</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                    k.agirlik === 'yüksek'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : k.agirlik === 'orta'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}
                >
                  {k.agirlik}
                </span>
              </div>

              {/* İsim */}
              <h3 className="font-bold text-kpss-koyu text-lg leading-snug mb-1">
                {k.baslik}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Ortalama <span className="font-bold text-kpss-turuncu">{k.kpss_soru_sayisi_ort} soru</span>
              </p>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1">
                {k.aciklama}
              </p>

              {/* Alt linkler */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                <Link
                  href={`/harita/${k.slug}`}
                  className="flex-1 text-center text-xs font-semibold text-white bg-harita-mavi hover:bg-harita-mavi-dark py-2 rounded-lg transition-colors"
                >
                  🗺️ Haritada Gör →
                </Link>
                <Link
                  href={`/konu/${k.slug}`}
                  className="flex-1 text-center text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors"
                >
                  📖 Anlat →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 4 — KPSS SORU DAĞILIMI
          ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Veri Destekli Hazırlık</p>
          <h2 className="text-3xl font-black text-kpss-koyu">
            KPSS&apos;de Coğrafya Soru Dağılımı
          </h2>
          <p className="text-gray-500 mt-3">Son 5 yıl ortalamasına göre</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {konular
            .slice()
            .sort((a, b) => b.kpss_soru_sayisi_ort - a.kpss_soru_sayisi_ort)
            .map((k) => {
              const maxSoru = 4;
              const oran = (k.kpss_soru_sayisi_ort / maxSoru) * 100;
              return (
                <div key={k.slug} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <span className="text-2xl w-8 text-center shrink-0">{k.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-800 truncate">{k.kisa_baslik}</span>
                      <span className="text-sm font-black text-kpss-turuncu ml-2 shrink-0">
                        ~{k.kpss_soru_sayisi_ort} soru
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-harita-mavi to-blue-400 rounded-full transition-all duration-700"
                        style={{ width: `${oran}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/konu/${k.slug}`}
                    className="shrink-0 text-xs font-bold text-harita-mavi hover:underline"
                  >
                    Çalış →
                  </Link>
                </div>
              );
            })}
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 5 — CTA BANNER
          ════════════════════════════════════════ */}
      <section className="mx-4 mb-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-kpss-koyu-soft to-kpss-koyu rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-harita-mavi/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-kpss-turuncu/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Hemen Başla</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Türkiye haritasını tıkla,<br />KPSS&apos;yi fethet.
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Ücretsiz, reklamsız ve sınırsız. Hemen haritayı aç, ilini seç, konunu öğren.
            </p>
            <Link
              href="/harita"
              className="inline-flex items-center gap-2 bg-harita-mavi hover:bg-harita-mavi-dark text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-harita-mavi/30"
            >
              🗺️ Haritayı Aç →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
