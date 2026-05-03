'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/harita', label: 'Harita',   icon: '🗺️' },
  { href: '/konu',   label: 'Konular',  icon: '📖' },
  { href: '/il',     label: 'İller',    icon: '📍' },
  { href: '/hazirlik', label: 'Hazırlık', icon: '🎓' },
  { href: '/quiz',   label: 'Quiz',     icon: '✍️' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuAcik, setMenuAcik] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('/').slice(0, 2).join('/'));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* ─── Sol: Logo ─────────────────────────────────────── */}
        <div className="flex md:flex-1">
          <Link 
            href="/" 
            title="KPSS Coğrafya - Ana Sayfa"
            aria-label="KPSS Coğrafya Ana Sayfa"
            className="flex items-center gap-2 shrink-0 group"
          >
            <span className="text-2xl select-none">🗺️</span>
            <div className="leading-tight">
              <span className="font-black text-kpss-koyu text-lg tracking-tight group-hover:text-harita-mavi transition-colors">
                kpss<span className="text-harita-mavi">coğrafya</span>
              </span>
              <span className="text-[10px] text-gray-400 block -mt-0.5 font-medium uppercase tracking-widest">.com</span>
            </div>
          </Link>
        </div>

        {/* ─── Orta: Masaüstü Nav ────────────────────────────── */}
        <nav className="hidden md:flex items-center justify-center gap-1">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              title={`${label} - KPSS Coğrafya`}
              aria-label={label}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive(href)
                  ? 'bg-harita-mavi/10 text-harita-mavi font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* ─── Sağ: Badge + Mobil Toggle ──────────────────────── */}
        <div className="flex md:flex-1 items-center justify-end gap-3">
          {/* Mobil hamburger */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            aria-label="Menüyü aç/kapat"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuAcik ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ─── Mobil Dropdown Menü ────────────────────────────── */}
      {menuAcik && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAcik(false)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${isActive(href)
                    ? 'bg-harita-mavi/10 text-harita-mavi font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
