/**
 * Görseller için standartlara uygun otomatik Alt metni üreten yardımcı fonksiyonlar.
 * Hedef format: "[konu/il] + KPSS coğrafya + açıklayıcı ifade"
 */

export function getIlAltText(ilAd: string): string {
  return `${ilAd} ili Türkiye haritasında konumu — KPSS coğrafya`;
}

export function getKonuAltText(konuBaslik: string): string {
  return `KPSS ${konuBaslik} Türkiye haritası — il bazlı dağılım`;
}
