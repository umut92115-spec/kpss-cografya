import fs from 'fs';
import path from 'path';

interface QuizSoru {
  id: string;
  soru: string;
  siklar: string[];
  dogru: string;
  aciklama: string;
  harita_il: string | null;
  zorluk: 'kolay' | 'orta' | 'zor';
  gorsel: string | null;
  gorsel_veri: Record<string, string> | null;
}

interface QuizData {
  konu: string;
  sorular: QuizSoru[];
}

const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-55dbe3dcc6c94efdabc3aaf4b5f02792';
const API_URL = 'https://api.deepseek.com/chat/completions';

// User's mappings
const MODEL_EASY = 'deepseek-chat'; // "v4 flash"
const MODEL_HARD = 'deepseek-reasoner'; // "v4 pro"

const PROJECT_ROOT = path.join(process.cwd());
const PROTOCOL_PATH = path.join(PROJECT_ROOT, 'SORU_URETIM_PROTOKOLU.md');
const ILLER_PATH = path.join(PROJECT_ROOT, 'data', 'iller.json');
const DATA_PATH = path.join(PROJECT_ROOT, 'data', 'leaflet', 'turkiye_cografya.json');
const QUIZ_DIR = path.join(PROJECT_ROOT, 'data', 'quiz');

const args = process.argv.slice(2);
const topicArg = args.find(a => a.startsWith('--topic='))?.split('=')[1];
const countArg = args.find(a => a.startsWith('--count='))?.split('=')[1];

if (!topicArg || !countArg) {
  console.error('Kullanım: npx tsx scripts/generate_questions.ts --topic=akarsular --count=100');
  process.exit(1);
}

const targetCount = parseInt(countArg, 10);
const topic = topicArg;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(systemPrompt: string, userPrompt: string, model: string, retries = 3): Promise<QuizSoru[]> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API - ${model}] İstek atılıyor (Deneme ${i + 1}/${retries})...`);
      
      const payload: any = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      };
      // reasoner doesn't support temperature well sometimes, but we'll include it for chat
      if (model !== 'deepseek-reasoner') {
        payload.temperature = 0.7;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      let jsonStr = content;
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0];
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0];
      }
      
      const parsed: QuizSoru[] = JSON.parse(jsonStr.trim());
      if (!Array.isArray(parsed)) throw new Error("API array döndürmedi.");
      
      return parsed;
    } catch (e: any) {
      console.error(`[HATA - ${model}] API çağrısı başarısız: ${e.message}`);
      if (i === retries - 1) throw e;
      await sleep(3000);
    }
  }
  return [];
}

async function main() {
  console.log(`🚀 Üretim başlatılıyor: Konu=${topic}, Hedef Soru=${targetCount}`);
  
  const protocolText = fs.readFileSync(PROTOCOL_PATH, 'utf-8');
  const illerData = fs.readFileSync(ILLER_PATH, 'utf-8');
  let geoDataChunk = "{}";
  if (fs.existsSync(DATA_PATH)) {
    const geoData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    geoDataChunk = JSON.stringify(geoData[topic] || null).substring(0, 5000);
  }

  const SYSTEM_PROMPT = `Sen uzman bir KPSS Coğrafya soru yazarı ve akademisyenisin.
Aşağıda verilen "Soru Üretim Protokolü (SÜP-v1.0)" kurallarına harfiyen uymak zorundasın.

=== SORU ÜRETİM PROTOKOLÜ ===
${protocolText}

=== İLLER LİSTESİ ===
${illerData}

KURALLAR:
- SADECE JSON formatında bir array döndür (markdown içinde olabilir).
- "dogru" alanı şıklardaki değerle BİREBİR aynı olmalı.
- Açıklama kısmında asla iç sesini yansıtma, net 80-120 kelimelik bir akademik metin olsun.`;

  const targetFilePath = path.join(QUIZ_DIR, `${topic}.json`);
  let currentQuizData: QuizData = { konu: topic, sorular: [] };
  
  if (fs.existsSync(targetFilePath)) {
    try {
      currentQuizData = JSON.parse(fs.readFileSync(targetFilePath, 'utf-8'));
    } catch (e) {
      console.log("Mevcut JSON okunamadı, sıfırdan başlanacak.");
    }
  }
  
  const initialCount = currentQuizData.sorular.length;
  let generatedCount = 0;
  
  while (generatedCount < targetCount) {
    const remaining = targetCount - generatedCount;
    // Batch rules: 2 easy, 8 medium/hard
    const easyCount = Math.min(2, Math.max(1, Math.floor(remaining * 0.2)));
    const hardCount = Math.min(8, remaining - easyCount);
    
    if (remaining <= 0) break;

    const batchId = Math.floor(Date.now() / 1000);
    
    try {
      // 1. Kolay Sorular (v4 flash -> deepseek-chat)
      let easyQuestions: QuizSoru[] = [];
      if (easyCount > 0) {
        const easyPrompt = `Lütfen '${topic}' konusuyla ilgili ${easyCount} adet "kolay" seviyede soru üret.
İlgili konu verisi: ${geoDataChunk}
Soru ID'leri "${topic}-${batchId}-E1" formatında olsun. Kalıpları ÖSYM standartlarında, sadece kolay düzey doğrudan bilgi sorgusu yapacak şekilde kurgula.`;
        easyQuestions = await fetchWithRetry(SYSTEM_PROMPT, easyPrompt, MODEL_EASY);
        console.log(`✅ ${easyQuestions.length} Kolay soru (v4-flash) üretildi.`);
      }

      // 2. Orta/Zor/Görselli Sorular (v4 pro -> deepseek-reasoner)
      let hardQuestions: QuizSoru[] = [];
      if (hardCount > 0) {
        const hardPrompt = `Lütfen '${topic}' konusuyla ilgili ${hardCount} adet soru üret. Dağılım: 5 adet "orta", geri kalanı "zor" seviye. 
ÖZEL İSTEK: Zor sorulardan en az 1-2 tanesi görselli veya Kalıp F (I, II, III) olsun. Ayrıca "Gemi/Kıyı Seyahati" kurguları üret (Örn: Türkiye'de X limanından yola çıkıp kıyı şeridini takip ederek Y limanına giden bir gemi, yol boyunca hangi limanlara, deltalara veya nehirlerin döküldüğü yerlere rastlar?). Harita sorularına ("harita_il" kullanan) mutlaka ağırlık ver.
İlgili konu verisi: ${geoDataChunk}
Soru ID'leri "${topic}-${batchId}-H2" formatında olsun.`;
        hardQuestions = await fetchWithRetry(SYSTEM_PROMPT, hardPrompt, MODEL_HARD);
        console.log(`✅ ${hardQuestions.length} Orta/Zor soru (v4-pro) üretildi.`);
      }
      
      const newQuestions = [...easyQuestions, ...hardQuestions];
      if (newQuestions.length === 0) {
        console.error("Hiç soru üretilemedi, döngü sonlandırılıyor.");
        break;
      }
      
      currentQuizData.sorular.push(...newQuestions);
      fs.writeFileSync(targetFilePath, JSON.stringify(currentQuizData, null, 2), 'utf-8');
      
      generatedCount += newQuestions.length;
      console.log(`💾 Dosya güncellendi: ${targetFilePath} (Toplam soru: ${currentQuizData.sorular.length})`);
      
    } catch (err: any) {
      console.error(`🚨 Batch üretimi durduruldu: ${err.message}`);
      break;
    }
  }

  console.log(`🎉 İşlem tamam! Konu: ${topic}, Üretilen Yeni Soru: ${generatedCount}`);
}

main();
