"use client";

import React, { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";

interface MiniIlHaritasiProps {
  secilenIlSlug: string;
  bolgeIlleri: string[];
  ilAdi: string;
  bolgeAdi: string;
}

export default function MiniIlHaritasi({
  secilenIlSlug,
  bolgeIlleri,
  ilAdi,
  bolgeAdi,
}: MiniIlHaritasiProps) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/maps/turkey-iller.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl animate-pulse">
        <span className="text-gray-400 text-sm font-medium">Siyasi Harita Yükleniyor...</span>
      </div>
    );
  }

  // Helper for slugifying to match
  const slugify = (text: string) => {
    const trMap: Record<string, string> = {
      ç: "c",
      ğ: "g",
      ş: "s",
      ü: "u",
      ı: "i",
      ö: "o",
      Ç: "C",
      Ğ: "G",
      Ş: "S",
      Ü: "U",
      İ: "I",
      Ö: "O",
    };
    let str = text.trim();
    for (const key in trMap) {
      str = str.replace(new RegExp(key, "g"), trMap[key]);
    }
    return str
      .replace(/[^a-zA-Z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  // Bölgeye ait illeri filtrele (Zoom için)
  const regionFeatures = geoData.features.filter((f: any) => {
    const featureSlug = slugify(f.properties.name || f.properties.il_adi);
    return bolgeIlleri.includes(featureSlug);
  });

  const regionFeatureCollection = {
    type: "FeatureCollection",
    features: regionFeatures,
  };

  // Çok daha büyük bir alana projeksiyon yapalım (çözünürlük ve hassasiyet için)
  const projection = geoMercator().fitSize([1000, 1000], regionFeatureCollection as any);
  const pathGenerator = geoPath().projection(projection);

  // Bölgenin haritadaki tam bounding box'ını (sınırlarını) hesapla
  const bounds = pathGenerator.bounds(regionFeatureCollection as any);
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = bounds[0][0];
  const y = bounds[0][1];

  // Sınırların etrafında bırakılacak boşluk (padding)
  const padding = 15;
  const viewBoxStr = `${x - padding} ${y - padding} ${dx + padding * 2} ${dy + padding * 2}`;

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-white overflow-hidden group p-2">
      {/* Şık Arka Plan Dokuları */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <svg
        viewBox={viewBoxStr}
        className="w-full h-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Seçili İl: Canlı Turuncu */}
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
            <stop offset="100%" stopColor="#ea580c" /> {/* orange-600 */}
          </linearGradient>

          {/* Bölge İlleri: Açık Canlı Sarı */}
          <linearGradient id="regionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" /> {/* yellow-200 */}
            <stop offset="100%" stopColor="#fde047" /> {/* yellow-300 */}
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g className="turkey-map">
          {/* Sadece bölge illerini çiziyoruz ki tamamen "zoom in" hissi versin */}
          {regionFeatures.map((feature: any, i: number) => {
            const ilAdi = feature.properties.name || feature.properties.il_adi;
            const featureSlug = slugify(ilAdi);
            const isSelected = featureSlug === secilenIlSlug;

            // Merkez noktasını (yazı için) hesapla
            const centroid = pathGenerator.centroid(feature);
            const cx = centroid ? centroid[0] : 0;
            const cy = centroid ? centroid[1] : 0;
            const isVisible = !isNaN(cx) && !isNaN(cy);

            return (
              <g key={i}>
                <path
                  d={pathGenerator(feature) as string}
                  fill={isSelected ? "url(#activeGradient)" : "url(#regionGradient)"}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? "3" : "1.5"}
                  filter={isSelected ? "url(#glow)" : "none"}
                  className={`transition-all duration-500 ${
                    isSelected
                      ? "opacity-100 z-20 scale-[1.02]"
                      : "opacity-90 hover:opacity-100 hover:brightness-105 z-10"
                  }`}
                  style={{
                    transformOrigin: "center",
                    transformBox: "fill-box",
                  }}
                />

                {/* İl İsmi Etiketi */}
                {isVisible && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-black pointer-events-none transition-all duration-500 ${
                      isSelected
                        ? "fill-white text-[36px] drop-shadow-md"
                        : "fill-yellow-800/60 text-[22px]"
                    }`}
                  >
                    {ilAdi}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Dekoratif Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-sm border border-slate-200 pointer-events-none z-30 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <span className="text-sm font-black text-slate-800 tracking-wide">
            {bolgeAdi} Bölgesi ve {ilAdi} Şehrimiz
          </span>
        </div>
      </div>
    </div>
  );
}
