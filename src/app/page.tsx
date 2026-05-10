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
    aciklama: 'İl bazlı veri görselleştirme. Her konuyu Türkiye haritası üzerinde interaktif olarak keşfet.',
    href: '/harita',
    renk: 'from-brand-50 to-white border-brand-100 hover:border-brand-300 shadow-sm',
    etiket: '81 İl',
    accent: 'text-brand-600 bg-brand-50'
  },
  {
    icon: '✍️',
    baslik: 'Quiz Modu',
    aciklama: 'Çıkmış KPSS soruları ile kendini test et. Detaylı analiz ve skor takibi ile ilerlemeni gör.',
    href: '/quiz',
    renk: 'from-kpss-turuncu-light/30 to-white border-kpss-turuncu-light hover:border-kpss-turuncu shadow-sm',
    etiket: '200+ Soru',
    accent: 'text-kpss-turuncu bg-kpss-turuncu-light'
  },
  {
    icon: '📍',
    baslik: 'İl Rehberi',
    aciklama: 'Her ilin coğrafi özelliklerini, güncel verilerini ve KPSS spesifik notlarını tek tıkla gör.',
    href: '/il',
    renk: 'from-emerald-50 to-white border-emerald-100 hover:border-emerald-300 shadow-sm',
    etiket: '81 İl',
    accent: 'text-emerald-600 bg-emerald-50'
  },
];

export default function Home() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen selection:bg-brand-100 selection:text-brand-700">
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
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        {/* Dekoratif Arka Plan Elemanları */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-50 rounded-full blur-[120px] opacity-60 animate-pulse-soft" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-50 rounded-full blur-[120px] opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Üst Rozet */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 rounded-full bg-surface-50 border border-surface-100 text-surface-600 text-sm font-medium animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            KPSS 2026 Hazırlık Platformu
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-surface-900 mb-8 animate-fade-in">
            Coğrafya&apos;yı{' '}
            <span className="relative">
              <span className="relative z-10 text-brand-600">Görselleştirin</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-100 -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 Q 75 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-surface-500 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Türkiye&apos;nin en interaktif KPSS Coğrafya platformu. Haritalar, güncel veriler ve çıkmış sorularla sınavda fark yaratın.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/harita"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-900 text-white rounded-2xl font-bold text-lg transition-all hover:bg-surface-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-surface-900/10"
            >
              <span>🗺️ Haritayı Keşfet</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-surface-900 border-2 border-surface-100 rounded-2xl font-bold text-lg transition-all hover:border-surface-200 hover:bg-surface-50"
            >
              ✍️ Quiz&apos;e Başla
            </Link>
          </div>

          {/* İstatistikler */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { val: '10', lab: 'Temel Konu' },
              { val: '81', lab: 'İnteraktif İl' },
              { val: '200+', lab: 'Özgün Soru' },
              { val: '100%', lab: 'Ücretsiz' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl font-bold text-surface-900 mb-1">{stat.val}</span>
                <span className="text-sm font-medium text-surface-400 uppercase tracking-wider">{stat.lab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 2 — ARAÇLAR
          ════════════════════════════════════════ */}
      <section className="py-24 bg-surface-50/50 border-y border-surface-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
                Öğrenme Deneyimini<br />Yeniden Tanımlayın
              </h2>
              <p className="text-lg text-surface-500">
                Geleneksel notlardan sıkıldınız mı? Biz coğrafyayı sayfalardan çıkarıp haritalara taşıyoruz.
              </p>
            </div>
            <Link href="/harita" className="text-brand-600 font-bold flex items-center gap-2 hover:underline">
              Tüm araçları gör <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {araclar.map((arac, i) => (
              <Link
                key={i}
                href={arac.href}
                className={`group p-8 rounded-3xl border bg-gradient-to-br ${arac.renk} transition-all duration-300 hover:-translate-y-2 hover:shadow-premium`}
              >
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">{arac.icon}</div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-surface-900">{arac.baslik}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${arac.accent}`}>
                    {arac.etiket}
                  </span>
                </div>
                <p className="text-surface-500 leading-relaxed">
                  {arac.aciklama}
                </p>
                <div className="mt-8 flex items-center gap-2 text-surface-900 font-bold group-hover:gap-3 transition-all">
                  Hemen Dene <span className="text-xl">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 3 — KONULAR
          ════════════════════════════════════════ */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6">Müfredatın Tamamı</h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              KPSS Coğrafya müfredatındaki 10 temel konuyu en ince detayına kadar inceleyin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {konular.map((k) => (
              <div
                key={k.slug}
                className="group relative p-1 rounded-[2.5rem] bg-surface-50 hover:bg-gradient-to-br hover:from-brand-100 hover:to-accent-100 transition-all duration-500"
              >
                <div className="bg-white rounded-[2.2rem] p-8 h-full flex flex-col shadow-sm group-hover:shadow-none transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {k.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      k.agirlik === 'yüksek' ? 'text-rose-600 border-rose-100 bg-rose-50' :
                      k.agirlik === 'orta' ? 'text-amber-600 border-amber-100 bg-amber-50' :
                      'text-emerald-600 border-emerald-100 bg-emerald-50'
                    }`}>
                      {k.agirlik} Önem
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-surface-900 mb-2">{k.baslik}</h3>
                  <p className="text-surface-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {k.aciklama}
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-surface-50">
                    <Link
                      href={`/konu/${k.slug}`}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-900 text-white text-center text-sm font-bold hover:bg-surface-800 transition-colors"
                    >
                      📖 Çalış
                    </Link>
                    <Link
                      href={`/harita/${k.slug}`}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-50 text-surface-900 text-center text-sm font-bold hover:bg-surface-100 transition-colors"
                    >
                      🗺️ Harita
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 4 — SORU DAĞILIMI (Görselleştirme)
          ════════════════════════════════════════ */}
      <section className="py-24 bg-surface-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Sınav Analizi</h2>
            <p className="text-surface-400">Son 5 yılın KPSS soru dağılımına göre konu ağırlıkları</p>
          </div>

          <div className="space-y-6">
            {konular
              .slice()
              .sort((a, b) => b.kpss_soru_sayisi_ort - a.kpss_soru_sayisi_ort)
              .map((k) => {
                const MAX_EXPECTED_QUESTIONS = 4;
                const oran = (k.kpss_soru_sayisi_ort / MAX_EXPECTED_QUESTIONS) * 100;
                return (
                  <div key={k.slug} className="group flex flex-col md:flex-row md:items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-4 md:w-64">
                      <span className="text-3xl">{k.icon}</span>
                      <span className="font-bold text-white truncate">{k.kisa_baslik}</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-400 to-accent-400 rounded-full transition-all duration-1000"
                          style={{ width: `${oran}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:w-32">
                      <span className="text-brand-400 font-bold">~{k.kpss_soru_sayisi_ort} Soru</span>
                      <Link href={`/konu/${k.slug}`} className="md:hidden text-sm font-bold text-surface-400">Detay →</Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BÖLÜM 5 — CTA
          ════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto rounded-[3rem] p-12 md:p-24 bg-gradient-to-br from-brand-600 to-brand-800 text-white text-center relative overflow-hidden shadow-2xl shadow-brand-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] -ml-48 -mb-48" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Hayalindeki Memuriyet İçin<br />Coğrafyayı Fulleyin</h2>
            <p className="text-xl text-brand-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Binlerce aday harita üzerinden öğrenerek başarıya ulaştı. Siz de bugün başlayın, sınavda hiçbir soruyu kaçırmayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/harita"
                className="px-10 py-5 bg-white text-brand-700 rounded-2xl font-bold text-xl hover:bg-brand-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
              >
                Haritayı Aç →
              </Link>
              <Link
                href="/quiz"
                className="px-10 py-5 bg-brand-700/50 text-white border border-white/20 backdrop-blur-sm rounded-2xl font-bold text-xl hover:bg-brand-700 transition-all"
              >
                Kendini Test Et
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
