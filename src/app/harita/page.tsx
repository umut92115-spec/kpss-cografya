import { Metadata } from "next";
import Link from "next/link";
import { getAllKonular, getKonu } from "@/lib/getKonuData";
import { getKonuMatris, getAllIller } from "@/lib/getIlData";
import HaritaIcerik from "./[konu]/HaritaIcerik";
import JsonLd from "@/components/JsonLd";
import { Map, BookOpen, Compass, HelpCircle, ChevronRight, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "KPSS İnteraktif Harita Çalışması 2026 — Dilsiz Harita Atlası",
  description:
    "Türkiye'nin en kapsamlı interaktif KPSS Coğrafya harita platformu. Dilsiz haritalar, madenler, tarım ürünleri ve fiziki yer şekillerini görsel hafıza teknikleriyle ezberleyin.",
  keywords: [
    "kpss coğrafya harita çalışması",
    "kpss coğrafya dilsiz harita",
    "kpss interaktif harita",
    "türkiye dilsiz harita kpss",
    "kpss coğrafya dilsiz harita çalışması",
    "kpss coğrafya haritalarla öğrenme",
    "türkiye maden haritası interaktif",
    "kpss coğrafya harita görselleştirme",
    "kpss coğrafya dilsiz harita doldurma",
    "kpss coğrafya harita soruları",
    "ösym coğrafya harita çalışma rehberi",
    "kpss coğrafya harita pdf",
    "kpss dilsiz harita pdf",
  ],
  alternates: {
    canonical: "https://kpsscografya.com.tr/harita",
  },
  openGraph: {
    title: "KPSS İnteraktif Harita Çalışması — Görsel Hafıza Atlası",
    description:
      "Türkiye coğrafyasını interaktif dilsiz haritalarla keşfedin. KPSS coğrafya konularını görsel hafızanıza kazıyarak sınavda fark atın.",
    url: "https://kpsscografya.com.tr/harita",
    siteName: "kpsscografya.com.tr",
    locale: "tr_TR",
    type: "website",
    images: ["/og-default.jpg"],
  },
};

export default function HaritaPage() {
  const tumKonular = getAllKonular();
  const varsayilanKonu = tumKonular[0];
  const konuMeta = getKonu(varsayilanKonu.slug)!;
  const matrisData = getKonuMatris(varsayilanKonu.slug);
  const iller = getAllIller();

  // SSS listesi
  const sssListesi = [
    {
      soru: "KPSS Coğrafyada harita çalışması neden önemlidir?",
      cevap:
        "KPSS coğrafya sınavında her yıl doğrudan harita yorumlama ve konum bilgisi gerektiren ortalama 4-6 soru çıkmaktadır. Dağlar, madenler, sanayi tesisleri ve tarım ürünlerinin dağılışını dilsiz harita üzerinde çalışmak, teorik bilgilerin görsel hafızaya kodlanmasını sağlayarak sınavda hata payını sıfıra indirir.",
    },
    {
      soru: "Dilsiz harita doldurma yöntemi nasıl uygulanır?",
      cevap:
        "Dilsiz harita yöntemi, coğrafi unsurları boş bir Türkiye haritası üzerinde konumlandırma çalışmasıdır. İnteraktif platformumuzda her ili tek tek tıklayarak o ile ait maden, tarım ve yer şekli verilerini görebilir; böylece dilsiz haritaları zihninizde interaktif olarak doldurabilirsiniz.",
    },
    {
      soru: "Sınavda en çok hangi harita konuları çıkıyor?",
      cevap:
        "ÖSYM son yıllarda özellikle Türkiye'deki madenler ve enerji kaynakları, sanayi tesisleri, tarımsal üretim havzaları, dağlar ile milli parklar ve turizm alanları haritalarına büyük önem vermektedir. Platformumuzda bu konuların tamamı güncel TÜİK verileriyle interaktif harita olarak sunulmaktadır.",
    },
  ];

  return (
    <>
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
            {
              "@type": "ListItem",
              position: 2,
              name: "Haritalar",
              item: "https://kpsscografya.com.tr/harita",
            },
          ],
        }}
      />
      <JsonLd
        tip="FAQPage"
        veri={{
          mainEntity: sssListesi.map((sss) => ({
            "@type": "Question",
            name: sss.soru,
            acceptedAnswer: {
              "@type": "Answer",
              text: sss.cevap,
            },
          })),
        }}
      />

      <div className="bg-ink-900 min-h-screen text-white">
        {/* İnteraktif Harita Uygulaması */}
        <HaritaIcerik
          konuMeta={konuMeta}
          tumKonular={tumKonular}
          matrisData={matrisData}
          iller={iller}
        />

        {/* ─── Premium SEO & GEO Akademik Kılavuz Alanı ─── */}
        <section className="bg-ink-950 border-t border-ink-800 py-16 px-6 lg:px-12 select-none">
          <div className="max-w-6xl mx-auto">
            {/* H1 Başlık & Giriş */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 mb-4 border border-blue-800/40">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                KPSS 2026 Coğrafya Eğitim Kılavuzu
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent leading-tight">
                KPSS Coğrafya İnteraktif Harita Çalışma Atlası
              </h1>
              <p className="mt-4 text-ink-400 text-sm md:text-base leading-relaxed">
                KPSS Lisans, Önlisans ve Ortaöğretim sınavlarına hazırlanan adaylar için özel olarak
                geliştirilmiş
                <strong> Türkiye Dilsiz Harita Atlası</strong>. Haritalar, coğrafya dersinde
                ezberden ziyade mekânsal ilişkileri ve görsel kodlamayı öne çıkarır.
              </p>
            </div>

            {/* Metot Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="p-6 rounded-2xl bg-ink-900/40 border border-ink-800 hover:border-blue-500/30 transition-all">
                <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  1. Coğrafi Dilsiz Harita Metodu
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  Şehir sınırlarını ve coğrafi bölgeleri boş bir şablon üzerinde görerek, sınavda
                  çıkabilecek yer şekillerinin, nehirlerin ve dağların tam konumlarını görsel
                  hafızanıza işleyin.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-ink-900/40 border border-ink-800 hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. İl Bazlı Akıllı Analiz</h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  Harita üzerinde 81 ile tıklayarak o ile özel tarım, maden, ulaşım ve kpss
                  notlarını yan panelde görüntüleyin. Sıfır halüsinasyon, tamamen MEB ve ÖSYM
                  müfredatına uygun veri süzgeci.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-ink-900/40 border border-ink-800 hover:border-violet-500/30 transition-all">
                <div className="w-10 h-10 bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-400 mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. Görsel Hafıza & Quiz Modu</h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  Görsel şemalarla zenginleştirilmiş atlas çalışmalarını tamamladıktan sonra Quiz
                  Moduna geçerek kendinizi sınayın, skorunuzu takip edin ve sınav heyecanını yerel
                  testlerle yenin.
                </p>
              </div>
            </div>

            {/* Ünite İndeksi (Crawlers İçin İç Link Yapısı) */}
            <div className="p-8 rounded-3xl bg-ink-900/20 border border-ink-800 mb-16">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📚</span> KPSS Harita Konuları İndeksi
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tumKonular.map((k) => (
                  <Link
                    key={k.slug}
                    href={`/harita/${k.slug}`}
                    className="p-3.5 rounded-xl bg-ink-900/50 hover:bg-ink-900 hover:border-blue-500/40 border border-ink-800/80 flex items-center justify-between text-xs font-semibold text-ink-200 transition-all"
                  >
                    <span className="truncate">{k.baslik}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-500 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Sıkça Sorulan Sorular (SSS) */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-indigo-400" />
                Sıkça Sorulan Sorular (SSS)
              </h2>
              <div className="space-y-4">
                {sssListesi.map((sss, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-ink-900/30 border border-ink-850 hover:border-ink-800 transition-colors"
                  >
                    <h3 className="text-sm md:text-base font-bold text-ink-100 mb-2 flex items-start gap-2">
                      <span className="text-indigo-400 font-mono">Q.</span>
                      <span>{sss.soru}</span>
                    </h3>
                    <p className="text-xs md:text-sm text-ink-400 leading-relaxed pl-6">
                      {sss.cevap}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
