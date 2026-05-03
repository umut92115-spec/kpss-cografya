'use client';

import { Konu } from '@/types';

interface GorselHafizaKartiProps {
  konu: Konu;
}

export default function GorselHafizaKarti({ konu }: GorselHafizaKartiProps) {
  const scrollToContent = () => {
    const el = document.getElementById('mdx-content');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full md:w-1/3 flex justify-center">
      <div 
        className="relative group cursor-pointer" 
        onClick={scrollToContent}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative bg-white p-4 rounded-2xl border border-gray-200 shadow-xl transform group-hover:-rotate-2 transition-transform duration-500">
          <span className="text-6xl">{konu.icon}</span>
        </div>
      </div>
    </div>
  );
}
