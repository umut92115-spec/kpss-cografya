import Link from "next/link";
import { getAllKonular } from "@/lib/getKonuData";

const hizliLinkler = [
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/gizlilik", label: "Gizlilik Politikası" },
];

export default async function Footer() {
  const konular = await getAllKonular();

  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="w-9 h-9 bg-gradient-to-br from-focus-500 to-focus-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="font-bold text-white text-lg tracking-tight leading-none">
                KPSS <span className="text-focus-400">Coğrafya</span>
              </span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed mb-5">
              Türkiye&apos;nin en interaktif KPSS Coğrafya hazırlık platformu. 81 ilin tüm
              verilerini harita üzerinde keşfedin.
            </p>
          </div>

          {/* Topics */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-5">
              Müfredat Konuları
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {konular.map((k) => (
                <li key={k.slug}>
                  <Link
                    href={`/konu/${k.slug}`}
                    className="text-sm text-ink-400 hover:text-focus-300 transition-colors flex items-center gap-3 group"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-ink-800 rounded-md group-hover:bg-focus-600/20 transition-colors text-xs">
                      {k.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {k.baslik}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-5">
              Hızlı Erişim
            </h3>
            <ul className="space-y-3">
              {hizliLinkler.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-400 hover:text-white transition-colors block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/harita"
                  className="text-sm text-focus-400 font-bold hover:text-focus-300 transition-colors block"
                >
                  İnteraktif Harita →
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="text-sm text-focus-400 font-bold hover:text-focus-300 transition-colors block"
                >
                  Soru Bankası →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-ink-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-500">
          <div className="flex items-center gap-4">
            <span>© 2026 kpsscografya.com.tr</span>
            <span>Tüm hakları saklıdır.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="hover:text-white transition-colors">
              Gizlilik
            </Link>
            <Link href="/iletisim" className="hover:text-white transition-colors">
              İletişim
            </Link>
            <a
              href="https://www.osym.gov.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              ÖSYM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
