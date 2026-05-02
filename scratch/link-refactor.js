const fs = require('fs');
const path = require('path');

const iller = JSON.parse(fs.readFileSync('data/iller.json', 'utf8'));
const bolgeler = [
  { slug: 'akdeniz', url: 'akdenizbolgesi' },
  { slug: 'ege', url: 'egebolgesi' },
  { slug: 'marmara', url: 'marmarabolgesi' },
  { slug: 'ic-anadolu', url: 'ic-anadolubolgesi' },
  { slug: 'dogu-anadolu', url: 'dogu-anadolubolgesi' },
  { slug: 'guneydogu-anadolu', url: 'guneydogu-anadolubolgesi' },
  { slug: 'karadeniz', url: 'karadenizbolgesi' }
];

const ilToBolgeUrl = {};
iller.forEach(il => {
  const bolge = bolgeler.find(b => b.slug === il.bolge_slug);
  if (bolge) {
    ilToBolgeUrl[il.slug] = bolge.url;
  }
});

const contentDir = 'content/konu';
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex: \(/il/([a-z0-9-]+)\)
  content = content.replace(/\(\/il\/([a-z0-9-]+)\)/g, (match, slug) => {
    const bolgeUrl = ilToBolgeUrl[slug];
    if (bolgeUrl) {
      changed = true;
      return `(/${bolgeUrl}/il/${slug})`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  }
});
