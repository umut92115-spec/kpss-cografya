"use client";

import { useState } from "react";
import type { FAQ } from "@/types";

interface FaqAccordionProps {
  faqs: FAQ[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${idx}`;
        const headerId = `faq-header-${idx}`;
        const keyStr = (faq.q ?? "").slice(0, 20);
        return (
          <div
            key={`${keyStr}-${idx}`}
            className={`border rounded-xl transition-all duration-200 ${
              isOpen
                ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                : "border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 hover:border-ink-350 dark:hover:border-ink-650"
            }`}
          >
            <button
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(idx)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
            >
              <span className="font-bold text-ink-800 dark:text-ink-100 text-sm md:text-base flex-1">
                {faq.q}
              </span>
              <span
                aria-hidden="true"
                className="text-blue-500 dark:text-blue-400 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="h-px bg-ink-100 dark:bg-ink-700 mb-4" />
                <p className="text-ink-750 dark:text-ink-350 leading-relaxed text-sm md:text-base">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
