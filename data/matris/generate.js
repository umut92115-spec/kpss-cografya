const fs = require('fs');
const path = require('path');

const iller = JSON.parse(fs.readFileSync(path.join(__dirname, '../iller.json'), 'utf8'));

const madenData = {
  konu: "madenler-enerji",
  versiyon: "2025",
  iller: {}
};

const tarimData = {
  konu: "tarim",
  versiyon: "2025",
  iller: {}
};

const ozelMadenler = {
  "zonguldak": { maden_turleri: ["taş kömürü"], onemli_not: "Türkiye'nin tek taş kömürü havzası", kpss_notu: "Sınavda kesinlikle çıkar — Zonguldak = taş kömürü", sik_soru: "Türkiye'de taş kömürü en çok hangi ilde çıkar?", harita_renk: "koyu" },
  "batman": { maden_turleri: ["petrol"], onemli_not: "İlk petrol bulunan ve çıkarılan yer", kpss_notu: "Batman rafinerisi ve petrol yatakları", sik_soru: null, harita_renk: "koyu" },
  "artvin": { maden_turleri: ["bakır"], onemli_not: "Murgul bakır yatakları", kpss_notu: "Kader madeni bakır", sik_soru: null, harita_renk: "koyu" },
  "elazig": { maden_turleri: ["krom", "bakır", "kurşun-çinko"], onemli_not: "Guleman krom yatakları, Türkiye'nin en çeşitli maden ili", kpss_notu: "Maden çeşitliliği en fazla olan ildir.", sik_soru: "Maden çeşitliliğinde ilk sırada yer alan il hangisidir?", harita_renk: "koyu" },
  "manisa": { maden_turleri: ["linyit"], onemli_not: "Soma linyit havzası", kpss_notu: "Ege linyit bakımından zengindir", sik_soru: null, harita_renk: "koyu" },
  "ankara": { maden_turleri: ["tuz", "linyit"], onemli_not: "Tuz Gölü tuz rezervi, Çayırhan linyit", kpss_notu: "Tuz Gölü Ankara-Konya sınırında", sik_soru: null, harita_renk: "orta" },
  "sivas": { maden_turleri: ["demir"], onemli_not: "Divriği demir yatakları", kpss_notu: "Divriği = Demir", sik_soru: "Türkiye'nin en önemli demir yatakları neresidir?", harita_renk: "koyu" }
};

const ozelTarim = {
  "rize": { ana_urunler: ["çay", "kivi"], ihracat_urunu: "çay", kpss_notu: "Çay sadece Doğu Karadeniz'de (özellikle Rize) yetişir.", harita_renk: "koyu" },
  "giresun": { ana_urunler: ["fındık"], ihracat_urunu: "fındık", kpss_notu: "Fındık Karadeniz kıyı kuşağı", harita_renk: "koyu" },
  "aydin": { ana_urunler: ["incir", "zeytin"], ihracat_urunu: "incir", kpss_notu: "İncirde Türkiye 1.si Aydın'dır.", harita_renk: "koyu" },
  "konya": { ana_urunler: ["buğday", "şeker pancarı"], ihracat_urunu: "buğday", kpss_notu: "Türkiye'nin tahıl ambarı", harita_renk: "koyu" },
  "adana": { ana_urunler: ["pamuk", "soya fasulyesi", "mısır", "narenciye"], ihracat_urunu: "pamuk", kpss_notu: "Çukurova tarımsal potansiyeli çok yüksektir.", harita_renk: "koyu" },
  "sanliurfa": { ana_urunler: ["pamuk", "fıstık"], ihracat_urunu: "pamuk", kpss_notu: "GAP ile birlikte pamuk üretiminde 1. sıraya yükselmiştir.", harita_renk: "koyu" },
  "malatya": { ana_urunler: ["kayısı"], ihracat_urunu: "kayısı", kpss_notu: "Kayısıda dünya lideriyiz, merkez Malatya.", harita_renk: "koyu" }
};

iller.forEach(il => {
  madenData.iller[il.slug] = ozelMadenler[il.slug] || {
    maden_turleri: ["çeşitli madenler"],
    onemli_not: "Genel maden potansiyeli",
    kpss_notu: "Detaylı KPSS sorusu genelde çıkmaz.",
    sik_soru: null,
    harita_renk: "yok"
  };

  tarimData.iller[il.slug] = ozelTarim[il.slug] || {
    ana_urunler: ["buğday", "arpa"],
    ihracat_urunu: null,
    kpss_notu: "Yerel tüketim amaçlı tarım.",
    harita_renk: "açık"
  };
});

fs.writeFileSync(path.join(__dirname, 'madenler.json'), JSON.stringify(madenData, null, 2));
fs.writeFileSync(path.join(__dirname, 'tarim.json'), JSON.stringify(tarimData, null, 2));

console.log("JSON dosyaları oluşturuldu.");
