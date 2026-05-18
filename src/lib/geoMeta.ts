import { Il } from "@/types";
import type { Metadata } from "next";

export function getIlJsonLd(il: Il) {
  return {
    // @context JsonLd bileşeni tarafından ekleniyor — tekrar koymuyoruz
    name: il.ad,
    geo: {
      "@type": "GeoCoordinates",
      latitude: il.lat,
      longitude: il.lng,
    },
    containedInPlace: {
      "@type": "Country",
      name: "Türkiye",
      sameAs: "https://www.wikidata.org/wiki/Q43",
    },
    identifier: `TR-${String(il.plaka).padStart(2, "0")}`,
  };
}

export function getSiteGeoMeta(): Metadata {
  return {
    other: {
      "geo.region": "TR",
      "geo.placename": "Türkiye",
      language: "Turkish",
    },
  };
}
