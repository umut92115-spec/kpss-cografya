import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı — 404 | kpsscografya.com',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Sayfa Bulunamadı</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Aradığınız sayfaya ulaşılamıyor. URL&apos;yi yanlış yazmış olabilir veya sayfa kaldırılmış olabilir.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
        >
          Ana Sayfa
        </Link>
        <Link 
          href="/harita/madenler-enerji" 
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
        >
          İnteraktif Harita
        </Link>
        <Link 
          href="/konu/madenler-enerji" 
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
        >
          Konular
        </Link>
      </div>
    </div>
  );
}
