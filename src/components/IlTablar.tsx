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
      <div className="flex flex-wrap gap-1.5 mb-6 p-1.5 bg-ink-50 dark:bg-ink-800 rounded-xl border border-ink-100 dark:border-ink-700">
        {tumKonular.map((konu) => (
          <button
            key={konu.slug}
            onClick={() => setAktifTab(konu.slug)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              aktifTab === konu.slug
                ? "bg-white dark:bg-ink-700 text-focus-600 dark:text-focus-400 shadow-sm"
                : "text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-white/60 dark:hover:bg-ink-700/60"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Sol: Veri Detayları */}
                <div className="space-y-4">
                  {"maden_turleri" in aktifVeri && (
                    <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700">
                      <h3 className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-3">
                        Maden Türleri
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {aktifVeri.maden_turleri.map((m) => (
                          <span
                            key={m}
                            className="px-2.5 py-1 bg-glow-50 dark:bg-glow-900/20 border border-glow-200 dark:border-glow-700/30 text-glow-700 dark:text-glow-300 rounded-lg text-xs font-semibold"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                      {aktifVeri.onemli_not && (
                        <p className="mt-3 text-ink-500 dark:text-ink-400 text-sm leading-relaxed border-l-2 border-ink-200 dark:border-ink-600 pl-3">
                          {aktifVeri.onemli_not}
                        </p>
                      )}
                    </div>
                  )}

                  {"ana_urunler" in aktifVeri && (
                    <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700">
                      <h3 className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-3">
                        Ana Ürünler
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {aktifVeri.ana_urunler.map((u) => (
                          <span
                            key={u}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                      {aktifVeri.ihracat_urunu && (
                        <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                          İhracat:{" "}
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {aktifVeri.ihracat_urunu}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {aktifVeri.kpss_notu && (
                    <div className="p-4 rounded-xl bg-focus-50 dark:bg-focus-900/20 border border-focus-100 dark:border-focus-700/30">
                      <h3 className="text-[10px] font-bold text-focus-600 dark:text-focus-400 uppercase tracking-widest mb-2">
                        Sınav Notu
                      </h3>
                      <p className="text-ink-700 dark:text-ink-200 text-sm leading-relaxed">
                        {aktifVeri.kpss_notu}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sağ: Özet */}
                <div className="flex flex-col">
                  {aktifVeri.super_detay?.snippet ? (
                    <div className="p-5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[10px] font-bold text-focus-600 dark:text-focus-400 uppercase tracking-widest mb-3">
                          Konu Özeti
                        </h3>
                        <p className="text-ink-700 dark:text-ink-300 text-sm leading-relaxed">
                          {aktifVeri.super_detay.snippet}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/${bolge_slug}/il/${params_slug}/${aktifKonu.slug}`}
                          className="bg-ink-800 dark:bg-ink-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-ink-900 dark:hover:bg-ink-500 transition-colors"
                        >
                          Detay →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-ink-50/50 dark:bg-ink-800/50 border border-dashed border-ink-200 dark:border-ink-700 flex items-center justify-center text-center flex-1">
                      <p className="text-xs text-ink-400 italic">
                        Detaylı özet içerik yakında eklenecek.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ */}
              {/* @ts-expect-error checking for faqs property on union type */}
              {(aktifVeri?.faqs && aktifVeri.faqs.length > 0) ||
              (aktifVeri.super_detay?.faqs && aktifVeri.super_detay.faqs.length > 0) ? (
                <div className="mt-6 pt-6 border-t border-ink-100 dark:border-ink-700">
                  <h3 className="text-sm font-bold text-ink-800 dark:text-ink-200 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-focus-600 text-white flex items-center justify-center text-[10px]">
                      ?
                    </span>
                    {aktifKonu.kisa_baslik} Soruları
                  </h3>
                  {/* @ts-expect-error faqs access */}
                  <FaqAccordion faqs={aktifVeri.super_detay?.faqs || aktifVeri.faqs || []} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="py-10 text-center bg-ink-50 dark:bg-ink-800 rounded-xl border border-dashed border-ink-200 dark:border-ink-700">
              <span className="text-2xl mb-2 block opacity-50">📂</span>
              <p className="text-ink-400 text-sm italic">
                Bu konuda henüz detaylı analiz hazır değil.
              </p>
            </div>
          )}

          {/* Alt linkler */}
          <div className="pt-4 border-t border-ink-100 dark:border-ink-700 flex justify-between items-center">
            <Link
              href={`/${bolge_slug}/il/${params_slug}/${aktifKonu.slug}`}
              className="text-sm font-semibold text-focus-600 dark:text-focus-400 hover:text-focus-700 dark:hover:text-focus-300 transition-colors"
            >
              Detaylı bilgi →
            </Link>
            <Link
              href={`/harita/${aktifKonu.slug}`}
              className="text-sm font-medium text-ink-400 dark:text-ink-500 hover:text-focus-600 dark:hover:text-focus-400 transition-colors"
            >
              Haritada gör
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
