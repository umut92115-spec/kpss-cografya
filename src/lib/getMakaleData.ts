export interface Makale {
  slug: string;
  baslik: string;
  aciklama: string;
  guncelleme: string;
}

// Gelecekte gerçek MDX okunacak, şimdilik placeholder veri dönüyoruz ki sitemap vb bozulmasın
export function getAllMakaleler(): Makale[] {
  return [
    {
      slug: 'kpss-cografya-calisma-taktikleri',
      baslik: 'KPSS Coğrafya Çalışma Taktikleri',
      aciklama: 'KPSS coğrafyada nasıl full yapılır? Akılda kalıcı taktikler.',
      guncelleme: '2025-01-10T00:00:00.000Z',
    }
  ];
}

export function getMakale(slug: string): Makale | undefined {
  return getAllMakaleler().find((m) => m.slug === slug);
}
