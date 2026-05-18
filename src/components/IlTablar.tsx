"use client";

import { useState } from "react";
import Link from "next/link";
import { IlKonuData, Konu } from "@/types";
import FaqAccordion from "./FaqAccordion";

interface IlTablarProps {
  params_slug: string;
  bolge_slug: string;
  tumKonular: Konu[];
  konuVerileri: Record<string, IlKonuData | null>;
}

export default function IlTablar({
  params_slug,
  bolge_slug,
  tumKonular,
  konuVerileri,
}: IlTablarProps) {
  const [aktifTab, setAktifTab] = useState(tumKonular[0]?.slug ?? "");

  const aktifKonu = tumKonular.find((k) => k.slug === aktifTab);
  const aktifVeri = konuVerileri[aktifTab];

  return (
    <div>
      {/* Tab Başlıkları */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
        {tumKonular.map((konu) => (
          <button
            key={konu.slug}
            onClick={() => setAktifTab(konu.slug)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors -mb-px ${
              aktifTab === konu.slug
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {konu.icon} {konu.kisa_baslik}
          </button>
        ))}
      </div>

      {/* Tab İçeriği */}
      {aktifKonu && (
        <div className="space-y-5">
          {aktifVeri ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sol: Veri Detayları */}
                <div className="space-y-6">
                  {/* Maden verisi */}
                  {"maden_turleri" in aktifVeri && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        🛠️ Maden Türleri
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {aktifVeri.maden_turleri.map((m) => (
                          <span
                            key={m}
                            className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold shadow-sm"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                      {aktifVeri.onemli_not && (
                        <p className="mt-4 text-gray-600 text-sm leading-relaxed italic border-l-2 border-amber-200 pl-3">
                          {aktifVeri.onemli_not}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tarım verisi */}
                  {"ana_urunler" in aktifVeri && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        🌾 Ana Ürünler
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {aktifVeri.ana_urunler.map((u) => (
                          <span
                            key={u}
                            className="px-3 py-1 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-bold shadow-sm"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                      {aktifVeri.ihracat_urunu && (
                        <p className="mt-4 text-sm text-gray-600 font-medium">
                          🚢 İhracat:{" "}
                          <span className="text-green-700 underline decoration-green-200">
                            {aktifVeri.ihracat_urunu}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* KPSS Notu */}
                  {aktifVeri.kpss_notu && (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                      <p className="text-orange-800 font-black text-xs uppercase tracking-tighter flex items-center gap-2 mb-2">
                        💡 Sınav Notu
                      </p>
                      <p className="text-orange-900 text-sm leading-relaxed font-medium">
                        {aktifVeri.kpss_notu}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sağ: Snippet & Özet */}
                <div className="flex flex-col">
                  {aktifVeri.super_detay?.snippet ? (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex-1 relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
                          📝 Konu Özeti
                        </h3>
                        <p className="text-gray-800 text-sm leading-relaxed font-medium">
                          {aktifVeri.super_detay.snippet}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/${bolge_slug}/il/${params_slug}/${aktifKonu.slug}`}
                          className="bg-gray-900 text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-black transition-colors"
                        >
                          Konuya git.
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-dashed border-gray-200 flex items-center justify-center text-center flex-1">
                      <p className="text-xs text-gray-400 italic">
                        Bu konu hakkında detaylı özet içerik <br />
                        yakında eklenecektir.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sık Sorulan Sorular (SSS) - Bölüm 3'teki FAQ */}
              {/* @ts-expect-error checking for faqs property on union type */}
              {(aktifVeri?.faqs && aktifVeri.faqs.length > 0) ||
              (aktifVeri.super_detay?.faqs && aktifVeri.super_detay.faqs.length > 0) ? (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                        ?
                      </span>
                      KPSS&apos;de {aktifKonu.kisa_baslik} Soruları
                    </h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">
                      FAQ / SSS
                    </span>
                  </div>
                  {/* @ts-expect-error faqs access */}
                  <FaqAccordion faqs={aktifVeri.super_detay?.faqs || aktifVeri.faqs || []} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <span className="text-3xl mb-3 block opacity-50">📂</span>
              <p className="text-gray-400 italic text-sm">
                Bu konuda {aktifKonu.kisa_baslik.toLowerCase()} için detaylı KPSS analizi henüz
                hazır değil.
              </p>
            </div>
          )}

          {/* Haritada Gör Linki */}
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <Link
              href={`/${bolge_slug}/il/${params_slug}/${aktifKonu.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-800 transition-colors bg-orange-50 px-4 py-2 rounded-lg border border-orange-100"
            >
              Detaylı bilgi →
            </Link>

            <Link
              href={`/harita/${aktifKonu.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              🗺️ Haritada gör
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
