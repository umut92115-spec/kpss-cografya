import { Il, IlKonuData } from "@/types";
import Link from "next/link";

interface IlPaneliProps {
  il: Il | null;
  konuData: IlKonuData | null;
}

export default function IlPaneli({ il, konuData }: IlPaneliProps) {
  if (!il) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center">
        <div className="w-16 h-16 bg-ink-800 rounded-2xl flex items-center justify-center mb-5 border border-ink-700">
          <span className="text-3xl opacity-50">📍</span>
        </div>
        <h3 className="text-lg font-bold text-ink-200 mb-2">Bir İl Seçin</h3>
        <p className="text-ink-400 text-sm leading-relaxed max-w-[220px]">
          Haritadan bir ile tıklayarak detaylı coğrafya bilgilerini görüntüleyin.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Başlık */}
      <div className="p-5 border-b border-ink-700/50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold text-white">{il.ad}</h2>
          <span className="bg-ink-700 text-ink-200 px-2.5 py-1 rounded-lg font-bold text-sm">
            {il.plaka}
          </span>
        </div>
        <span className="text-xs text-ink-400 font-medium">{il.bolge} Bölgesi</span>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {konuData ? (
          <>
            {"maden_turleri" in konuData && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">⛏️</span>
                  <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
                    Madenler
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {konuData.maden_turleri.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1.5 bg-glow-500/10 text-glow-300 border border-glow-500/20 rounded-lg text-xs font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {"ana_urunler" in konuData && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🌾</span>
                  <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
                    Tarım Ürünleri
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {konuData.ana_urunler.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {"onemli_not" in konuData && konuData.onemli_not && (
              <div className="bg-ink-800 p-4 rounded-xl border border-ink-700">
                <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-2">
                  Not
                </h3>
                <p className="text-ink-200 text-sm leading-relaxed">{konuData.onemli_not}</p>
              </div>
            )}

            {konuData.kpss_notu && (
              <div className="bg-focus-600/10 p-4 rounded-xl border border-focus-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-focus-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                    !
                  </span>
                  <h4 className="text-xs font-bold text-focus-300 uppercase tracking-wider">
                    KPSS Notu
                  </h4>
                </div>
                <p className="text-focus-100 text-sm leading-relaxed">{konuData.kpss_notu}</p>
              </div>
            )}

            {"sik_soru" in konuData && konuData.sik_soru && (
              <div className="bg-glow-500/10 p-4 rounded-xl border border-glow-500/20">
                <h4 className="text-xs font-bold text-glow-300 uppercase tracking-wider mb-2">
                  Soru Potansiyeli
                </h4>
                <p className="text-glow-100 text-sm leading-relaxed italic">
                  &quot;{konuData.sik_soru}&quot;
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-2xl opacity-40 mb-3">📑</span>
            <p className="text-ink-400 text-sm">Bu konuda {il.ad} için veri bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Alt Link */}
      <div className="p-4 border-t border-ink-700/50">
        <Link
          href={`/${il.bolge_slug}bolgesi/il/${il.slug}`}
          className="flex items-center justify-between w-full bg-ink-800 hover:bg-ink-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm border border-ink-700"
        >
          <span>{il.ad} Detay Sayfası</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
