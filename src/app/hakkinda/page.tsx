import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda — KPSS Coğrafya",
  description:
    "kpsscografya.com.tr platformunun vizyonu, misyonu ve hazırlık süreci hakkında bilgi alın.",
};

export default function HakkindaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-kpss-koyu to-black p-12 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-harita-mavi rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black mb-4">Hakkımızda</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Türkiye&apos;nin en interaktif ve detaylı KPSS coğrafya hazırlık platformu.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-16 prose prose-gray max-w-none">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Biz Kimiz?</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              kpsscografya.com.tr, KPSS adaylarının coğrafya dersini sadece ezberleyerek değil,
              <strong> görerek ve keşfederek</strong> öğrenmeleri için geliştirilmiş bağımsız bir
              eğitim projesidir. Geleneksel konu anlatımlarının ötesine geçerek, her veriyi Türkiye
              haritası üzerinde canlandırıyoruz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <span className="text-4xl mb-4 block">🎯</span>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Vizyonumuz</h3>
                <p className="text-blue-800/70 text-sm leading-relaxed">
                  Coğrafya eğitiminde dijitalleşmeyi en üst seviyeye taşıyarak, her adayın
                  Türkiye&apos;nin kaynaklarını, yer şekillerini ve ekonomik potansiyelini avucunun
                  içi gibi bilmesini sağlamak.
                </p>
              </div>
              <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                <span className="text-4xl mb-4 block">🚀</span>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Misyonumuz</h3>
                <p className="text-emerald-800/70 text-sm leading-relaxed">
                  En güncel TUİK ve MTA verilerini, sınav formatına en uygun şekilde özetleyerek;
                  ücretsiz, reklamsız ve erişilebilir bir şekilde tüm adaylara sunmak.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-6">Neden kpsscografya.com.tr?</h2>
            <ul className="space-y-4 text-gray-600 list-none p-0">
              <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xl">🗺️</span>
                <div>
                  <strong className="text-gray-900 block">İnteraktif Haritalar</strong>
                  Madenlerin, tarım ürünlerinin ve sanayi tesislerinin dağılımını 81 il bazında
                  harita üzerinde görün.
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xl">💎</span>
                <div>
                  <strong className="text-gray-900 block">Süper Detay İçerik</strong>
                  Her il için özel olarak hazırlanmış, sınavda çıkma ihtimali yüksek kritik
                  noktalar.
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xl">✍️</span>
                <div>
                  <strong className="text-gray-900 block">Modern Quiz Deneyimi</strong>
                  Konuları öğrendikten sonra hemen kendinizi test edebileceğiniz yapay zeka destekli
                  soru bankası.
                </div>
              </li>
            </ul>

            <div className="mt-16 p-8 bg-gray-900 rounded-[32px] text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Hazırsan Başlayalım</h3>
              <p className="text-gray-400 mb-8">
                Hemen bir konu seç ve Türkiye&apos;yi keşfetmeye başla.
              </p>
              <Link
                href="/konu"
                className="inline-block bg-harita-mavi hover:bg-harita-mavi-dark text-white font-black py-4 px-10 rounded-2xl transition-all transform hover:scale-105"
              >
                Konulara Göz At →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
