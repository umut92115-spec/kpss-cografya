import { Konu } from '@/types';

interface KonuOzetKartiProps {
  konu: Konu;
}

const agirlikRenk: Record<string, string> = {
  'yüksek': 'bg-red-100 text-red-800 border-red-300',
  'orta':   'bg-yellow-100 text-yellow-800 border-yellow-300',
  'düşük':  'bg-green-100 text-green-800 border-green-300',
};

export default function KonuOzetKarti({ konu }: KonuOzetKartiProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm mb-8">
      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
        <span className="text-4xl">{konu.icon}</span>
        <div>
          <h2 className="font-bold text-gray-900 text-lg leading-tight">{konu.baslik}</h2>
          <p className="text-sm text-gray-500 mt-0.5">Konu özet kartı</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="text-center px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{konu.kpss_soru_sayisi_ort}</p>
          <p className="text-xs text-blue-600 whitespace-nowrap">Ort. Soru/Yıl</p>
        </div>

        <div className={`text-center px-4 py-2 rounded-lg border ${agirlikRenk[konu.agirlik] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          <p className="text-sm font-bold uppercase tracking-wider">{konu.agirlik}</p>
          <p className="text-xs opacity-80">Sınav Ağırlığı</p>
        </div>
      </div>
    </div>
  );
}
