import { Metadata } from 'next';
import { Il } from '@/types';

export function getIlJsonLd(il: Il) {
  return {
    '@type': 'AdministrativeArea',
    '@context': 'https://schema.org',
    name: il.ad,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: il.lat,
      longitude: il.lng,
    },
    containedInPlace: {
      '@type': 'Country',
      name: 'Türkiye',
      sameAs: 'https://www.wikidata.org/wiki/Q43',
    },
    identifier: `TR-${String(il.plaka).padStart(2, '0')}`,
  };
}


export function getSiteGeoMeta(): Metadata {
  return {
    other: {
      'geo.region': 'TR',
      'geo.placename': 'Türkiye',
      'language': 'Turkish',
    }
  };
}
