"use client";

import { Konu } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface GorselHafizaKartiProps {
  konu: Konu;
}

export default function GorselHafizaKarti({ konu }: GorselHafizaKartiProps) {
  const [isOpen, setIsOpen] = useState(false);
  const imageUrl = `/images/konu/${konu.slug}.png`;

  return (
    <div className="w-full md:w-1/2 flex justify-center">
      <div
        className="relative group cursor-pointer w-full max-w-sm"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="relative bg-white dark:bg-ink-800 p-4 rounded-3xl border border-ink-100 dark:border-ink-700 shadow-xl transform group-hover:-rotate-1 group-hover:scale-[1.02] transition-all duration-500">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-ink-50 dark:bg-ink-900 border border-ink-100/60 dark:border-ink-700/60">
            <Image
              src={imageUrl}
              alt={`${konu.baslik} Görsel Hafıza Kartı`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-w-7xl) 33vw, 100vw"
              priority
              onError={(e) => {
                // fallback to icon if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Fallback Icon (Absolute center, shown if image fails or before it loads) */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 bg-ink-50 dark:bg-ink-900">
              <span className="text-7xl animate-pulse">{konu.icon}</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
              🧠 Görsel Hafıza Kartı
            </span>
            <h3 className="text-sm font-bold text-ink-800 dark:text-ink-200 mt-1">
              Büyütmek için Tıkla
            </h3>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10 transition-all duration-300 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute top-6 right-6 text-white text-4xl cursor-pointer hover:scale-110 transition-transform">
            ✕
          </div>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageUrl}
              alt={`${konu.baslik} Görsel Hafıza Kartı`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
