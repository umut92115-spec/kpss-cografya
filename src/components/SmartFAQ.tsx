'use client';

import { ReactNode } from 'react';

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
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              ❓
            </span>
            <h4 className="font-bold text-gray-900 leading-snug">
              {item.q}
            </h4>
          </div>
          <div className="text-gray-600 text-sm leading-relaxed pl-11">
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
