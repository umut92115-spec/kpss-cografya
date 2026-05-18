import { Metadata } from "next";
import IletisimFormu from "@/components/IletisimFormu";

export const metadata: Metadata = {
  title: "İletişim — KPSS Coğrafya",
  description:
    "kpsscografya.com.tr platformu ile iletişime geçin. Soru, görüş ve önerilerinizi bize iletin.",
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Kolon: Bilgiler */}
          <div className="md:col-span-1 space-y-6">
            <h1 className="text-4xl font-black text-gray-900 leading-tight">
              Bizimle İletişime Geçin
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Platformumuz hakkında her türlü soru, öneri veya hata bildirimi için bize
              ulaşabilirsiniz.
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">E-posta</p>
                  <p className="font-bold text-gray-900">iletisim@kpsscografya.com.tr</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-2xl">🌍</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Konum</p>
                  <p className="font-bold text-gray-900">Ankara, Türkiye</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Form Bileşeni */}
          <div className="md:col-span-2">
            <IletisimFormu />
          </div>
        </div>
      </div>
    </div>
  );
}
