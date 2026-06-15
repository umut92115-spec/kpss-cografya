/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamicParams = false;
import { Metadata } from "next";
import { getKonu, getAllKonular } from "@/lib/getKonuData";
import { getKonuMatris, getAllIller } from "@/lib/getIlData";
import { notFound } from "next/navigation";
import HaritaIcerik from "./HaritaIcerik";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { MapPin, Compass, BookOpen, HelpCircle, ChevronLeft, Table } from "lucide-react";
import { fetchPublicData } from "@/lib/fetchData";

export async function generateStaticParams() {
  const konular = await getAllKonular();
  return konular.map((konu) => ({
    konu: topicSlugCorrection(konu.slug),
  }));
}

// Slugs mapping helper
function topicSlugCorrection(slug: string): string {
  return slug;
}

// Konu bazlı zengin anahtar kelime eşleşmesi (LSI Keywords)
const LSI_KEYWORDS: Record<string, string[]> = {
  "cografi-konum": [
    "kpss coğrafi konum haritası",
    "türkiye enlem boylam haritası kpss",
    "türkiye uç noktaları harita",
    "kpss yerel saat hesaplama haritası",
    "kpss coğrafya harita çalışması",
    "türkiye dilsiz harita coğrafi konum",
    "ösym coğrafi konum soruları",
  ],
  "jeolojik-yapi": [
    "kpss deprem haritası",
    "türkiye fay hatları haritası kpss",
    "kpss jeolojik yapısı ve depremler",
    "türkiye masif arazileri haritası kpss",
    "kpss dilsiz harita fay hatları",
    "türkiye deprem tehlike haritası kpss",
  ],
  daglar: [
    "türkiye dağlar haritası kpss",
    "kpss dağlar dilsiz harita",
    "kpss volkanik dağlar haritası",
    "türkiye tektonik dağları haritası",
    "kpss kırıklı dağlar harita çalışması",
    "türkiye kıvrımlı dağları haritası kpss",
    "kpss orojenez dağları dilsiz harita",
  ],
  goller: [
    "türkiye göller haritası kpss",
    "kpss göller dilsiz harita",
    "türkiye heyelan set gölleri haritası",
    "kpss karstik göller haritası",
    "kpss tektonik göller harita çalışması",
    "türkiye doğal gölleri kpss",
    "kpss volkanik set gölleri harita",
  ],
  akarsular: [
    "türkiye akarsular haritası kpss",
    "kpss akarsular dilsiz harita",
    "türkiye barajlar haritası kpss",
    "kpss akarsu havzaları haritası",
    "kpss en uzun akarsu haritası",
    "türkiye nehirleri ve barajları kpss",
    "kpss açık ve kapalı havzalar harita",
  ],
  "yer-sekilleri": [
    "türkiye yer şekilleri haritası kpss",
    "kpss ovalar ve platolar haritası",
    "türkiye platoları haritası kpss",
    "kpss karstik şekiller haritası",
    "türkiye dilsiz ova haritası",
    "kpss yer şekilleri dilsiz harita",
  ],
  "kiyi-tipleri": [
    "türkiye kıyı tipleri haritası kpss",
    "kpss kıyı tipleri harita çalışması",
    "türkiye falez haritası kpss",
    "boyuna enine kıyı tipleri kpss",
    "ria tipi kıyı türkiye haritası",
    "dalmaçya kıyı tipi türkiye",
  ],
  "iklim-bitki": [
    "türkiye iklim haritası kpss",
    "türkiye bitki örtüsü haritası kpss",
    "kpss iklim tipleri harita",
    "türkiye yağış dağılışı haritası kpss",
    "kpss mikroklima alanları haritası",
    "türkiye rüzgarlar haritası kpss",
  ],
  "toprak-cevre": [
    "türkiye toprak haritası kpss",
    "kpss toprak tipleri haritası",
    "türkiye erozyon ve heyelan haritası",
    "kpss çevre sorunları haritası",
    "türkiye dilsiz toprak haritası",
  ],
  "beseri-cografya": [
    "türkiye nüfus yoğunluğu haritası kpss",
    "kpss seyrek nüfuslu yerler haritası",
    "kpss yoğun nüfuslu bölgeler haritası",
    "türkiye göç haritası kpss",
    "kpss yerleşmeler harita çalışması",
  ],
  "nufus-politikalari": [
    "kpss nüfus politikaları haritası",
    "türkiye nüfus artış hızı haritası",
    "kpss demografi harita çalışması",
    "türkiye göç ve nüfus haritaları",
  ],
  tarim: [
    "türkiye tarım haritası kpss",
    "kpss tarım ürünleri haritası",
    "kpss zeytin pamuk tütün haritası",
    "türkiye intansif tarım haritası",
    "kpss tarım dilsiz harita çalışması",
  ],
  "madenler-enerji": [
    "türkiye madenler haritası kpss",
    "kpss madenler ve enerji kaynakları",
    "türkiye bor demir bakır haritası",
    "kpss termik santraller haritası",
    "kpss rüzgar ve güneş enerjisi haritası",
  ],
  sanayi: [
    "türkiye sanayi haritası kpss",
    "kpss sanayi tesisleri haritası",
    "kpss petrol rafinerileri haritası",
    "türkiye kağıt ve şeker fabrikaları",
    "kpss sanayi dilsiz harita çalışması",
  ],
  ulasim: [
    "türkiye geçitler ve tüneller haritası kpss",
    "kpss demiryolu ağları haritası",
    "türkiye otoyol ve limanlar haritası",
    "kpss ulaşım coğrafyası haritası",
    "kpss önemli geçitler dilsiz harita",
  ],
  ticaret: [
    "türkiye iç ve dış ticaret haritası",
    "kpss serbest bölgeler haritası",
    "türkiye ithalat ihracat limanları",
    "kpss ticaret merkezleri haritası",
  ],
  turizm: [
    "türkiye unesco mirasları haritası kpss",
    "kpss turizm harita çalışması",
    "türkiye milli parklar haritası kpss",
    "kpss kış ve termal turizm haritası",
    "türkiye turizm değerleri haritası",
  ],
  "bolge-jeopolitik": [
    "türkiye coğrafi bölgeleri haritası kpss",
    "kpss jeopolitik konum haritası",
    "türkiye sınır komşuları haritası",
    "kpss bölgeler dilsiz harita",
  ],
  "kalkinma-projeleri": [
    "kpss kalkınma projeleri haritası",
    "kpss gap kop dap dokap zbk",
    "türkiye bölgesel kalkınma haritası",
    "kpss dilsiz harita bölgesel kalkınma",
  ],
  "sinir-kapilari": [
    "türkiye sınır kapıları haritası kpss",
    "kpss sınır kapıları ve demiryolları",
    "türkiye aktif sınır kapıları haritası",
    "kpss dilsiz sınır kapıları çalışması",
  ],
};

// Konuya göre Sıkça Sorulan Sorular üreten fonksiyon
function getFaqsByTopic(slug: string, baslik: string): { soru: string; cevap: string }[] {
  const mapping: Record<string, { soru: string; cevap: string }[]> = {
    daglar: [
      {
        soru: "Türkiye'deki dağlar nasıl oluşmuştur?",
        cevap:
          "Türkiye'deki dağlar temel olarak orojenez (kıvrımlı ve kırıklı dağ oluşumu) ve volkanizma hareketleriyle şekillenmiştir. Tetis Jeosenklinalinde biriken tortullar Arap ve Avrasya levhalarının sıkıştırmasıyla kıvrılarak Torosları ve Kuzey Anadolu Dağlarını oluşturmuştur. Sert kütleler ise kırılarak horst-graben sistemini (Ege dağları) oluştururken, yer kabuğunun zayıf noktalarından çıkan lavlar volkanik dağlarımızı meydana getirmiştir.",
      },
      {
        soru: "Türkiye'nin en yüksek dağı hangisidir ve kökeni nedir?",
        cevap:
          "Türkiye'nin en yüksek noktası 5.137 metre yüksekliğiyle Doğu Anadolu Bölgesi'nde yer alan Ağrı Dağı'dır (Büyük Ağrı). Ağrı Dağı, jeolojik köken olarak sönmüş bir stratovulkandır (volkanik dağdır).",
      },
      {
        soru: "Ege Bölgesi'ndeki kırık dağlar hangileridir?",
        cevap:
          "Ege Bölgesi'nde yanal basınçlarla kırılarak yükselen bloklara horst (dağ) denir. Kuzeyden güneye doğru kırık dağlarımız sırasıyla: Kaz Dağları, Madra Dağı, Yunt Dağları, Bozdağlar, Aydın Dağları ve Menteşe Dağları'dır. Akdeniz'deki Nur (Amanos) Dağları da kırıklı yapıdadır.",
      },
    ],
    akarsular: [
      {
        soru: "Türkiye akarsularının genel özellikleri nelerdir?",
        cevap:
          "Türkiye akarsuları, ülkemizin genç, engebeli ve yüksek arazi yapısı nedeniyle yüksek akış hızına, fazla aşındırma gücüne ve yüksek hidroelektrik enerji potansiyeline sahiptir. Boyları genellikle kısadır, rejimleri düzensizdir (yağış rejimine bağlı olarak) ve ulaşıma elverişli değildirler (Bartın Çayı alt çığırı hariç).",
      },
      {
        soru: "Denge profili nedir ve nehirlerimiz neden buna uzaktır?",
        cevap:
          "Denge profili, bir akarsuyun yatağını deniz seviyesine kadar aşındırarak dümdüz ve pürüzsüz hale getirmesidir. Türkiye yakın jeolojik zamanda (4. Zaman başı - Kuvaterner) toptan yükseldiği (epirojenez) için akarsularımız deniz seviyesine uzaktır ve yatakları derindedir. Bu yüzden denge profiline ulaşmamışlardır.",
      },
      {
        soru: "Türkiye'nin en uzun akarsuyu hangisidir?",
        cevap:
          "Tamamı Türkiye sınırları içinde kalan en uzun akarsu 1.355 km uzunluğuyla Kızılırmak'tır. Sınırlarımızdan doğup yurt dışında denize dökülen en uzun akarsu ise Fırat Nehri'dir.",
      },
    ],
    "madenler-enerji": [
      {
        soru: "Türkiye'de maden çeşitliliğinin en fazla olduğu yer neresidir?",
        cevap:
          "Türkiye'de maden çeşitliliği ve rezervinin en zengin olduğu coğrafi bölge Doğu Anadolu Bölgesi, il bazında ise Elazığ'dır. Özellikle Yukarı Fırat Bölümü, farklı jeolojik zamanlara ait kayaçların bir arada bulunması nedeniyle maden yatağı cennetidir.",
      },
      {
        soru: "Bor madeni nerelerden çıkarılır ve neden stratejiktir?",
        cevap:
          "Bor madeni, dünya rezervlerinin %70'inden fazlasının Türkiye'de bulunduğu çok yönlü bir endüstriyel hammaddedir. Başlıca çıkarım alanları: Balıkesir (Bigadiç, Susurluk), Kütahya (Emet), Eskişehir (Kırka) ve Bursa (Mustafakemalpaşa) çevresidir.",
      },
      {
        soru: "Türkiye'nin yerli enerji kaynakları nelerdir?",
        cevap:
          "Türkiye'nin yerli ve yenilenebilir enerji kaynakları; hidroelektrik (akarsular), rüzgar (RES), güneş (GES), jeotermal (sıcak su kaynakları) ve biyokütledir. Fosil kaynak olarak ise yaygın yerli kaynağımız 3. Zaman kökenli olan Linyit kömürüdür.",
      },
    ],
  };

  const defaultFaqs = [
    {
      soru: `KPSS Coğrafyada Türkiye ${baslik} konusu neden önemlidir?`,
      cevap: `Türkiye ${baslik} konusu, KPSS Coğrafya müfredatında her yıl en az 1-2 sorunun doğrudan geldiği kritik bir ünitedir. İnteraktif haritamız ile bu konuyu görselleştirerek konum bilgilerini kalıcı hale getirebilirsiniz.`,
    },
    {
      soru: "Harita üzerindeki illere tıkladığımda hangi bilgilere erişebilirim?",
      cevap:
        "Harita üzerinde istediğiniz bir ilin sınırına tıkladığınızda, sağ panelde o ile özel KPSS ders notları, sınav ipuçları, soru çıkma ihtimali yüksek coğrafi terimler ve ilişkili veriler anında listelenir.",
    },
    {
      soru: "Bu haritalardaki veriler güncel midir?",
      cevap:
        "Evet, platformumuzdaki tüm tarım, maden, sanayi ve nüfus verileri TÜİK, MTA, DSİ ve Harita Genel Müdürlüğü'nün en güncel akademik raporlarından derlenerek güncellenmektedir.",
    },
  ];

  return mapping[slug] || defaultFaqs;
}

export async function generateMetadata({
  params,
}: {
  params: { konu: string };
}): Promise<Metadata> {
  const konu = await getKonu(params.konu);
  if (!konu) return {};

  const dynamicKeywords = [
    `türkiye ${konu.baslik.toLowerCase()} haritası kpss`,
    `kpss coğrafya ${konu.kisa_baslik.toLowerCase()} harita çalışması`,
    `kpss ${konu.kisa_baslik.toLowerCase()} dilsiz harita`,
    "türkiye dilsiz harita kpss",
    ...(LSI_KEYWORDS[params.konu] || []),
  ];

  return {
    title: `Türkiye ${konu.baslik} Haritası — KPSS | kpsscografya.com.tr`,
    description: `KPSS coğrafya ${konu.kisa_baslik.toLowerCase()} konusu: Türkiye'nin il bazlı interaktif haritası. Her ile tıkla, dilsiz harita üstünde görsel hafızayla hazırlan.`,
    keywords: dynamicKeywords,
    alternates: {
      canonical: `https://kpsscografya.com.tr/harita/${konu.slug}`,
    },
    openGraph: {
      title: `Türkiye ${konu.baslik} Haritası — KPSS`,
      description: `KPSS coğrafya ${konu.kisa_baslik.toLowerCase()} konusu interaktif dilsiz harita atlası. Sınav odaklı il analizleri ve akademik soru tahminleri.`,
      url: `https://kpsscografya.com.tr/harita/${konu.slug}`,
      siteName: "kpsscografya.com.tr",
      locale: "tr_TR",
      type: "website",
    },
    other: {
      "geo.region": "TR",
      "geo.placename": "Türkiye",
    },
  };
}

export default async function HaritaKonuPage({ params }: { params: { konu: string } }) {
  const konuMeta = await getKonu(params.konu);
  if (!konuMeta) notFound();

  const matrisData = await getKonuMatris(params.konu);
  const tumKonular = await getAllKonular();
  const iller = await getAllIller();

  // Leaflet detaylı nokta verisini sunucu tarafında okuma (SEO tablosu için)
  interface LeafletNokta {
    isim?: string;
    sira_dag?: string;
    dokulduğu_yer?: string;
    kategori?: string;
    yukseklik_m?: number;
    uzunluk_km?: number;
    notlar?: string;
  }
  interface LeafletData {
    noktalar?: LeafletNokta[];
  }
  const leafletData = await fetchPublicData<LeafletData>(`data/leaflet/${params.konu}.json`);
  const haritaNoktalari: LeafletNokta[] = leafletData?.noktalar || [];

  const sssListesi = getFaqsByTopic(params.konu, konuMeta.baslik);

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
            {
              "@type": "ListItem",
              position: 3,
              name: konuMeta.baslik,
              item: `https://kpsscografya.com.tr/harita/${konuMeta.slug}`,
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

      <div className="bg-ink-900 min-h-screen text-white flex flex-col">
        {/* İnteraktif Harita Uygulaması (Client Component) */}
        <div className="flex-1">
          <HaritaIcerik
            konuMeta={konuMeta}
            tumKonular={tumKonular}
            matrisData={matrisData}
            iller={iller}
          />
        </div>

        {/* ─── Premium SEO & GEO Akademik Kılavuz Alanı ─── */}
        <section className="bg-ink-950 border-t border-ink-800 py-16 px-6 lg:px-12 select-none">
          <div className="max-w-5xl mx-auto">
            {/* Navigasyon / Geri Dönüş */}
            <div className="mb-8">
              <Link
                href="/harita"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-450 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Harita Atlası Ana Sayfası
              </Link>
            </div>

            {/* H1 Başlık & Giriş */}
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/40 text-indigo-300 mb-4 border border-indigo-800/40">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                KPSS Coğrafya Akademik Sınav Rehberi
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent leading-tight">
                Türkiye {konuMeta.baslik} Haritası ve Çalışma Kılavuzu
              </h1>
              <p className="mt-4 text-ink-400 text-sm md:text-base leading-relaxed">
                KPSS coğrafya müfredatındaki <strong>{konuMeta.baslik.toLowerCase()}</strong>{" "}
                konusunu, ÖSYM standartlarındaki dilsiz harita teknikleriyle ezberleyin. Aşağıdaki
                akademik özet, coğrafi indeks ve SSS kartları, görsel harita çalışmanızı
                pekiştirecek ve sınavda doğrudan net artışı sağlayacaktır.
              </p>
            </div>

            {/* Konu Özeti / Çalışma Tavsiyesi */}
            <div className="p-6 rounded-2xl bg-ink-900/40 border border-ink-800 mb-12 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Dilsiz Harita Çalışma İpuçları (Görsel Hafıza)
              </h2>
              <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                ÖSYM, coğrafya sorularında çoğunlukla dilsiz Türkiye haritası üzerinde
                numaralandırılmış bölgeleri kullanarak sorgulama yapar. Yukarıdaki interaktif
                haritamızda her bir il sınırına dokunarak o bölgedeki coğrafi varlığı (maden
                türleri, tarım havzaları veya dağ oluşumları) inceleyin. Zihninizde harita
                koordinatları oluşturmak, teorik bilgilerin sınav anında çok daha hızlı
                hatırlanmasını sağlar.
              </p>
            </div>

            {/* Coğrafi Noktalar İndeksi (GEO / Arama Botları İçin Statik Tablo) */}
            {haritaNoktalari.length > 0 && (
              <div className="p-6 rounded-3xl bg-ink-900/20 border border-ink-800 mb-12">
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Table className="w-5 h-5 text-blue-400" />
                  Harita Coğrafi Noktalar İndeksi ({haritaNoktalari.length} Lokasyon)
                </h2>
                <p className="text-xs text-ink-400 mb-6 leading-relaxed">
                  Yukarıdaki interaktif haritamızda konumlandırılmış olan başlıca coğrafi
                  varlıkların, dağların, akarsuların veya madenlerin alfabetik tam listesi,
                  rakım/uzunluk değerleri ve akademik notları:
                </p>
                <div className="overflow-x-auto rounded-xl border border-ink-800/80">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-ink-900/70 border-b border-ink-800 text-ink-300 font-bold">
                        <th className="p-3">Coğrafi Varlık Adı</th>
                        <th className="p-3">Önemli Özelliği / Sıradağ / Havza</th>
                        <th className="p-3">Rakım / Değer</th>
                        <th className="p-3">Akademik Sınav Notu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-850">
                      {haritaNoktalari.slice(0, 15).map((nokta, i) => {
                        const name = nokta.isim || "Belirtilmemiş";
                        const feature =
                          nokta.sira_dag || nokta.dokulduğu_yer || nokta.kategori || "Türkiye";
                        const val = nokta.yukseklik_m
                          ? `${nokta.yukseklik_m} m`
                          : nokta.uzunluk_km
                            ? `${nokta.uzunluk_km} km`
                            : "Veri yok";
                        const note =
                          nokta.notlar ||
                          "KPSS sınavında konum olarak sorgulanabilecek önemli nokta.";

                        return (
                          <tr key={i} className="hover:bg-ink-900/20 text-ink-200">
                            <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                              {name}
                            </td>
                            <td className="p-3">{feature}</td>
                            <td className="p-3 font-mono">{val}</td>
                            <td className="p-3 text-ink-400">{note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {haritaNoktalari.length > 15 && (
                  <p className="text-[10px] text-ink-500 mt-3 text-right">
                    * Toplam {haritaNoktalari.length} noktadan ilk 15 tanesi listelenmiştir. Tam
                    veri seti interaktif haritada görsel olarak mevcuttur.
                  </p>
                )}
              </div>
            )}

            {/* SSS Akordeon Kartları */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Sıkça Sorulan Sorular (SSS) — {konuMeta.baslik}
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
