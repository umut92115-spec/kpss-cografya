'use client';

import { useState } from 'react';
import { FAQ } from '@/types';

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
      {faqs.map((faq, idx) => (
        <div 
          key={idx} 
          className={`border rounded-xl transition-all duration-200 ${
            openIndex === idx ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <button
            onClick={() => toggle(idx)}
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
          >
            <span className="font-bold text-gray-800 text-sm md:text-base flex-1">
              {faq.q}
            </span>
            <span className={`text-blue-500 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {openIndex === idx && (
            <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
