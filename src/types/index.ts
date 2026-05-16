export interface Il {
  id: number;
  ad: string;
  slug: string;
  plaka: number;
  bolge: string;
  bolge_slug: string;
  lat: number;
  lng: number;
  nufus_2023: number;
  yuzolcumu_km2: number;
}

export interface Konu {
  slug: string;
  baslik: string;
  kisa_baslik: string;
  kpss_soru_sayisi_ort: number;
  agirlik: "düşük" | "orta" | "yüksek";
  icon: string;
  renk: string;
  harita_renk: string;
  aciklama: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Section {
  h2: string;
  content: string;
  type: 'text' | 'table' | 'map' | 'list' | 'vurgu';
  /** Tablo verisi: 2D array (ilk satır header) veya object array */
  data?: string[][] | Record<string, string | number>[] | string;
}

export interface SuperDetay {
  title: string;
  meta: string;
  h1: string;
  snippet: string;
  sections: Section[];
  faqs: FAQ[];
  last_updated: string;
}

export interface IlKonuMaden {
  maden_turleri: string[];
  onemli_not: string;
  kpss_notu: string;
  sik_soru: string | null;
  harita_renk: "koyu" | "orta" | "açık" | "yok";
  super_detay?: SuperDetay;
}

export interface IlKonuTarim {
  ana_urunler: string[];
  ihracat_urunu: string | null;
  kpss_notu: string;
  harita_renk: "koyu" | "orta" | "açık" | "yok";
  super_detay?: SuperDetay;
}

export interface IlKonuGenel {
  detay: string;
  kpss_notu: string;
  faqs: FAQ[];
  super_detay?: SuperDetay;
}

export type IlKonuData = IlKonuMaden | IlKonuTarim | IlKonuGenel;

export interface MatrisData<T = IlKonuData> {
  konu: string;
  baslik: string;
  iller: Record<string, T>;
}

/** bolge-verileri.json'daki bölge veri yapısı */
export interface BolgeVerisi {
  konum?: string;
  yer_sekilleri?: string;
  jeoloji?: string;
  su_ortusu?: string;
  iklim_bitki?: string;
  toprak_cevre?: string;
  nufus?: string;
  tarim_hayvancilik?: string;
  maden_enerji?: string;
  sanayi_ticaret?: string;
  ulasim_sinir?: string;
  turizm?: string;
  kalkinma?: string;
  kpss_altin_not?: string;
  faqs?: Array<{ soru?: string; q?: string; cevap?: string; a?: string }>;
}
