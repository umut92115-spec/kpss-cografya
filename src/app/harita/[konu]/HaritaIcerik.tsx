"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Il, Konu, IlKonuData } from "@/types";
import IlPaneli from "@/components/IlPaneli";

const HaritaGoruntule = dynamic(() => import("@/components/HaritaGoruntule"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] md:min-h-[600px] bg-ink-800/50 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-ink-700">
      <div className="w-10 h-10 border-3 border-focus-400 border-t-transparent rounded-full animate-spin mb-3"></div>
      <span className="text-ink-400 text-sm font-medium">Harita yükleniyor...</span>
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
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      {/* Konu Seçici — Üst Bar */}
      <div className="bg-ink-900 border-b border-ink-700/50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tumKonular.map((k) => {
              const isActive = k.slug === konuMeta.slug;
              return (
                <button
                  key={k.slug}
                  onClick={() => router.push(`/harita/${k.slug}`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-focus-600 text-white shadow-lg shadow-focus-600/20"
                      : "bg-ink-800 text-ink-300 hover:bg-ink-700 hover:text-ink-100 border border-ink-700"
                  }`}
                >
                  <span className="text-base">{k.icon}</span>
                  <span>{k.kisa_baslik}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Harita + Panel */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Harita Alanı */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-0">
          <HaritaGoruntule
            konuSlug={konuMeta.slug}
            secilenIl={secilenIlSlug}
            onIlSec={setSecilenIlSlug}
            matrisData={matrisData}
            temaRenk={konuMeta.harita_renk}
          />
        </div>

        {/* Sağ Panel */}
        <div className="w-full lg:w-[380px] lg:border-l border-t lg:border-t-0 border-ink-700/50 bg-ink-900 overflow-y-auto">
          <IlPaneli il={secilenIlData} konuData={ilKonuVerisi} />
        </div>
      </div>
    </div>
  );
}
