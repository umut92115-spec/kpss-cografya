'use client';

import { useState } from 'react';
import { QuizSoru } from '@/types/quiz';
import JsonLd from './JsonLd';

interface SmartFAQProps {
  sorular: QuizSoru[];
  konuBaslik: string;
}

export default function SmartFAQ({ sorular, konuBaslik }: SmartFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Google için Schema verisini hazırla
  const faqSchema = {
    mainEntity: sorular.map((s) => ({
      "@type": "Question",
      "name": s.soru,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${s.dogru}. ${s.aciklama}`
      }
    }))
  };

  return (
    <section className="mt-16 border-t border-gray-100 pt-12">
      {/* Arka planda Google'a basılacak veri */}
      <JsonLd tip="FAQPage" veri={faqSchema} />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-2 bg-blue-600 rounded-full shadow-sm shadow-blue-200"></div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {konuBaslik} Hakkında Merak Edilenler
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Sınavda çıkma ihtimali yüksek {sorular.length} soru ve detaylı çözümü</p>
        </div>
      </div>

      <div className="space-y-4">
        {sorular.map((s, idx) => (
          <div 
            key={s.id} 
            className={`group border-2 rounded-2xl transition-all duration-300 ${
              openIndex === idx 
                ? 'border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-100/50' 
                : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                  openIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  {idx + 1}
                </span>
                <span className="font-bold text-gray-800 text-sm md:text-base leading-snug pt-1">
                  {s.soru}
                </span>
              </div>
              <span className={`text-blue-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            
            {openIndex === idx && (
              <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="ml-12">
                  <div className="h-px bg-blue-100 mb-5" />
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Doğru Cevap</span>
                      <span className="font-black text-gray-900 text-lg">{s.dogru}</span>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-4 border border-blue-100/50 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        <span className="font-bold text-blue-600">Analiz: </span>
                        {s.aciklama}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Alt Bilgi */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
        <span className="text-xl">💡</span>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          Bu sorular ve çözümleri, son 10 yılın KPSS çıkmış soruları ve güncel müfredat analiz edilerek <strong>kpsscografya.com.tr</strong> editörleri tarafından hazırlanmıştır.
        </p>
      </div>
    </section>
  );
}
