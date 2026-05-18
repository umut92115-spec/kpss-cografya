"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Il, Konu, IlKonuData } from "@/types";
import IlPaneli from "@/components/IlPaneli";

const HaritaGoruntule = dynamic(() => import("@/components/HaritaGoruntule"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] md:min-h-[600px] bg-slate-50 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-inner">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-slate-500 font-bold tracking-tight">Harita Modülü Hazırlanıyor...</span>
    </div>
  ),
});

interface HaritaIcerikProps {
  konuMeta: Konu;
  tumKonular: Konu[];
  matrisData: Record<string, IlKonuData> | null;
  iller: Il[];
}

export default function HaritaIcerik({
  konuMeta,
  tumKonular,
  matrisData,
  iller,
}: HaritaIcerikProps) {
  const router = useRouter();
  const [secilenIlSlug, setSecilenIlSlug] = useState<string | null>(null);

  const secilenIlData = secilenIlSlug
    ? (iller.find((i) => i.slug === secilenIlSlug) ?? null)
    : null;
  const ilKonuVerisi = secilenIlSlug && matrisData ? matrisData[secilenIlSlug] || null : null;

  return (
    <div className="flex flex-col space-y-8 animate-fade-in">
      {/* Konu Seçici Tablar */}
      <div className="relative">
        <div className="flex flex-wrap gap-2.5 pb-2">
          {tumKonular.map((k) => {
            const isActive = k.slug === konuMeta.slug;
            return (
              <button
                key={k.slug}
                onClick={() => router.push(`/harita/${k.slug}`)}
                className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-0.5"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <span
                  className={`text-lg transition-transform group-hover:scale-125 ${isActive ? "scale-110" : ""}`}
                >
                  {k.icon}
                </span>
                <span>{k.kisa_baslik}</span>
              </button>
            );
          })}
        </div>
        <div className="h-px w-full bg-gradient-to-r from-gray-200 via-gray-100 to-transparent mt-4"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Harita Alanı (60%) */}
        <div className="w-full lg:w-3/5 h-[500px] md:h-[650px] relative">
          <HaritaGoruntule
            konuSlug={konuMeta.slug}
            secilenIl={secilenIlSlug}
            onIlSec={setSecilenIlSlug}
            matrisData={matrisData}
            temaRenk={konuMeta.harita_renk}
          />
        </div>

        {/* Sağ Panel Alanı (40%) */}
        <div className="w-full lg:w-2/5 h-auto lg:h-[650px]">
          <IlPaneli il={secilenIlData} konuData={ilKonuVerisi} />
        </div>
      </div>
    </div>
  );
}
