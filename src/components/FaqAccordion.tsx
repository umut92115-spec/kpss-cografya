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
                ? "border-blue-500 bg-blue-50/30"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <button
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(idx)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
            >
              <span className="font-bold text-gray-800 text-sm md:text-base flex-1">{faq.q}</span>
              <span
                aria-hidden="true"
                className={`text-blue-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
                <div className="h-px bg-gray-100 mb-4" />
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
