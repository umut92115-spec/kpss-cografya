import Link from 'next/link';
import { getAllIller } from '@/lib/getIlData';
import { getAllKonular } from '@/lib/getKonuData';

interface IlgiliBaglantilarProps {
  tip: 'il' | 'konu' | 'quiz' | 'makale';
  slug: string;
}

export default function IlgiliBaglantilar({ tip, slug }: IlgiliBaglantilarProps) {
  const konular = getAllKonular();
  const iller = getAllIller();

  if (tip === 'il') {
    const il = iller.find(i => i.slug === slug);
    const bolgeUrl = il ? `${il.bolge_slug}bolgesi` : '';

    return (
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">Bu İli Diğer Konularda İncele</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {konular.map(k => (
            <Link 
              key={k.slug} 
              href={`/${bolgeUrl}/il/${slug}/${k.slug}`} 
              className="flex items-center gap-2 text-sm bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-lg">{k.icon}</span>
              <div className="flex flex-col">
                <span className="font-bold">{il?.ad} {k.kisa_baslik} Analizi</span>
                <span className="text-[10px] text-gray-400 uppercase">Süper Detay →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (tip === 'konu') {
    // Konu sayfası -> İlgili 81 il listesi (o konu bazında)
    return (
      <div className="mt-12">
        <h3 className="font-bold text-gray-800 text-xl mb-4 border-b pb-2">İllere Göre {slug.replace(/-/g, ' ')}</h3>
        <p className="text-gray-500 text-sm mb-6">Bu konuyu Türkiye&apos;nin 81 ilinde özel notlar ve haritalarla incele:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {iller.map(il => (
            <Link 
              key={il.slug} 
              href={`/${il.bolge_slug}bolgesi/il/${il.slug}/${slug}`} 
              className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-100 rounded-lg px-3 py-2 transition-all flex items-center justify-between group"
            >
              <span>{il.ad}</span>
              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/konu" className="text-blue-600 hover:underline font-bold text-sm">
            ← Tüm Konulara Göz At
          </Link>
        </div>
      </div>
    );
  }

  if (tip === 'quiz') {
    // Quiz sayfası -> İlgili konu
    return (
      <div className="mt-6 text-center">
        <Link href={`/konu/${slug}`} className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">
          Geri Dön: İlgili Konu Anlatımı
        </Link>
      </div>
    );
  }

  if (tip === 'makale') {
    // Makale sayfası -> Konulara bağla
    return (
      <div className="mt-10 p-6 bg-blue-50 rounded-xl">
        <h3 className="font-bold text-blue-900 mb-3">Çalışmaya Devam Et</h3>
        <div className="flex flex-col gap-2">
          {konular.slice(0, 3).map(k => (
            <Link key={k.slug} href={`/konu/${k.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">
              → {k.baslik}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
