"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/harita", label: "Harita", icon: "🗺️" },
  { href: "/konu", label: "Konular", icon: "📖" },
  { href: "/il", label: "İller", icon: "📍" },
  { href: "/hazirlik", label: "Hazırlık", icon: "🎓" },
  { href: "/quiz", label: "Quiz", icon: "✍️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuAcik, setMenuAcik] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("/").slice(0, 2).join("/"));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-surface-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* ─── Sol: Logo ─────────────────────────────────────── */}
        <div className="flex shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
              🗺️
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-surface-900 text-xl tracking-tight leading-none">
                kpss<span className="text-brand-600">coğrafya</span>
              </span>
              <span className="text-[10px] text-surface-400 font-bold uppercase tracking-[0.2em]">
                Platformu
              </span>
            </div>
          </Link>
        </div>

        {/* ─── Orta: Masaüstü Nav ────────────────────────────── */}
        <nav className="hidden md:flex items-center bg-surface-50/50 p-1.5 rounded-2xl border border-surface-100 gap-1">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${
                  isActive(href)
                    ? "bg-white text-brand-600 shadow-sm ring-1 ring-surface-100"
                    : "text-surface-500 hover:text-surface-900 hover:bg-white/50"
                }
              `}
            >
              <span className="text-base group-hover:scale-110 transition-transform">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* ─── Sağ: Aksiyon Butonu ────────────────────────────── */}
        <div className="hidden md:flex items-center">
          <Link
            href="/harita"
            className="px-6 py-2.5 bg-surface-900 text-white text-sm font-bold rounded-xl hover:bg-surface-800 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-surface-900/10"
          >
            Hemen Başla
          </Link>
        </div>

        {/* ─── Mobil Toggle ──────────────────────── */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="p-2.5 rounded-xl bg-surface-50 text-surface-900 border border-surface-100 hover:bg-surface-100 transition-colors"
          >
            {menuAcik ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ─── Mobil Dropdown Menü ────────────────────────────── */}
      {menuAcik && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-surface-100 p-6 animate-fade-in shadow-2xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAcik(false)}
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-bold transition-all
                  ${
                    isActive(href)
                      ? "bg-brand-50 text-brand-600"
                      : "text-surface-700 hover:bg-surface-50"
                  }
                `}
              >
                <span className="text-2xl">{icon}</span>
                {label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-surface-100">
              <Link
                href="/harita"
                onClick={() => setMenuAcik(false)}
                className="flex items-center justify-center w-full py-4 bg-surface-900 text-white rounded-2xl font-bold text-lg"
              >
                Hemen Başla
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
