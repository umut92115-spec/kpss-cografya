const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'konu');
const regions = [
  { name: 'Akdeniz Bölgesi', slug: 'akdenizbolgesi' },
  { name: 'Ege Bölgesi', slug: 'egebolgesi' },
  { name: 'Marmara Bölgesi', slug: 'marmarabolgesi' },
  { name: 'İç Anadolu Bölgesi', slug: 'ic-anadolubolgesi' },
  { name: 'Doğu Anadolu Bölgesi', slug: 'dogu-anadolubolgesi' },
  { name: 'Güneydoğu Anadolu Bölgesi', slug: 'guneydogu-anadolubolgesi' },
  { name: 'Karadeniz Bölgesi', slug: 'karadenizbolgesi' }
];

function linkRegions() {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
  
  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    regions.forEach(region => {
      // Sadece henüz linklenmemiş olanları bul (Arkasına ]( veya [ gelmeyen)
      // Regex: Negatif lookahead ve lookbehind ile link içinde olup olmadığını kontrol et
      // Basitlik için: [Bölge İsmi] şeklinde olmayanları hedefle
      const escapedName = region.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<!\\[)${escapedName}(?!\\])`, 'g');
      
      if (regex.test(content)) {
        content = content.replace(regex, `[${region.name}](/${region.slug})`);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Linked: ${file}`);
    }
  });
}

linkRegions();
