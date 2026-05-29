import { QuizData } from "@/types/quiz";

// Quiz imports
import quizAkarsular from "../../data/quiz/akarsular.json";
import quizBeseriCografya from "../../data/quiz/beseri-cografya.json";
import quizBolgeJeopolitik from "../../data/quiz/bolge-jeopolitik.json";
import quizCografiKonum from "../../data/quiz/cografi-konum.json";
import quizDaglar from "../../data/quiz/daglar.json";
import quizGenelCografya200 from "../../data/quiz/genel-cografya-200.json";
import quizGoller from "../../data/quiz/goller.json";
import quizIklimBitki from "../../data/quiz/iklim-bitki.json";
import quizJeolojikYapi from "../../data/quiz/jeolojik-yapi.json";
import quizKalkinmaProjeleri from "../../data/quiz/kalkinma-projeleri.json";
import quizKiyiTipleri from "../../data/quiz/kiyi-tipleri.json";
import quizMadenlerEnerji from "../../data/quiz/madenler-enerji.json";
import quizNufusPolitikalari from "../../data/quiz/nufus-politikalari.json";
import quizSanayi from "../../data/quiz/sanayi.json";
import quizSinirKapilari from "../../data/quiz/sinir-kapilari.json";
import quizTarim from "../../data/quiz/tarim.json";
import quizTicaret from "../../data/quiz/ticaret.json";
import quizToprakCevre from "../../data/quiz/toprak-cevre.json";
import quizTurizm from "../../data/quiz/turizm.json";
import quizUlasim from "../../data/quiz/ulasim.json";
import quizYerSekilleri from "../../data/quiz/yer-sekilleri.json";

const quizMap: Record<string, unknown> = {
  akarsular: quizAkarsular,
  "beseri-cografya": quizBeseriCografya,
  "bolge-jeopolitik": quizBolgeJeopolitik,
  "cografi-konum": quizCografiKonum,
  daglar: quizDaglar,
  "genel-cografya-200": quizGenelCografya200,
  goller: quizGoller,
  "iklim-bitki": quizIklimBitki,
  "jeolojik-yapi": quizJeolojikYapi,
  "kalkinma-projeleri": quizKalkinmaProjeleri,
  "kiyi-tipleri": quizKiyiTipleri,
  "madenler-enerji": quizMadenlerEnerji,
  "nufus-politikalari": quizNufusPolitikalari,
  sanayi: quizSanayi,
  "sinir-kapilari": quizSinirKapilari,
  tarim: quizTarim,
  ticaret: quizTicaret,
  "toprak-cevre": quizToprakCevre,
  turizm: quizTurizm,
  ulasim: quizUlasim,
  "yer-sekilleri": quizYerSekilleri,
};

interface LegacyQuizItem {
  id?: string;
  soru?: string;
  question?: string;
  siklar?: string[];
  options?: string[];
  dogru?: string;
  correct_index?: number;
  aciklama?: string;
  explanation?: string;
  harita_il?: string | null;
  zorluk?: "kolay" | "orta" | "zor";
}

export function getQuizData(konuSlug: string): QuizData | null {
  try {
    const rawData = quizMap[konuSlug];
    if (!rawData) return null;

    // Eğer dosya direkt bir array ise (legacy format), QuizData objesine çevir
    if (Array.isArray(rawData)) {
      return {
        konu: konuSlug,
        sorular: (rawData as LegacyQuizItem[]).map((item, index) => ({
          id: item.id || `q-${index}`,
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
        })),
      };
    }

    return rawData as QuizData;
  } catch (error) {
    console.error(`Error loading quiz data for ${konuSlug}:`, error);
    return null;
  }
}

export function quizMevcut(konuSlug: string): boolean {
  return konuSlug in quizMap;
}
