export function slugify(text: string): string {
  const charMap: Record<string, string> = {
    'ğ': 'g', 'Ğ': 'g',
    'ü': 'u', 'Ü': 'u',
    'ş': 's', 'Ş': 's',
    'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ç': 'c', 'Ç': 'c'
  };

  return text
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Alfanümerik olmayanları tireye çevir
    .replace(/^-+|-+$/g, '');    // Baştaki ve sondaki tireleri temizle
}
