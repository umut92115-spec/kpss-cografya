const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");

// KONFİGÜRASYON (YENİ OPENROUTER KEY & MODEL)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
});

const dataDir = path.join(__dirname, '../data');
const matrisDir = path.join(dataDir, 'matris');
const statusFilePath = path.join(__dirname, '../content_generation_status.md');

// DOSYALARI OKU
const iller = JSON.parse(fs.readFileSync(path.join(dataDir, 'iller.json'), 'utf8'));
const konular = JSON.parse(fs.readFileSync(path.join(dataDir, 'konular.json'), 'utf8'));
const masterPrompt = fs.readFileSync(path.join(__dirname, '../kpsscografya_master_prompt.md'), 'utf8');
const soruHavuzu = fs.readFileSync(path.join(__dirname, '../kpss_cografya_soru_havuzu.html'), 'utf8');

// İlleri alfabetik sırala
const siraliIller = [...iller].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

async function generateContent(ilAd, konuBaslik, konuSlug, retryCount = 0) {
    const prompt = `
${masterPrompt}

SORU HAVUZU:
${soruHavuzu}

GÖREV:
"${ilAd}" ili ve "${konuBaslik}" konusu için "Süper Detay" içeriği üret.

KRİTİK KURALLAR:
1. kpss_notu: SADECE 1-2 cümlelik, sınavda çıkabilecek kritik coğrafi bilgi. 
2. format: Asla Markdown (yıldızlar **, alt çizgi _ vb.) kullanma. Tüm metinler saf düz metin olmalıdır.
3. Çıktı mutlaka saf JSON olmalıdır.

FORMAT:
{
  "title": "...",
  "meta": "...",
  "h1": "...",
  "snippet": "...",
  "sections": [
    { "h2": "...", "content": "...", "type": "text|table|vurgu|map", "data": null }
  ],
  "faqs": [
    { "q": "...", "a": "..." }
  ],
  "kpss_notu": "...",
  "onemli_not": "..."
}
`;

    try {
        const completion = await openai.chat.completions.create({
          model: "openai/gpt-oss-120b:free",
          messages: [
            { role: "user", content: prompt }
          ]
        });

        const text = completion.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        if ((error.message.includes("429") || error.message.includes("fetch failed") || error.message.includes("timeout")) && retryCount < 5) {
            const waitTime = 10000;
            console.log(`\n   [!] Hata oluştu, ${waitTime/1000} saniye bekleniyor (Retry ${retryCount + 1})...`);
            await new Promise(r => setTimeout(r, waitTime));
            return generateContent(ilAd, konuBaslik, konuSlug, retryCount + 1);
        }
        console.error(`\n   HATA (${ilAd} - ${konuBaslik}):`, error.message);
        return null;
    }
}

function updateStatusFile(ilAd, status) {
    if (!fs.existsSync(statusFilePath)) return;
    let content = fs.readFileSync(statusFilePath, 'utf8');
    const lines = content.split('\n');
    const newLines = lines.map(line => {
        if (line.includes(`| ${ilAd} |`)) {
            const parts = line.split('|');
            parts[3] = ` ${status} `;
            return parts.join('|');
        }
        return line;
    });
    fs.writeFileSync(statusFilePath, newLines.join('\n'));
}

async function runFullAutomation() {
    console.log("🚀 OPENROUTER GPT-OSS İLE FİNAL OPERASYONU BAŞLADI");
    
    for (const il of siraliIller) {
        console.log(`\n📍 [${il.ad.toUpperCase()}] İşleniyor...`);
        updateStatusFile(il.ad, "⏳");

        let ilTamamlandi = true;
        for (const konu of konular) {
            const filePath = path.join(matrisDir, `${konu.slug}.json`);
            if (!fs.existsSync(filePath)) continue;

            const matris = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // Sadece gerçekten üretilmemiş olanları veya manuel eklenenleri hedefle
            // İstersen burada "last_updated" kontrolünü kaldırıp her şeyi baştan yazdırabiliriz.
            // Ama şimdilik sadece eksik/son illeri hedefliyoruz.
            if (matris.iller[il.slug]?.super_detay?.last_updated === "Mayıs 2026") {
               // console.log(`   - ${konu.baslik}: Atlandı (Güncel)`);
               continue;
            }

            process.stdout.write(`   - ${konu.baslik} üretiliyor... `);
            const data = await generateContent(il.ad, konu.baslik, konu.slug);

            if (data) {
                matris.iller[il.slug] = {
                    ...matris.iller[il.slug],
                    super_detay: {
                        title: data.title,
                        meta: data.meta,
                        h1: data.h1,
                        snippet: data.snippet,
                        sections: data.sections,
                        faqs: data.faqs,
                        last_updated: "Mayıs 2026"
                    },
                    kpss_notu: data.kpss_notu || "",
                    onemli_not: data.onemli_not || ""
                };
                fs.writeFileSync(filePath, JSON.stringify(matris, null, 2));
                console.log("TAMAM");
            } else {
                console.log("BAŞARISIZ");
                ilTamamlandi = false;
            }

            await new Promise(r => setTimeout(r, 1500));
        }

        if (ilTamamlandi) updateStatusFile(il.ad, "✅");
    }
}

runFullAutomation().catch(console.error);
