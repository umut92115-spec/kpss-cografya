import { Metadata } from "next";
import { getAllKonular, getKonu } from "@/lib/getKonuData";
import { getKonuMatris, getAllIller } from "@/lib/getIlData";
import HaritaIcerik from "./[konu]/HaritaIcerik";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "KPSS İnteraktif Harita Atlası 2026 — Maden, Tarım, Sanayi Görselleştirme",
  description:
    "Türkiye'nin en kapsamlı KPSS İnteraktif Harita platformu. Madenler, tarım ürünleri ve sanayi tesislerini harita üzerinde görselleştirin, sınavda fark atın.",
  keywords: [
    "kpss interaktif harita",
    "kpss harita çalışması",
    "türkiye maden haritası interaktif",
    "kpss coğrafya harita görselleştirme",
  ],
  alternates: {
    canonical: "https://kpsscografya.com.tr/harita",
  },
  openGraph: {
    title: "KPSS İnteraktif Harita Atlası — Görsel Öğrenme Merkezi",
    description:
      "Türkiye coğrafyasını interaktif haritalarla keşfedin. KPSS'de en çok çıkan konuları görsel hafızanıza kazıyın.",
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
      <div className="min-h-screen bg-ink-900">
        <HaritaIcerik
          konuMeta={konuMeta}
          tumKonular={tumKonular}
          matrisData={matrisData}
          iller={iller}
        />
      </div>
    </>
  );
}
