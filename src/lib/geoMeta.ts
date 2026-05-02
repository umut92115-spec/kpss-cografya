import { Metadata } from 'next';
import { Il } from '@/types';

export function getIlGeoMeta(il: Il): Metadata {
  return {
    other: {
      'geo.region': `TR-${String(il.plaka).padStart(2, '0')}`,
      'geo.placename': `${il.ad}, Türkiye`,
      'geo.position': `${il.lat};${il.lng}`,
      'ICBM': `${il.lat}, ${il.lng}`,
    }
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
