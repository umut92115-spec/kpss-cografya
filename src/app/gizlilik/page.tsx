
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — KPSS Coğrafya',
  description: 'kpsscografya.com.tr gizlilik politikası ve veri güvenliği hakkında bilgilendirme.',
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-16 prose prose-gray max-w-none">
            <h1 className="text-4xl font-black text-gray-900 mb-8">Gizlilik Politikası</h1>
            <p className="text-gray-500 text-sm italic mb-12">Son Güncelleme: 3 Mayıs 2026</p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Veri Toplama</h2>
              <p className="text-gray-600 leading-relaxed">
                kpsscografya.com.tr, platformu kullanırken kullanıcılarından herhangi bir üyelik veya kişisel veri talep etmez. 
                Platformumuz tamamen açık kaynaklı ve ücretsiz bir eğitim projesidir.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Çerezler (Cookies)</h2>
              <p className="text-gray-600 leading-relaxed">
                Platform deneyiminizi iyileştirmek, kullanım istatistiklerini analiz etmek ve tercihlerini hatırlamak (örneğin karanlık mod tercihi veya quiz skorları) 
                amacıyla tarayıcı çerezleri kullanılabilir. Bu çerezler kişisel kimlik bilgilerini içermez.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Üçüncü Taraf Bağlantıları</h2>
              <p className="text-gray-600 leading-relaxed">
                Sitemiz içerisinde diğer web sitelerine (örneğin ÖSYM, MEB veya haber siteleri) bağlantılar bulunabilir. 
                Bu sitelerin gizlilik politikalarından kpsscografya.com.tr sorumlu tutulamaz.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Veri Güvenliği</h2>
              <p className="text-gray-600 leading-relaxed">
                Toplanan anonim trafik verileri, güvenli sunucularımızda saklanmakta ve sadece site performansını artırmak amacıyla kullanılmaktadır. 
                Verileriniz hiçbir şekilde üçüncü şahıs veya kurumlarla paylaşılmaz veya satılmaz.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. İletişim</h2>
              <p className="text-gray-600 leading-relaxed">
                Gizlilik politikamız ile ilgili sorularınız için bizimle <a href="/iletisim" className="text-blue-600 hover:underline">iletişim sayfası</a> üzerinden irtibata geçebilirsiniz.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm">
                Bu platform, eğitimde fırsat eşitliği ilkesiyle tüm KPSS adaylarına ücretsiz sunulmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
