"use server";

import fs from "fs/promises";
import path from "path";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const CATEGORY_MAP = {
  cografi_konum: {
    name: "Türkiye'nin Coğrafi Konumu",
    count: 2,
    slugs: ["cografi-konum", "sinir-kapilari"],
  },
  yer_sekilleri: {
    name: "Türkiye'nin Yer Şekilleri ve Su Varlığı",
    count: 3,
    slugs: ["yer-sekilleri", "daglar", "goller", "akarsular", "jeolojik-yapi", "kiyi-tipleri"],
  },
  iklim_bitki: {
    name: "Türkiye'nin İklimi ve Bitki Örtüsü",
    count: 2,
    slugs: ["iklim-bitki"],
  },
  toprak_cevre: {
    name: "Toprak, Doğa ve Çevre",
    count: 1,
    slugs: ["toprak-cevre"],
  },
  nufus_yerlesme: {
    name: "Türkiye'de Nüfus ve Yerleşme",
    count: 3,
    slugs: ["beseri-cografya"],
  },
  tarim_hayvancilik: {
    name: "Türkiye'de Tarım ve Hayvancılık",
    count: 3,
    slugs: ["tarim"],
  },
  madenler_enerji: {
    name: "Türkiye'de Madenler ve Enerji Kaynakları",
    count: 2,
    slugs: ["madenler-enerji"],
  },
  sanayi_ulasim: {
    name: "Türkiye'de Sanayi ve Ulaşım",
    count: 2,
    slugs: ["sanayi", "ulasim"],
  },
  ticaret_turizm: {
    name: "Türkiye'de Ticaret ve Turizm",
    count: 2,
    slugs: ["ticaret", "turizm", "bolge-jeopolitik", "kalkinma-projeleri"],
  },
};

async function loadQuestionsFromSlug(slug: string): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), "data/quiz", `${slug}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);
    let sorular: any[] = [];
    if (Array.isArray(rawData)) {
      sorular = rawData;
    } else if (rawData && typeof rawData === "object" && Array.isArray(rawData.sorular)) {
      sorular = rawData.sorular;
    }
    return sorular.map((item, index) => ({
      id: item.id || `${slug}-q-${index}`,
      soru: item.soru || item.question || "",
      siklar: item.siklar || item.options || [],
      dogru:
        item.dogru ||
        (item.options && item.correct_index !== undefined
          ? item.options[item.correct_index]
          : "") ||
        "",
      aciklama: item.aciklama || item.explanation || "",
      harita_il: item.harita_il || null,
      zorluk: item.zorluk || "orta",
      gorsel: item.gorsel || null,
      konu_slug: slug,
    }));
  } catch (error) {
    console.error(`Error loading questions for ${slug}:`, error);
    return [];
  }
}

export async function generateDenemeAction() {
  try {
    let denemeSorulari: any[] = [];

    // Her bir kategori için belirlenen sayıda soru çek
    for (const key of Object.keys(CATEGORY_MAP) as Array<keyof typeof CATEGORY_MAP>) {
      const config = CATEGORY_MAP[key];
      let categoryAllQuestions: any[] = [];

      // Kategori altındaki tüm konuların sorularını yükle
      for (const slug of config.slugs) {
        const topicQuestions = await loadQuestionsFromSlug(slug);
        categoryAllQuestions = [...categoryAllQuestions, ...topicQuestions];
      }

      if (categoryAllQuestions.length > 0) {
        // Soruları karıştır ve hedef adet kadarını seç
        const shuffled = shuffleArray(categoryAllQuestions);
        const selected = shuffled.slice(0, config.count);
        denemeSorulari = [...denemeSorulari, ...selected];
      }
    }

    // Elde edilen 20 soruyu kendi içinde de karıştır ki sırayla gelmesinler
    const finalSorular = shuffleArray(denemeSorulari).slice(0, 20);

    return {
      success: true,
      sorular: finalSorular,
    };
  } catch (error: any) {
    console.error("Failed to generate deneme:", error);
    return {
      success: false,
      error: error.message || "Deneme sınavı oluşturulamadı.",
    };
  }
}
