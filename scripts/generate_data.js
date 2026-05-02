const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const matrisDir = path.join(dataDir, 'matris');

if (!fs.existsSync(matrisDir)) fs.mkdirSync(matrisDir);

const iller = JSON.parse(fs.readFileSync(path.join(dataDir, 'iller.json'), 'utf8'));
const konular = JSON.parse(fs.readFileSync(path.join(dataDir, 'konular.json'), 'utf8'));

konular.forEach(konu => {
    const filePath = path.join(matrisDir, `${konu.slug}.json`);
    const data = { konu: konu.slug, baslik: konu.baslik, iller: {} };

    iller.forEach(il => {
        data.iller[il.slug] = {
            detay: `${il.ad} için ${konu.baslik} verileri yakında eklenecektir.`,
            kpss_notu: "",
            faqs: []
        };
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});

console.log("Database REVERTED to empty placeholders.");
