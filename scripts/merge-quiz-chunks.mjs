#!/usr/bin/env node
/**
 * merge-quiz-chunks.mjs
 * ─────────────────────────────────────────────────────────
 * scratch/chunk_<konu>_*.json dosyalarını birleştirir,
 * sıralar, ID'leri düzeltir ve data/quiz/<konu>.json'a yazar.
 *
 * Kullanım:
 *   node scripts/merge-quiz-chunks.mjs daglar
 *   node scripts/merge-quiz-chunks.mjs daglar --dry-run
 * ─────────────────────────────────────────────────────────
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const konuSlug = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!konuSlug) {
  console.error("Kullanım: node scripts/merge-quiz-chunks.mjs <konu-slug>");
  process.exit(1);
}

console.log(`\n🔀 Konu: ${konuSlug} — Chunk Birleştirici\n`);

// ─── Chunk dosyalarını bul ────────────────────────────────
const scratchDir = path.join(ROOT, "scratch");
const chunkPattern = new RegExp(`^chunk_${konuSlug.replace(/-/g, "_")}_?.*\\.json$`);
const files = fs
  .readdirSync(scratchDir)
  .filter((f) => chunkPattern.test(f))
  .sort();

if (files.length === 0) {
  console.error(`❌ Hiç chunk dosyası bulunamadı. (pattern: chunk_${konuSlug.replace(/-/g, "_")}_*.json)`);
  process.exit(1);
}

console.log(`📦 Bulunan chunk dosyaları (${files.length}):`);
files.forEach((f) => console.log(`   • ${f}`));
console.log();

// ─── Tüm soruları topla ──────────────────────────────────
let tumSorular = [];
let parseHatasi = 0;

for (const file of files) {
  const filePath = path.join(scratchDir, file);
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    // Bazen agent JSON array yerine string içinde array döndürüyor
    const jsonStr = raw.startsWith("[") ? raw : raw.match(/\[[\s\S]*\]/)?.[0] || "[]";
    const sorular = JSON.parse(jsonStr);
    if (Array.isArray(sorular)) {
      console.log(`  ✅ ${file}: ${sorular.length} soru`);
      tumSorular.push(...sorular);
    } else {
      console.warn(`  ⚠️  ${file}: Dizi formatında değil, atlandı`);
      parseHatasi++;
    }
  } catch (err) {
    console.error(`  ❌ ${file}: Parse hatası — ${err.message}`);
    parseHatasi++;
  }
}

console.log(`\n📊 Ham toplam: ${tumSorular.length} soru`);

// ─── Temizlik ve Normalizasyon ───────────────────────────
// 1. Eksik ID'leri sırayla ata
tumSorular = tumSorular.map((soru, idx) => {
  const paddedIdx = String(idx + 1).padStart(3, "0");
  return {
    id: soru.id || `${konuSlug}-${paddedIdx}`,
    soru: (soru.soru || "").trim(),
    siklar: Array.isArray(soru.siklar) ? soru.siklar : [],
    dogru: (soru.dogru || "").trim(),
    aciklama: (soru.aciklama || "").trim(),
    harita_il: soru.harita_il || null,
    zorluk: ["kolay", "orta", "zor"].includes(soru.zorluk) ? soru.zorluk : "orta",
    gorsel: soru.gorsel || null,
    gorsel_veri: soru.gorsel_veri || null,
  };
});

// 2. ID'leri yeniden numaralandır (konu-001, konu-002, ...)
tumSorular = tumSorular.map((soru, idx) => ({
  ...soru,
  id: `${konuSlug}-${String(idx + 1).padStart(3, "0")}`,
}));

// 3. Mükerrer soru metni tespiti
const soruMetinleri = new Set();
const benzersizSorular = [];
let tekerrar = 0;

for (const soru of tumSorular) {
  const key = soru.soru.slice(0, 60).toLowerCase();
  if (soruMetinleri.has(key)) {
    console.warn(`  ⚠️  Mükerrer: ${soru.id} — "${soru.soru.slice(0, 40)}..."`);
    tekerrar++;
  } else {
    soruMetinleri.add(key);
    benzersizSorular.push(soru);
  }
}

// 4. Eksik alan kontrolü
let hatali = 0;
for (const soru of benzersizSorular) {
  const sorunlar = [];
  if (!soru.soru) sorunlar.push("soru boş");
  if (!soru.dogru) sorunlar.push("dogru boş");
  if (soru.siklar.length !== 5) sorunlar.push(`şık sayısı ${soru.siklar.length} (5 olmalı)`);
  if (soru.dogru && !soru.siklar.includes(soru.dogru)) sorunlar.push("dogru şıklar arasında yok");
  if (soru.gorsel && !soru.gorsel_veri) sorunlar.push("gorsel var ama gorsel_veri yok");
  if (soru.aciklama.split(" ").length < 20) sorunlar.push("aciklama çok kısa");

  if (sorunlar.length > 0) {
    console.warn(`  ⚠️  ${soru.id}: ${sorunlar.join(", ")}`);
    hatali++;
  }
}

// ─── İstatistikler ───────────────────────────────────────
const kolay = benzersizSorular.filter((s) => s.zorluk === "kolay").length;
const orta = benzersizSorular.filter((s) => s.zorluk === "orta").length;
const zor = benzersizSorular.filter((s) => s.zorluk === "zor").length;
const haritali = benzersizSorular.filter((s) => s.harita_il).length;
const gorselli = benzersizSorular.filter((s) => s.gorsel).length;
const haritaOrani = Math.round((haritali / benzersizSorular.length) * 100);
const gorselOrani = Math.round((gorselli / benzersizSorular.length) * 100);

console.log(`
╔══════════════════════════════════════════╗
║        BİRLEŞTİRME ÖZET RAPORU          ║
╠══════════════════════════════════════════╣
║ Toplam benzersiz soru  : ${String(benzersizSorular.length).padEnd(14)} ║
║ Mükerrer (atılan)      : ${String(tekerrar).padEnd(14)} ║
║ Hatalı alan içeren     : ${String(hatali).padEnd(14)} ║
║ Parse hatası           : ${String(parseHatasi).padEnd(14)} ║
╠══════════════════════════════════════════╣
║ Zorluk Dağılımı        :                ║
║   Kolay                : ${String(kolay).padEnd(14)} ║
║   Orta                 : ${String(orta).padEnd(14)} ║
║   Zor                  : ${String(zor).padEnd(14)} ║
╠══════════════════════════════════════════╣
║ Haritalı soru          : ${String(haritali + " (%"+haritaOrani+")").padEnd(14)} ║
║ Görselli soru          : ${String(gorselli + " (%"+gorselOrani+")").padEnd(14)} ║
╚══════════════════════════════════════════╝`);

if (dryRun) {
  console.log("\n🔎 --dry-run modu: Dosyaya yazılmadı.");
  process.exit(0);
}

// ─── data/quiz/<konu>.json'a yaz ─────────────────────────
const hedefYol = path.join(ROOT, "data", "quiz", `${konuSlug}.json`);
const çıktı = {
  konu: konuSlug,
  sorular: benzersizSorular,
};

fs.writeFileSync(hedefYol, JSON.stringify(çıktı, null, 2), "utf-8");
console.log(`\n✅ Yazıldı: ${hedefYol}`);
console.log(`   ${benzersizSorular.length} soru başarıyla kaydedildi.\n`);
