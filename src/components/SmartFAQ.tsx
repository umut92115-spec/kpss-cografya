"use client";

import { ReactNode } from "react";

interface FaqItem {
  q: string;
  a: string | ReactNode;
}

interface SmartFAQProps {
  items: FaqItem[];
}

export default function SmartFAQ({ items = [] }: SmartFAQProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-ink-800 border border-ink-150 dark:border-ink-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              ❓
            </span>
            <h4 className="font-bold text-ink-900 dark:text-white leading-snug">{item.q}</h4>
          </div>
          <div className="text-ink-650 dark:text-ink-350 text-sm leading-relaxed pl-11">
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
