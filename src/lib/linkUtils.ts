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
  
  // Önce içeriği tagler ve düz metin olarak parçalara ayırıyoruz
  // Bu sayede <Component items={...}> içindeki metinlerin linklenmesini önlüyoruz
  const parts = content.split(/(<[^>]+>)/g);
  
  const linkedParts = parts.map(part => {
    // Eğer bu bir tag ise (veya boş ise) olduğu gibi bırak
    if (part.startsWith('<') || !part.trim()) return part;

    let linkedPart = part;
    const sortedKonular = [...konular].sort((a, b) => b.kisa_baslik.length - a.kisa_baslik.length);

    sortedKonular.forEach((konu) => {
      if (konu.slug === currentSlug) return;
      const keyword = konu.kisa_baslik;
      const regex = new RegExp(`(?<!\\[)${keyword}(?![\\w\\s]*\\]\\()`, 'gi');
      
      let found = false;
      linkedPart = linkedPart.replace(regex, (match) => {
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
      linkedPart = linkedPart.replace(regex, (match) => {
        if (!found) {
          found = true;
          return `[${match}](/konu/${item.slug})`;
        }
        return match;
      });
    });

    return linkedPart;
  });

  return linkedParts.join('');
}

export function getNextPrevKonu(currentSlug: string) {
  const konular = getAllKonular();
  const currentIndex = konular.findIndex(k => k.slug === currentSlug);
  
  return {
    prev: currentIndex > 0 ? konular[currentIndex - 1] : null,
    next: currentIndex < konular.length - 1 ? konular[currentIndex + 1] : null
  };
}
