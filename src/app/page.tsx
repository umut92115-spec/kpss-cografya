import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getAllKonular } from "@/lib/getKonuData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KPSS Coğrafya - Ücretsiz Notlar, Harita ve Soru Bankası",
  description:
    "Türkiye'nin en kapsamlı KPSS coğrafya hazırlık platformu. 10 temel konu, 81 il detayları, interaktif harita ve quiz modu ile hemen ücretsiz çalışmaya başla.",
  alternates: { canonical: "https://kpsscografya.com.tr" },
  openGraph: {
    title: "KPSS Coğrafya - Ücretsiz Notlar, Harita ve Soru Bankası",
    description:
      "Türkiye'nin en kapsamlı KPSS coğrafya hazırlık platformu. 10 temel konu, 81 il detayları, interaktif harita ve quiz modu ile hemen ücretsiz çalışmaya başla.",
    url: "https://kpsscografya.com.tr",
    siteName: "kpsscografya.com.tr",
    locale: "tr_TR",
    type: "website",
  },
  other: {
    "geo.region": "TR",
    "geo.placename": "Türkiye",
    "geo.position": "39.0;35.0",
    ICBM: "39.0, 35.0",
  },
};

const araclar = [
  {
    icon: "🗺️",
    baslik: "İnteraktif Harita",
    aciklama:
      "İl bazlı veri görselleştirme. Her konuyu Türkiye haritası üzerinde interaktif olarak keşfet.",
    href: "/harita",
    etiket: "81 İl",
    gradient: "from-blue-50 to-blue-100/50",
    iconBg: "bg-blue-100",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    icon: "✍️",
    baslik: "Quiz Modu",
    aciklama:
      "Çıkmış KPSS soruları ile kendini test et. Detaylı analiz ve skor takibi ile ilerlemeni gör.",
    href: "/quiz",
    etiket: "200+ Soru",
    gradient: "from-focus-50 to-focus-100/50",
    iconBg: "bg-focus-100",
    badge: "text-focus-700 bg-focus-50 border-focus-200",
  },
  {
    icon: "📍",
    baslik: "İl Rehberi",
    aciklama:
      "Her ilin coğrafi özelliklerini, güncel verilerini ve KPSS spesifik notlarını tek tıkla gör.",
    href: "/il",
    etiket: "81 İl",
    gradient: "from-emerald-50 to-emerald-100/50",
    iconBg: "bg-emerald-100",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
];

export default function Home() {
  const konular = getAllKonular();

  return (
    <div className="min-h-screen">
      <JsonLd
        tip="EducationalOrganization"
        veri={{
          name: "KPSS Coğrafya",
          alternateName: "kpsscografya.com.tr",
          url: "https://kpsscografya.com.tr",
          description:
            "KPSS coğrafya sınavına hazırlanan adaylar için interaktif harita ve wiki platformu.",
          inLanguage: "tr",
          areaServed: { "@type": "Country", name: "Türkiye" },
          teaches: ["KPSS Türkiye Coğrafyası", "KPSS Madenler ve Enerji", "KPSS Tarım Coğrafyası"],
        }}
      />
      <JsonLd
        tip="BreadcrumbList"
        veri={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Ana Sayfa",
              item: "https://kpsscografya.com.tr",
            },
          ],
        }}
      />

      <img
        src="/og-default.jpg"
        alt="KPSS Coğrafya Eğitim Platformu"
        width={1200}
        height={630}
        className="sr-only"
      />

      {/* HERO */}
      <section className="relative pt-16 pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top,#EFF6FF_0%,#FAFBFD_60%)] dark:bg-[radial-gradient(ellipse_at_top,#1E293B_0%,#0F172A_60%)]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-5%] right-[10%] w-72 h-72 bg-focus-200/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-focus-100/30 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white dark:bg-ink-800 border border-focus-200 dark:border-focus-700 text-focus-700 dark:text-focus-300 text-sm font-semibold shadow-sm animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-focus-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-focus-500"></span>
                </span>
                KPSS 2026 Hazırlık Platformu
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-900 dark:text-white mb-6 animate-fade-in leading-[1.1]">
                KPSS Coğrafya&apos;da{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-focus-600">Başarıyı Yakala!</span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-3 text-focus-200"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 8 Q 25 2 50 8 Q 75 14 100 8"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>

              <p
                className="text-lg sm:text-xl text-ink-500 dark:text-ink-300 max-w-xl mb-10 leading-relaxed animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                Türkiye&apos;nin en interaktif KPSS Coğrafya platformu. Haritalar, güncel veriler ve
                çıkmış sorularla sınavda fark yaratın.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <Link
                  href="/harita"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-focus-600 text-white rounded-2xl font-bold text-lg transition-all hover:bg-focus-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-focus-600/25"
                >
                  <span>Hemen Başla</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-ink-800 text-ink-800 dark:text-ink-100 border-2 border-ink-200 dark:border-ink-600 rounded-2xl font-bold text-lg transition-all hover:border-focus-200 dark:hover:border-focus-700 hover:bg-focus-50 dark:hover:bg-focus-900/20 shadow-sm"
                >
                  ✍️ Quiz&apos;e Başla
                </Link>
              </div>
            </div>

            {/* Right: Visual Card */}
            <div
              className="flex-1 max-w-md lg:max-w-lg animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-focus-200 to-glow-200 dark:from-focus-800 dark:to-glow-800 rounded-[2rem] rotate-3 opacity-40" />
                <div className="relative bg-white dark:bg-ink-800 rounded-[2rem] p-8 shadow-card border border-ink-100 dark:border-ink-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-focus-100 rounded-xl flex items-center justify-center text-xl">
                      📚
                    </div>
                    <div>
                      <p className="font-bold text-ink-900 text-sm">Günün Konusu</p>
                      <p className="text-xs text-ink-400">Türkiye Fiziki Coğrafyası</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Yer Şekilleri", progress: 85, color: "bg-focus-500" },
                      { label: "İklim & Bitki", progress: 70, color: "bg-glow-500" },
                      { label: "Akarsular", progress: 60, color: "bg-emerald-500" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-ink-600">{item.label}</span>
                          <span className="font-bold text-ink-900">{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-glow-50 rounded-xl border border-glow-200">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="text-xs font-bold text-glow-800">Haftalık Hedef</p>
                        <p className="text-[10px] text-glow-600">3/5 quiz tamamlandı</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-glow-700">60%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { val: "10", lab: "Temel Konu", icon: "📖" },
              { val: "81", lab: "İnteraktif İl", icon: "🗺️" },
              { val: "200+", lab: "Özgün Soru", icon: "✍️" },
              { val: "100%", lab: "Ücretsiz", icon: "🎁" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-5 bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 shadow-card"
              >
                <span className="text-2xl mb-2">{stat.icon}</span>
                <span className="text-3xl font-black text-ink-900 dark:text-white">{stat.val}</span>
                <span className="text-xs font-medium text-ink-400 mt-1">{stat.lab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-white dark:bg-ink-900 border-y border-ink-100 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-4">
              Neden Biz?
            </h2>
            <p className="text-lg text-ink-500 max-w-2xl mx-auto">
              Geleneksel notlardan sıkıldınız mı? Coğrafyayı sayfalardan çıkarıp haritalara
              taşıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🗺️",
                title: "Etkileşimli Harita",
                desc: "İl bazlı veri görselleştirme ile aktif öğrenme",
              },
              {
                icon: "🎬",
                title: "Detaylı Anlatım",
                desc: "Her konuyu en ince detayına kadar öğren",
              },
              { icon: "📝", title: "Güncel Testler", desc: "Çıkmış soru bankası ile pratik yap" },
              { icon: "🌍", title: "Gerçek Veri", desc: "Güncel istatistikler ve harita verileri" },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-paper-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-700 hover:border-focus-200 dark:hover:border-focus-700 hover:shadow-card-hover transition-all duration-200 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-xl border border-ink-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-ink-900 dark:text-white mb-2 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-24 study-gradient dark:bg-ink-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-4">
                Öne Çıkan Araçlar
              </h2>
              <p className="text-lg text-ink-500">
                Harita, quiz ve il rehberi ile coğrafyayı interaktif olarak öğren.
              </p>
            </div>
            <Link
              href="/harita"
              className="text-focus-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              Tüm araçları gör <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {araclar.map((arac, i) => (
              <Link
                key={i}
                href={arac.href}
                className="group p-8 rounded-3xl bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 hover:border-focus-200 dark:hover:border-focus-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-premium"
              >
                <div
                  className={`w-16 h-16 ${arac.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}
                >
                  {arac.icon}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-ink-900 dark:text-white">{arac.baslik}</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${arac.badge}`}
                  >
                    {arac.etiket}
                  </span>
                </div>
                <p className="text-ink-500 text-sm leading-relaxed mb-6">{arac.aciklama}</p>
                <div className="flex items-center gap-2 text-focus-600 font-bold text-sm group-hover:gap-3 transition-all">
                  Hemen Dene <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="py-24 bg-white dark:bg-ink-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-4">
              Müfredatın Tamamı
            </h2>
            <p className="text-lg text-ink-500 max-w-2xl mx-auto">
              KPSS Coğrafya müfredatındaki 10 temel konuyu en ince detayına kadar inceleyin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {konular.map((k) => (
              <div
                key={k.slug}
                className="group bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 p-7 hover:border-focus-200 dark:hover:border-focus-700 hover:shadow-card-hover transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl bg-focus-50 border border-focus-100/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {k.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      k.agirlik === "yüksek"
                        ? "text-rose-600 border-rose-200 bg-rose-50"
                        : k.agirlik === "orta"
                          ? "text-amber-600 border-amber-200 bg-amber-50"
                          : "text-emerald-600 border-emerald-200 bg-emerald-50"
                    }`}
                  >
                    {k.agirlik}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-2 group-hover:text-focus-700 dark:group-hover:text-focus-400 transition-colors">
                  {k.baslik}
                </h3>
                <p className="text-ink-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                  {k.aciklama}
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-ink-100">
                  <Link
                    href={`/konu/${k.slug}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-focus-600 text-white text-center text-sm font-bold hover:bg-focus-700 transition-all shadow-sm"
                  >
                    📖 Çalış
                  </Link>
                  <Link
                    href={`/harita/${k.slug}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-ink-50 text-ink-700 text-center text-sm font-bold hover:bg-ink-100 transition-colors border border-ink-100"
                  >
                    🗺️ Harita
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
