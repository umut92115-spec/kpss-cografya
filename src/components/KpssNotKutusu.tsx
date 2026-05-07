import { ReactNode } from 'react';

type KpssNotTip = 'onemli' | 'ezber' | 'soru' | 'dikkat' | 'uyari' | 'ipucu' | 'hatirlatma';

interface KpssNotProps {
  tip: KpssNotTip;
  children: ReactNode;
  baslik?: string;
}

const tipAyarlar: Record<KpssNotTip, { bg: string; border: string; icon: string; defaultBaslik: string; titleColor: string; textColor: string }> = {
  onemli: {
    bg: 'bg-kpss-yesil-bg',
    border: 'border-kpss-yesil-border',
    icon: '✅',
    defaultBaslik: 'Önemli Bilgi',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
  },
  ipucu: {
    bg: 'bg-kpss-turuncu-box-bg',
    border: 'border-kpss-turuncu-box-border',
    icon: '💡',
    defaultBaslik: 'İpucu / Mnemonic',
    titleColor: 'text-orange-800',
    textColor: 'text-orange-700',
  },
  hatirlatma: {
    bg: 'bg-kpss-mavi-bg',
    border: 'border-kpss-mavi-border',
    icon: '📌',
    defaultBaslik: 'Hatırlatma',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
  },
  dikkat: {
    bg: 'bg-kpss-kirmizi-bg',
    border: 'border-kpss-kirmizi-border',
    icon: '⚠️',
    defaultBaslik: 'Dikkat / Yanlış',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
  uyari: {
    bg: 'bg-kpss-kirmizi-bg',
    border: 'border-kpss-kirmizi-border',
    icon: '🚨',
    defaultBaslik: 'Kritik Uyarı',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
  ezber: {
    bg: 'bg-purple-50',
    border: 'border-purple-500',
    icon: '🧠',
    defaultBaslik: 'Ezber Şifresi',
    titleColor: 'text-purple-800',
    textColor: 'text-purple-700',
  },
  soru: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    icon: '❓',
    defaultBaslik: 'Çıkmış Soru Biçimi',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
  },
};

export default function KpssNotKutusu({ tip, children, baslik }: KpssNotProps) {
  // Bilinmeyen bir tip gelirse (MDX'ten kaynaklı) hata vermemesi için fallback ekliyoruz
  const ayar = tipAyarlar[tip] || tipAyarlar.onemli;
  
  return (
    <div className={`my-6 rounded-lg border-l-4 ${ayar.border} ${ayar.bg} p-4`}>
      <p className={`font-bold text-sm mb-2 flex items-center gap-2 ${ayar.titleColor}`}>
        <span>{ayar.icon}</span>
        <span>{baslik || ayar.defaultBaslik}</span>
      </p>
      <div className={`text-sm leading-relaxed ${ayar.textColor} [&>p]:mb-1 [&>ul]:list-disc [&>ul]:pl-4`}>
        {children}
      </div>
    </div>
  );
}
