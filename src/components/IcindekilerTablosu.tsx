"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface IcindekilerTablosuProps {
  items: TocItem[];
}

export default function IcindekilerTablosu({ items }: IcindekilerTablosuProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Görünür olan en üstteki başlığı aktif yap
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0% -60% 0%", threshold: 0 }
    );

    const headings = document.querySelectorAll("h2[id], h3[id]");
    headings.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto w-64 shrink-0">
      <div className="bg-white dark:bg-ink-800 border border-ink-150 dark:border-ink-700 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-3">İçindekiler</p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={clsx(
                  "block text-sm py-1 rounded transition-colors leading-snug",
                  item.level === 3
                    ? "pl-4 text-ink-500"
                    : "pl-2 font-medium text-ink-750 dark:text-ink-200",
                  activeId === item.id
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 font-semibold"
                    : "text-ink-500 dark:text-ink-450 hover:text-ink-800 dark:hover:text-ink-100"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
