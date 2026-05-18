import { Konu } from "@/types";

interface KonuOzetKartiProps {
  konu: Konu;
}

const agirlikRenk: Record<string, string> = {
  yüksek: "bg-rose-50 text-rose-700 border-rose-100",
  orta: "bg-amber-50 text-amber-700 border-amber-100",
  düşük: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function KonuOzetKarti({ konu }: KonuOzetKartiProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-3xl border border-surface-100 bg-white shadow-premium mb-10 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
          {konu.icon}
        </div>
        <div>
          <h1 className="font-bold text-surface-900 text-2xl tracking-tight">{konu.baslik}</h1>
          <p className="text-sm font-medium text-surface-400 mt-1 uppercase tracking-widest">
            Kapsamlı Konu Özeti
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 relative z-10">
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-brand-50 border border-brand-100">
          <span className="text-3xl font-bold text-brand-600 leading-none">
            {konu.kpss_soru_sayisi_ort}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest leading-none mb-1">
              Ortalama
            </span>
            <span className="text-xs font-bold text-brand-700 leading-none">Soru / Yıl</span>
          </div>
        </div>

        {konu.agirlik !== "düşük" && (
          <div
            className={`flex flex-col justify-center px-6 py-3 rounded-2xl border ${agirlikRenk[konu.agirlik] || "bg-surface-50 text-surface-700 border-surface-100"}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-70">
              Sınav Ağırlığı
            </span>
            <span className="text-sm font-bold uppercase tracking-wider leading-none">
              {konu.agirlik}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
