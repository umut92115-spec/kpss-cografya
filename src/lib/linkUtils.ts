import { getAllKonular } from './getKonuData';

const GLOSSARY_TERMS = [
  { term: 'Alüvyon', slug: 'sozluk#alüvyon' },
  { term: 'Bakı', slug: 'sozluk#bakı' },
  { term: 'Delta', slug: 'sozluk#delta' },
  { term: 'Falez', slug: 'sozluk#falez' },
  { term: 'Hinterland', slug: 'sozluk#hinterland' },
  { term: 'Mikroklima', slug: 'sozluk#mikroklima' },
  { term: 'Obruk', slug: 'sozluk#obruk' },
  { term: 'Terra Rossa', slug: 'sozluk#terra-rossa' },
  { term: 'Tektonik', slug: 'sozluk#tektonik' },
];

export function linkKeywords(content: string, currentSlug: string): string {
  const konular = getAllKonular();
  let linkedContent = content;

  // Sıralama önemli: Uzun kelimeler önce gelsin ki "Madenler" varken "Maden" linklenmesin.
  const sortedKonular = [...konular].sort((a, b) => b.kisa_baslik.length - a.kisa_baslik.length);

  sortedKonular.forEach((konu) => {
    if (konu.slug === currentSlug) return;

    // Sadece düz metindeki kelimeleri hedefle. 
    // Linklerin içindekileri, başlıkları veya resim alt metinlerini bozmamaya çalışalım.
    // Bu basit bir regex, daha karmaşığını MDX seviyesinde yapmak gerekir ama bu da iş görür.
    const keyword = konu.kisa_baslik;
    
    // Kelimenin başına ve sonuna boşluk veya noktalama işareti gelmesini kontrol eden regex
    // Ayrıca zaten link olanları pas geçmek için (?) kullanıyoruz (basit seviyede).
    // NOT: MDX içeriğinde [Kelime](/link) yapısı varsa onu bozmamalıyız.
    
    const regex = new RegExp(`(?<!\\[)${keyword}(?![\\w\\s]*\\]\\()`, 'gi');
    
    // Her kelimeyi sadece ilk geçtiği yerde linklemek SEO için daha iyidir (spam algısını önler)
    let found = false;
    linkedContent = linkedContent.replace(regex, (match) => {
      if (!found) {
        found = true;
        return `[${match}](/konu/${konu.slug})`;
      }
      return match;
    });
  });

  // Sözlük terimlerini linkle
  GLOSSARY_TERMS.forEach((item) => {
    const regex = new RegExp(`(?<!\\[)${item.term}(?![\\w\\s]*\\]\\()`, 'gi');
    let found = false;
    linkedContent = linkedContent.replace(regex, (match) => {
      if (!found) {
        found = true;
        return `[${match}](/konu/${item.slug})`;
      }
      return match;
    });
  });

  return linkedContent;
}

export function getNextPrevKonu(currentSlug: string) {
  const konular = getAllKonular();
  const currentIndex = konular.findIndex(k => k.slug === currentSlug);
  
  return {
    prev: currentIndex > 0 ? konular[currentIndex - 1] : null,
    next: currentIndex < konular.length - 1 ? konular[currentIndex + 1] : null
  };
}
