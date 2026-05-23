#!/usr/bin/env node
/**
 * generate-quiz-maps.mjs
 * ========================================================
 * ÖSYM tarzı haritali soru görsellerini otomatik olarak
 * Türkiye GeoJSON'undan SVG formatında üretir.
 *
 * Kullanım:
 *   node scripts/generate-quiz-maps.mjs --quiz daglar
 *   node scripts/generate-quiz-maps.mjs --all
 *
 * JSON şeması için gorsel_veri alanı gereklidir:
 *   "gorsel_veri": { "I": "agri", "II": "kayseri", ... }
 * ========================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { geoMercator, geoPath } from "d3-geo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ─── Renkler & Stil ──────────────────────────────────────
const ROMEN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const BÖLGE_RENKLERİ = [
  "#3B82F6", // mavi
  "#EF4444", // kırmızı
  "#10B981", // yeşil
  "#F59E0B", // amber
  "#8B5CF6", // mor
  "#EC4899", // pembe
  "#06B6D4", // cyan
  "#F97316", // turuncu
];
const VARSAYILAN_İL_DOLGU = "#E2E8F0";
const SINIR_RENGI = "#94A3B8";
const SINIR_GENIŞLIĞI = 0.4;
const ARK_FİLTRE_RENGI = "#F8FAFC";

// ─── GeoJSON Yükle ───────────────────────────────────────
function geojsonYukle() {
  const geojsonYol = path.join(ROOT, "public", "maps", "turkey-iller.geojson");
  const raw = fs.readFileSync(geojsonYol, "utf-8");
  return JSON.parse(raw);
}

// ─── İller Sözlüğü ───────────────────────────────────────
function illerSozlukOlustur() {
  const illerYol = path.join(ROOT, "data", "iller.json");
  const raw = JSON.parse(fs.readFileSync(illerYol, "utf-8"));
  const sozluk = {};
  for (const il of raw) {
    sozluk[il.slug] = il.ad;
  }
  return sozluk;
}

// ─── Türkçe karakter normalize ───────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// ─── İl adı → slug eşleştir ──────────────────────────────
function adSlugBul(adm, illerSozluk) {
  const normalAdm = slugify(adm);
  return Object.keys(illerSozluk).find((s) => slugify(illerSozluk[s]) === normalAdm);
}

// ─── SVG Projeksiyon Hesapla ─────────────────────────────
function projeksiyon(geojson, genislik = 760, yukseklik = 400) {
  const proj = geoMercator().fitSize([genislik, yukseklik], geojson);
  const pathGen = geoPath().projection(proj);
  return { proj, pathGen };
}

// ─── Tek SVG Oluştur ─────────────────────────────────────
function svgOlustur(geojson, illerSozluk, gorselVeri, baslik = "") {
  const W = 760;
  const H = 420;
  const { proj, pathGen } = projeksiyon(geojson, W, H - 30);

  // Slug → renk eşlemesi
  const slugRenk = {};
  const slugEtiket = {};
  const sluglar = Object.keys(gorselVeri);

  sluglar.forEach((romenNo, i) => {
    const slug = gorselVeri[romenNo];
    slugRenk[slug] = BÖLGE_RENKLERİ[i % BÖLGE_RENKLERİ.length];
    slugEtiket[slug] = romenNo;
  });

  // İl path'leri
  const ilPaths = geojson.features
    .map((feature) => {
      const adm = feature.properties?.name || "";
      const slug = adSlugBul(adm, illerSozluk);

      const dolgu = slug && slugRenk[slug] ? slugRenk[slug] : VARSAYILAN_İL_DOLGU;
      const etiket = slug && slugEtiket[slug] ? slugEtiket[slug] : null;
      const dPath = pathGen(feature);
      if (!dPath) return "";

      // Centroid - etiket konumu
      let centroidSvg = "";
      if (etiket) {
        const centroid = pathGen.centroid(feature);
        if (centroid && !isNaN(centroid[0])) {
          const cx = centroid[0];
          const cy = centroid[1];
          // Beyaz yuvarlak arka plan + romen rakamı
          centroidSvg = `
    <circle cx="${cx}" cy="${cy}" r="11" fill="white" stroke="${dolgu}" stroke-width="1.5"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, serif" font-size="${etiket.length > 2 ? 7 : 9}" font-weight="bold" fill="${dolgu}">${etiket}</text>`;
        }
      }

      return `  <path d="${dPath}" fill="${dolgu}" stroke="${SINIR_RENGI}" stroke-width="${SINIR_GENIŞLIĞI}" />` + centroidSvg;
    })
    .join("\n");

  // Lejant (Kaldırıldı - ÖSYM haritalarında il isimleri yazmaz)
  const lejantGirişleri = "";

  // Başlık
  const baslikSvg = baslik
    ? `<text x="${W / 2}" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1E293B">${baslik}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="background:${ARK_FİLTRE_RENGI};border-radius:12px;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#94A3B8" flood-opacity="0.3"/>
    </filter>
  </defs>
  ${baslikSvg}
  <g transform="translate(0, ${baslik ? 24 : 8})">
${ilPaths}
  </g>
</svg>`;
}

// ─── Quiz JSON'u İşle ────────────────────────────────────
function quizIşle(konuSlug, geojson, illerSozluk) {
  const quizYol = path.join(ROOT, "data", "quiz", `${konuSlug}.json`);
  if (!fs.existsSync(quizYol)) {
    console.error(`❌ Quiz dosyası bulunamadı: ${quizYol}`);
    return { işlendi: 0, atlandı: 0 };
  }

  const quizData = JSON.parse(fs.readFileSync(quizYol, "utf-8"));
  const sorular = quizData.sorular || [];

  let işlendi = 0;
  let atlandı = 0;

  for (const soru of sorular) {
    if (!soru.gorsel || !soru.gorsel_veri) {
      atlandı++;
      continue;
    }

    // gorsel: "daglar/daglar-003.svg" → alt klasör: "daglar", dosya: "daglar-003.svg"
    const altKlasör = path.dirname(soru.gorsel);  // "daglar"
    const dosyaAdı = path.basename(soru.gorsel);  // "daglar-003.svg"
    const çıktıKlasörü = path.join(ROOT, "public", "images", "quizzes", altKlasör);
    fs.mkdirSync(çıktıKlasörü, { recursive: true });
    const hedefYol = path.join(çıktıKlasörü, dosyaAdı);

    // Zaten varsa atla
    if (fs.existsSync(hedefYol)) {
      console.log(`  ⏩ Mevcut: ${soru.gorsel}`);
      atlandı++;
      continue;
    }

    try {
      const svg = svgOlustur(geojson, illerSozluk, soru.gorsel_veri, "");
      fs.writeFileSync(hedefYol, svg, "utf-8");
      console.log(`  ✅ Oluşturuldu: ${soru.gorsel} (${Object.keys(soru.gorsel_veri).length} alan)`);
      işlendi++;
    } catch (err) {
      console.error(`  ❌ Hata (${soru.id}): ${err.message}`);
    }
  }

  return { işlendi, atlandı };
}

// ─── Ana Akış ────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const quizIdx = args.indexOf("--quiz");
  const hepsi = args.includes("--all");

  console.log("🗺️  KPSS Coğrafya — ÖSYM Harita Görsel Üretici\n");

  const geojson = geojsonYukle();
  const illerSozluk = illerSozlukOlustur();

  console.log(`✅ ${geojson.features.length} il sınırı yüklendi.`);
  console.log(`✅ ${Object.keys(illerSozluk).length} il slug'ı yüklendi.\n`);

  if (hepsi) {
    const quizKlasörü = path.join(ROOT, "data", "quiz");
    const dosyalar = fs.readdirSync(quizKlasörü).filter((f) => f.endsWith(".json"));
    let toplamİşlendi = 0;
    let toplamAtlandı = 0;

    for (const dosya of dosyalar) {
      const slug = dosya.replace(".json", "");
      console.log(`📁 İşleniyor: ${slug}`);
      const { işlendi, atlandı } = quizIşle(slug, geojson, illerSozluk);
      toplamİşlendi += işlendi;
      toplamAtlandı += atlandı;
    }

    console.log(`\n🎉 Toplam: ${toplamİşlendi} SVG oluşturuldu, ${toplamAtlandı} atlandı.`);
  } else if (quizIdx !== -1 && args[quizIdx + 1]) {
    const slug = args[quizIdx + 1];
    console.log(`📁 İşleniyor: ${slug}\n`);
    const { işlendi, atlandı } = quizIşle(slug, geojson, illerSozluk);
    console.log(`\n🎉 ${işlendi} SVG oluşturuldu, ${atlandı} atlandı.`);
  } else {
    console.log("Kullanım:");
    console.log("  node scripts/generate-quiz-maps.mjs --quiz <konu-slug>");
    console.log("  node scripts/generate-quiz-maps.mjs --all\n");
    console.log("Örnek:");
    console.log("  node scripts/generate-quiz-maps.mjs --quiz daglar");
  }
}

main();
