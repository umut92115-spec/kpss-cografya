import { Il, IlKonuData } from "@/types";
import Link from "next/link";

interface IlPaneliProps {
  il: Il | null;
  konuData: IlKonuData | null;
}

export default function IlPaneli({ il, konuData }: IlPaneliProps) {
  if (!il) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-xl border border-slate-100 animate-fade-in">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
          <span className="text-5xl opacity-40">📍</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Keşfetmeye Hazır mısın?</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
          Detaylı coğrafya analizlerini ve KPSS notlarını görmek için haritadan bir şehir seçin.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slide-down">
      {/* Üst Bilgi Alanı */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{il.ad}</h2>
          <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-md">
            {il.plaka}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold uppercase tracking-wider text-[10px]">
            <span className="text-sm">🌍</span> {il.bolge}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium italic">Türkiye&apos;nin İncisi</span>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        {konuData ? (
          <div className="space-y-8">
            {/* Maden Bilgisi */}
            {"maden_turleri" in konuData && (
              <div className="animate-fade-in delay-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⛏️</span>
                  <h3 className="font-bold text-slate-800 uppercase tracking-wide text-xs">
                    Yeraltı Zenginlikleri
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {konuData.maden_turleri.map((m) => (
                    <span
                      key={m}
                      className="px-4 py-1.5 bg-amber-50 text-amber-900 border border-amber-100 rounded-xl text-sm font-bold shadow-sm"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tarım Bilgisi */}
            {"ana_urunler" in konuData && (
              <div className="animate-fade-in delay-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🌾</span>
                  <h3 className="font-bold text-slate-800 uppercase tracking-wide text-xs">
                    Öne Çıkan Üretim
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {konuData.ana_urunler.map((m) => (
                    <span
                      key={m}
                      className="px-4 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-sm font-bold shadow-sm"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Kritik Not */}
            {"onemli_not" in konuData && konuData.onemli_not && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fade-in delay-300">
                <h3 className="font-bold text-slate-700 mb-1 text-xs uppercase tracking-widest">
                  Coğrafi Not
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{konuData.onemli_not}</p>
              </div>
            )}

            {/* KPSS Vurgusu */}
            {konuData.kpss_notu && (
              <div className="bg-orange-500 text-white p-5 rounded-2xl shadow-lg shadow-orange-100 relative overflow-hidden group animate-fade-in delay-400">
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-500">
                  🎓
                </div>
                <h4 className="font-black text-sm mb-2 flex items-center gap-2 uppercase tracking-tighter">
                  <span className="bg-white text-orange-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                    !
                  </span>
                  KPSS Odaklı Bilgi
                </h4>
                <p className="text-sm font-medium leading-relaxed drop-shadow-sm">
                  {konuData.kpss_notu}
                </p>
              </div>
            )}

            {/* Nasıl Sorulur? */}
            {"sik_soru" in konuData && konuData.sik_soru && (
              <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg shadow-blue-100 relative overflow-hidden group animate-fade-in delay-500">
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-500">
                  ❓
                </div>
                <h4 className="font-black text-sm mb-2 flex items-center gap-2 uppercase tracking-tighter">
                  Soru Potansiyeli
                </h4>
                <p className="text-sm font-medium leading-relaxed italic drop-shadow-sm">
                  &quot;{konuData.sik_soru}&quot;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-3xl p-8 text-center bg-slate-50/50">
            <span className="text-3xl mb-3 grayscale opacity-50">📑</span>
            Bu konu başlığında {il.ad} için henüz spesifik bir veri kaydedilmedi.
          </div>
        )}
      </div>

      <div className="p-6 mt-auto bg-slate-50/80 backdrop-blur-sm border-t border-slate-100">
        <Link
          href={`/${il.bolge_slug}bolgesi/il/${il.slug}`}
          className="group flex items-center justify-between w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-200"
        >
          <span className="tracking-tight">{il.ad} Şehir Rehberi</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}
