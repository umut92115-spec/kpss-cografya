import Link from 'next/link';
import { getAllKonular } from '@/lib/getKonuData';

const hizliLinkler = [
  { href: '/hakkinda', label: 'Hakkında' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/gizlilik', label: 'Gizlilik Politikası' },
];

export default function Footer() {
  const konular = getAllKonular();

  return (
    <footer className="bg-kpss-koyu text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ─── Sütun 1: Logo & Açıklama ─── */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <span className="text-2xl">🗺️</span>
              <span className="font-black text-white text-lg tracking-tight">
                kpss<span className="text-harita-mavi-light">coğrafya</span>.com.tr
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              KPSS coğrafya sınavına hazırlanan adaylar için
              Türkiye&apos;nin en kapsamlı interaktif harita ve wiki platformu.
              81 il, 10 konu, sınırsız tekrar.
            </p>
            <div className="mt-5 flex gap-3">
              <span className="inline-block text-xs bg-harita-mavi/20 text-harita-mavi-light border border-harita-mavi/30 px-3 py-1 rounded-full">
                🆓 Ücretsiz
              </span>
              <span className="inline-block text-xs bg-green-900/30 text-green-400 border border-green-800/40 px-3 py-1 rounded-full">
                ✓ Reklamsız
              </span>
            </div>
          </div>

          {/* ─── Sütun 2: KPSS Konuları ─── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              KPSS Konuları
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-3">
              {konular.map((k) => (
                <li key={k.slug}>
                  <Link
                    href={`/konu/${k.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-base">{k.icon}</span>
                    <span className="group-hover:underline underline-offset-2 truncate">{k.kisa_baslik}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Sütun 3: Hızlı Linkler ─── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/il" className="text-sm text-gray-400 hover:text-white transition-colors">
                  📍 81 İl Rehberi
                </Link>
              </li>
              <li>
                <Link href="/harita/madenler-enerji" className="text-sm text-gray-400 hover:text-white transition-colors">
                  🗺️ İnteraktif Harita
                </Link>
              </li>
              <li>
                <Link href="/quiz/madenler-enerji" className="text-sm text-gray-400 hover:text-white transition-colors">
                  ✍️ Quiz Modu
                </Link>
              </li>
              {hizliLinkler.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Alt Bar ─── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <span>© 2025 kpsscografya.com.tr — Tüm hakları saklıdır.</span>
          <span>KPSS Genel Kültür · Coğrafya · Türkiye</span>
        </div>
      </div>
    </footer>
  );
}
