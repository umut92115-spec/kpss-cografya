import { getAllKonular } from "./getKonuData";

const GLOSSARY_TERMS = [
  { term: "Alüvyon", slug: "sozluk#alüvyon" },
  { term: "Bakı", slug: "sozluk#bakı" },
  { term: "Delta", slug: "sozluk#delta" },
  { term: "Falez", slug: "sozluk#falez" },
  { term: "Hinterland", slug: "sozluk#hinterland" },
  { term: "Mikroklima", slug: "sozluk#mikroklima" },
  { term: "Obruk", slug: "sozluk#obruk" },
  { term: "Terra Rossa", slug: "sozluk#terra-rossa" },
  { term: "Tektonik", slug: "sozluk#tektonik" },
];

export function linkKeywords(content: string, currentSlug: string): string {
  if (!content) return "";

  const placeholders: string[] = [];

  // 1. Korumaya al: MDX/HTML Tag'leri (Çok satırlı destekli)
  // Sadece < harfiyle başlayan ve geçerli bir etiket gibi görünenleri alıyoruz
  let protectedContent = content.replace(/<[a-zA-Z\/][\s\S]*?>/g, (match) => {
    placeholders.push(match);
    return `___TAG_${placeholders.length - 1}___`;
  });

  // 2. Korumaya al: Mevcut Markdown Linkleri [text](url)
  protectedContent = protectedContent.replace(/\[[\s\S]+?\]\([\s\S]+?\)/g, (match) => {
    placeholders.push(match);
    return `___LINK_${placeholders.length - 1}___`;
  });

  // 3. Linkleme İşlemi (Sadece korumasız metin üzerinde)
  const konular = getAllKonular();
  const sortedKonular = [...konular]
    .filter((k) => k.slug !== currentSlug)
    .sort((a, b) => b.kisa_baslik.length - a.kisa_baslik.length);

  let result = protectedContent;

  // Konu başlıklarını linkle
  sortedKonular.forEach((konu) => {
    const keyword = konu.kisa_baslik;
    // Negatif lookbehind/lookahead ile zaten linklenmiş veya placeholder içinde olanları koruyoruz
    // (Gerçi placeholder kullandığımız için çakışma ihtimali düşük)
    const regex = new RegExp(`(?<![\\w\\[])${keyword}(?![\\w\\s]*\\]\\()`, "gi");

    let found = false;
    result = result.replace(regex, (match) => {
      if (!found) {
        found = true;
        return `[${match}](/konu/${konu.slug})`;
      }
      return match;
    });
  });

  // Sözlük terimlerini linkle
  GLOSSARY_TERMS.forEach((item) => {
    const regex = new RegExp(`(?<![\\w\\[])${item.term}(?![\\w\\s]*\\]\\()`, "gi");
    let found = false;
    result = result.replace(regex, (match) => {
      if (!found) {
        found = true;
        return `[${match}](/konu/${item.slug})`;
      }
      return match;
    });
  });

  // 4. Placeholder'ları geri yükle
  // Sondan başa doğru giderek iç içe placeholder (olursa) sorununu çözüyoruz
  for (let i = placeholders.length - 1; i >= 0; i--) {
    result = result.replace(`___TAG_${i}___`, () => placeholders[i]);
    result = result.replace(`___LINK_${i}___`, () => placeholders[i]);
  }

  return result;
}

export function getNextPrevKonu(currentSlug: string) {
  const konular = getAllKonular();
  const currentIndex = konular.findIndex((k) => k.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? konular[currentIndex - 1] : null,
    next: currentIndex < konular.length - 1 ? konular[currentIndex + 1] : null,
  };
}
