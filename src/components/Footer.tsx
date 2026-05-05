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
    <footer className="bg-surface-950 text-surface-300">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ─── Sütun 1: Logo & Açıklama ─── */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-lg shadow-lg shadow-brand-500/20">
                🗺️
              </div>
              <span className="font-bold text-white text-xl tracking-tight leading-none">
                kpss<span className="text-brand-500">coğrafya</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed mb-6">
              Türkiye&apos;nin en interaktif KPSS Coğrafya hazırlık platformu. 81 ilin tüm verilerini harita üzerinde keşfedin.
            </p>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-900 border border-surface-800 text-white hover:bg-brand-600 transition-colors cursor-pointer">
                📱
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-900 border border-surface-800 text-white hover:bg-brand-600 transition-colors cursor-pointer">
                📧
              </span>
            </div>
          </div>

          {/* ─── Sütun 2: KPSS Konuları ─── */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-6">
              Müfredat Konuları
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {konular.map((k) => (
                <li key={k.slug}>
                  <Link
                    href={`/konu/${k.slug}`}
                    className="text-sm text-surface-400 hover:text-white transition-colors flex items-center gap-3 group"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-surface-900 rounded-md group-hover:bg-brand-600 transition-colors">{k.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform">{k.baslik}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Sütun 3: Hızlı Linkler ─── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500 mb-6">
              Hızlı Erişim
            </h3>
            <ul className="space-y-4">
              {hizliLinkler.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-surface-400 hover:text-white transition-colors block">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/harita" className="text-sm text-brand-500 font-bold hover:text-brand-400 transition-colors block">
                  İnteraktif Harita →
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-sm text-brand-500 font-bold hover:text-brand-400 transition-colors block">
                  Soru Bankası →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Alt Bar ─── */}
        <div className="mt-20 pt-8 border-t border-surface-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-surface-500 font-medium">
          <div className="flex items-center gap-6">
            <span>© 2026 kpsscografya.com.tr</span>
            <span>Tüm hakları saklıdır.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
