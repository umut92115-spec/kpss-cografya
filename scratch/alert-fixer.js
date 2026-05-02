const fs = require('fs');
const path = require('path');

const contentDir = 'content/konu';
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

const typeMap = {
  'TIP': 'ezber',
  'IMPORTANT': 'dikkat',
  'NOTE': 'onemli',
  'CAUTION': 'dikkat',
  'WARNING': 'dikkat'
};

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Multi-line regex to match blockquote alerts
  // Match > [!TYPE] and subsequent lines starting with >
  const alertRegex = /^> \[!(TIP|IMPORTANT|NOTE|CAUTION|WARNING)\]\r?\n((?:> .*\r?\n?)+)/gm;

  content = content.replace(alertRegex, (match, type, body) => {
    changed = true;
    const kpssType = typeMap[type] || 'onemli';
    
    // Process body: remove "> " prefix and extract title if it starts with **Title:**
    let lines = body.split('\n').map(l => l.replace(/^> /, '').trim()).filter(l => l !== '');
    let title = '';
    
    if (lines[0] && lines[0].startsWith('**') && lines[0].includes(':**')) {
      const parts = lines[0].split(':**');
      title = parts[0].replace(/\*\*/g, '').trim();
      lines[0] = parts[1].trim();
    } else if (lines[0] && lines[0].startsWith('**') && lines[0].endsWith('**')) {
      title = lines[0].replace(/\*\*/g, '').trim();
      lines.shift();
    }

    const cleanBody = lines.filter(l => l !== '').join('\n  ');
    
    return `<KpssNot tip="${kpssType}" baslik="${title}">\n  ${cleanBody}\n</KpssNot>\n`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed alerts in: ${file}`);
  }
});
