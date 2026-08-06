// Placeholder for makale (article) data functions
// TODO: Implement article data loading functionality

export function getAllMakaleler(): { slug: string }[] {
  return [{ slug: "kpss-cografya-hazirlik-rehberi" }];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMakale(slug: string): any {
  if (slug === "kpss-cografya-hazirlik-rehberi") {
    return {
      slug: "kpss-cografya-hazirlik-rehberi",
      baslik: "KPSS Coğrafya Hazırlık Rehberi",
      aciklama:
        "KPSS Coğrafya sınavına en verimli şekilde hazırlanma teknikleri ve konu analizleri.",
      guncelleme: "2026-05-01",
      icerik:
        "KPSS Coğrafya dersine çalışırken harita bilgisi, konu özetleri ve bol soru çözümü hayati önem taşır. Sitemizdeki interaktif haritalar ve quizlerden faydalanabilirsiniz.",
    };
  }
  return null;
}
