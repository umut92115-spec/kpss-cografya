"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border-b border-ink-100 dark:border-ink-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-focus-600 to-focus-700 rounded-xl flex items-center justify-center text-white text-lg shadow-md shadow-focus-600/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-focus-600/30 transition-all duration-300">
              <svg
                width="20"
                height="20"
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
            <div className="flex flex-col">
              <span className="font-bold text-ink-900 dark:text-white text-lg tracking-tight leading-none">
                KPSS <span className="text-focus-600 dark:text-focus-400">Coğrafya</span>
              </span>
              <span className="text-[10px] text-ink-400 font-medium tracking-wide">
                Eğitim Platformu
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-ink-50 dark:bg-ink-800 p-1.5 rounded-xl border border-ink-100 dark:border-ink-700">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  isActive(href)
                    ? "bg-white dark:bg-ink-700 text-focus-600 dark:text-focus-400 shadow-sm ring-1 ring-focus-100 dark:ring-focus-800"
                    : "text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-white/60 dark:hover:bg-ink-700/60"
                }
              `}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/harita"
            className="px-6 py-2.5 bg-focus-600 text-white text-sm font-bold rounded-lg hover:bg-focus-700 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-focus-600/20"
          >
            Hemen Başla
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="p-2.5 rounded-xl bg-focus-50 text-focus-700 border border-focus-100 hover:bg-focus-100 transition-colors"
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

      {/* Mobile Menu */}
      {menuAcik && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border-b border-ink-100 dark:border-ink-800 p-6 animate-fade-in shadow-xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAcik(false)}
                className={`
                  flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-semibold transition-all
                  ${
                    isActive(href)
                      ? "bg-focus-50 text-focus-700 border border-focus-100"
                      : "text-ink-700 hover:bg-ink-50"
                  }
                `}
              >
                <span className="text-2xl">{icon}</span>
                {label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-700 flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/harita"
                onClick={() => setMenuAcik(false)}
                className="flex-1 flex items-center justify-center py-4 bg-focus-600 text-white rounded-2xl font-bold text-lg shadow-md shadow-focus-600/20"
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
