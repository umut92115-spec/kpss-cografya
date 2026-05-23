import { Metadata } from "next";
import { getKonu, getAllKonular } from "@/lib/getKonuData";
import { getKonuMatris, getAllIller } from "@/lib/getIlData";
import { notFound } from "next/navigation";
import HaritaIcerik from "./HaritaIcerik";
import JsonLd from "@/components/JsonLd";

export async function generateStaticParams() {
  const konular = getAllKonular();
  return konular.map((konu) => ({
    konu: konu.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { konu: string };
}): Promise<Metadata> {
  const konu = getKonu(params.konu);
  if (!konu) return {};

  return {
    title: `Türkiye ${konu.baslik} Haritası — KPSS | kpsscografya.com.tr`,
    description: `KPSS coğrafya ${konu.kisa_baslik.toLowerCase()} konusu: Türkiye'nin il bazlı interaktif haritası. Her ile tıkla, sınava hazırlan.`,
    alternates: {
      canonical: `https://kpsscografya.com.tr/harita/${konu.slug}`,
    },
    openGraph: {
      title: `Türkiye ${konu.baslik} Haritası — KPSS`,
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

export default function HaritaKonuPage({ params }: { params: { konu: string } }) {
  const konuMeta = getKonu(params.konu);
  if (!konuMeta) notFound();

  const matrisData = getKonuMatris(params.konu);
  const tumKonular = getAllKonular();
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
            {
              "@type": "ListItem",
              position: 3,
              name: konuMeta.baslik,
              item: `https://kpsscografya.com.tr/harita/${konuMeta.slug}`,
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
