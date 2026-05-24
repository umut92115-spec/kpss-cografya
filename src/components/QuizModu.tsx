"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QuizSoru, QuizSonuc } from "@/types/quiz";
import { Konu } from "@/types";
import clsx from "clsx";
import { saveQuizResult } from "@/lib/gamification";
import { X } from "lucide-react";

const STORAGE_KEY = "kpss_quiz_sonuclar";
const TOP_SCORE_KEY = "kpss_quiz_top";

function sonuclariOku(): QuizSonuc[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function sonucuKaydet(yeniSonuc: QuizSonuc) {
  const mevcutlar = sonuclariOku();
  const guncellenmis = [yeniSonuc, ...mevcutlar].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guncellenmis));

  const topMap: Record<string, number> = JSON.parse(localStorage.getItem(TOP_SCORE_KEY) ?? "{}");
  if (!topMap[yeniSonuc.konuSlug] || yeniSonuc.skor > topMap[yeniSonuc.konuSlug]) {
    topMap[yeniSonuc.konuSlug] = yeniSonuc.skor;
    localStorage.setItem(TOP_SCORE_KEY, JSON.stringify(topMap));
  }
}

const zorluKRenk: Record<string, string> = {
  kolay:
    "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
  orta: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
  zor: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
};

interface QuizModuProps {
  konuSlug: string;
  konuMeta: Konu;
  sorular: QuizSoru[];
}

type FazTip = "hazir" | "quiz" | "sonuc";
type FeedbackMode = "aninda" | "sonunda";
type CevapDurumu = "bekleniyor" | "dogru" | "yanlis";

export default function QuizModu({ konuSlug, konuMeta, sorular = [] }: QuizModuProps) {
  const [faz, setFaz] = useState<FazTip>("hazir");
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("aninda");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isHizliSelect, setIsHizliSelect] = useState(false);
  const [tumCevaplar, setTumCevaplar] = useState<(string | null)[]>([]);
  const [kazanilanXp, setKazanilanXp] = useState<number>(0);
  const [aktifSorular, setAktifSorular] = useState<QuizSoru[]>([]);
  const [soruIndex, setSoruIndex] = useState(0);
  const [secilenSik, setSecilenSik] = useState<string | null>(null);
  const [cevapDurumu, setCevapDurumu] = useState<CevapDurumu>("bekleniyor");
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [baslangicZamani, setBaslangicZamani] = useState<number>(0);
  const [gecenSure, setGecenSure] = useState(0);
  const [sonSonuclar, setSonSonuclar] = useState<QuizSonuc[]>([]);
  const [enYuksekSkor, setEnYuksekSkor] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoStarted = useRef(false);

  const mevcutSoru = aktifSorular[soruIndex];
  const toplamSoru = aktifSorular.length;

  const quizBaslat = useCallback(
    (hizli = false, mod: FeedbackMode = "aninda") => {
      setFeedbackMode(mod);
      let secilecekSorular = [...sorular];
      if (hizli) {
        secilecekSorular = secilecekSorular.sort(() => Math.random() - 0.5).slice(0, 10);
      }
      setAktifSorular(secilecekSorular);
      setSoruIndex(0);
      setSecilenSik(null);
      setCevapDurumu("bekleniyor");
      setDogruSayisi(0);
      setTumCevaplar(new Array(secilecekSorular.length).fill(null));
      setKazanilanXp(0);
      setBaslangicZamani(Date.now());
      setGecenSure(0);
      setFaz("quiz");
    },
    [sorular]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && !hasAutoStarted.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "quick" && sorular.length > 0) {
        hasAutoStarted.current = true;
        quizBaslat(true);
      }
    }
  }, [sorular, quizBaslat]);

  useEffect(() => {
    if (faz === "quiz") {
      timerRef.current = setInterval(() => {
        setGecenSure(Math.floor((Date.now() - baslangicZamani) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [faz, baslangicZamani]);

  const sureFmt = (sn: number) => {
    const dk = Math.floor(sn / 60);
    const s = sn % 60;
    return `${dk}:${String(s).padStart(2, "0")}`;
  };

  const sikasTikla = (sik: string) => {
    if (cevapDurumu !== "bekleniyor" && feedbackMode === "aninda") return;
    setSecilenSik(sik);

    const yeniCevaplar = [...tumCevaplar];
    yeniCevaplar[soruIndex] = sik;
    setTumCevaplar(yeniCevaplar);

    if (feedbackMode === "aninda") {
      const dogru = sik === mevcutSoru.dogru;
      setCevapDurumu(dogru ? "dogru" : "yanlis");
    }
  };

  const oncekiSoru = () => {
    if (soruIndex > 0) {
      const prevIdx = soruIndex - 1;
      setSoruIndex(prevIdx);
      const prevSecilen = tumCevaplar[prevIdx];
      setSecilenSik(prevSecilen);
      if (feedbackMode === "aninda") {
        if (prevSecilen) {
          const dogru = prevSecilen === aktifSorular[prevIdx].dogru;
          setCevapDurumu(dogru ? "dogru" : "yanlis");
        } else {
          setCevapDurumu("bekleniyor");
        }
      } else {
        setCevapDurumu("bekleniyor");
      }
    }
  };

  const sonrakiSoru = () => {
    if (soruIndex + 1 >= toplamSoru) {
      if (timerRef.current) clearInterval(timerRef.current);
      const sureMs = Date.now() - baslangicZamani;

      let finalDogru = 0;
      let finalYanlis = 0;
      aktifSorular.forEach((soru, idx) => {
        if (tumCevaplar[idx] === soru.dogru) {
          finalDogru++;
        } else {
          finalYanlis++;
        }
      });
      setDogruSayisi(finalDogru);

      const skor = Math.round((finalDogru / toplamSoru) * 100);

      const { xpGained } = saveQuizResult(konuSlug, finalDogru, finalYanlis, sureMs);
      setKazanilanXp(xpGained);

      const yeniSonuc: QuizSonuc = {
        konuSlug,
        tarih: new Date().toISOString(),
        toplamSoru,
        dogruSayisi: finalDogru,
        sureMs,
        skor,
      };
      sonucuKaydet(yeniSonuc);
      setSonSonuclar(sonuclariOku());

      const topMap: Record<string, number> = JSON.parse(
        localStorage.getItem(TOP_SCORE_KEY) ?? "{}"
      );
      setEnYuksekSkor(topMap[konuSlug] ?? skor);
      setFaz("sonuc");
    } else {
      const nextIdx = soruIndex + 1;
      setSoruIndex(nextIdx);
      const nextSecilen = tumCevaplar[nextIdx];
      setSecilenSik(nextSecilen);
      if (feedbackMode === "aninda") {
        if (nextSecilen) {
          const dogru = nextSecilen === aktifSorular[nextIdx].dogru;
          setCevapDurumu(dogru ? "dogru" : "yanlis");
        } else {
          setCevapDurumu("bekleniyor");
        }
      } else {
        setCevapDurumu("bekleniyor");
      }
    }
  };

  // READY PHASE
  if (faz === "hazir") {
    const gecmisler = sonuclariOku()
      .filter((s) => s.konuSlug === konuSlug)
      .slice(0, 3);
    const topMap: Record<string, number> = JSON.parse(
      typeof window !== "undefined" ? (localStorage.getItem(TOP_SCORE_KEY) ?? "{}") : "{}"
    );
    const topSkor = topMap[konuSlug] ?? null;

    return (
      <div className="max-w-xl mx-auto text-center py-10 px-4 text-ink-800 dark:text-ink-200">
        <div className="text-6xl mb-4">{konuMeta.icon}</div>
        <h2 className="text-3xl font-bold text-ink-900 dark:text-white mb-2">{konuMeta.baslik}</h2>
        <p className="text-ink-500 dark:text-ink-450 mb-2">Quiz Modu — Sınava Hazırlık</p>

        {topSkor !== null && (
          <div className="inline-block bg-glow-50 dark:bg-glow-950/20 border border-glow-200 dark:border-glow-800/80 rounded-xl px-4 py-2 mb-4 text-glow-800 dark:text-glow-300 text-sm font-semibold shadow-glow">
            🏆 En yüksek skorum: {topSkor}/100
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => {
              setIsHizliSelect(false);
              setShowFeedbackModal(true);
            }}
            className="w-full bg-focus-600 hover:bg-focus-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all shadow-lg shadow-focus-600/20 cursor-pointer"
          >
            Tam Quiz&apos;i Başlat ({sorular.length} Soru) 🚀
          </button>

          <button
            onClick={() => {
              setIsHizliSelect(true);
              setShowFeedbackModal(true);
            }}
            className="w-full bg-glow-500 hover:bg-glow-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all shadow-lg shadow-glow-500/20 cursor-pointer"
          >
            Hızlı Test (10 Karışık Soru) ⏱️
          </button>
        </div>

        {/* ==================== CEVAP GÖSTERİMİ SEÇENEK POPUP MODAL ==================== */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-left">
            <div className="relative w-full max-w-md bg-white dark:bg-ink-900 rounded-[32px] border border-focus-100 dark:border-focus-900/50 shadow-2xl p-6 md:p-8 overflow-hidden animate-scale-up">
              {/* Close Button */}
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-focus-500 to-indigo-600 rounded-2xl text-white text-2xl mb-5 shadow-lg shadow-focus-500/25">
                ❓
              </div>

              <h3 className="text-xl font-black text-ink-900 dark:text-white mb-2 tracking-tight leading-tight">
                Cevap Gösterim Modu
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mb-6 leading-relaxed">
                Soru çözme tarzını belirle. Nasıl ilerlemek istersin?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    quizBaslat(isHizliSelect, "aninda");
                  }}
                  className="w-full text-left p-4 rounded-2xl border border-ink-150 dark:border-ink-750 hover:border-focus-500 dark:hover:border-focus-500 bg-ink-50/50 dark:bg-ink-950/20 hover:bg-focus-50/20 dark:hover:bg-focus-950/30 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-ink-900 dark:text-white group-hover:text-focus-600 dark:group-hover:text-focus-400 transition-colors">
                      Anında Cevap Gösterimi ⏱️
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-focus-500/10 text-focus-600 dark:text-focus-400 border border-focus-500/20">
                      Öğretici
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                    Her sorudan sonra doğru/yanlış yanıtı ve detaylı coğrafi açıklamayı anında gör.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    quizBaslat(isHizliSelect, "sonunda");
                  }}
                  className="w-full text-left p-4 rounded-2xl border border-ink-150 dark:border-ink-750 hover:border-indigo-500 dark:hover:border-indigo-500 bg-ink-50/50 dark:bg-ink-950/20 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/30 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-ink-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Sınav Modu (Sonunda Gör) 📝
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Simülasyon
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                    Gerçek sınav deneyimi. Doğru ve yanlışlarını ancak testi tamamen bitirince
                    incele.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {gecmisler.length > 0 && (
          <div className="text-left bg-paper-100 dark:bg-ink-800 rounded-xl p-4 border border-ink-100 dark:border-ink-700">
            <p className="text-xs font-bold uppercase text-ink-400 dark:text-ink-500 mb-3">
              Son Denemelerim
            </p>
            {gecmisler.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1.5 border-b border-ink-100 dark:border-ink-700 last:border-0 text-sm"
              >
                <span className="text-ink-500 dark:text-ink-400">
                  {new Date(s.tarih).toLocaleDateString("tr-TR")}
                </span>
                <span className="font-semibold text-ink-700 dark:text-ink-350">
                  {s.dogruSayisi}/{s.toplamSoru}
                </span>
                <span
                  className={clsx(
                    "font-bold",
                    s.skor >= 70
                      ? "text-green-600 dark:text-green-400"
                      : s.skor >= 40
                        ? "text-amber-600 dark:text-amber-405"
                        : "text-red-600 dark:text-red-400"
                  )}
                >
                  {s.skor}/100
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // QUIZ PHASE
  if (faz === "quiz") {
    const ilerleme = toplamSoru > 0 ? (soruIndex / toplamSoru) * 100 : 0;

    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-6 text-ink-800 dark:text-ink-200">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-ink-500 dark:text-ink-400">
            Soru <span className="text-ink-900 dark:text-white">{soruIndex + 1}</span> /{" "}
            {toplamSoru}
          </span>
          <span className="text-sm font-mono font-semibold text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-800 px-3 py-1 rounded-lg">
            ⏱ {sureFmt(gecenSure)}
          </span>
          <span
            className={clsx(
              "text-xs font-bold px-2.5 py-1 rounded-full border uppercase font-mono",
              zorluKRenk[mevcutSoru.zorluk]
            )}
          >
            {mevcutSoru.zorluk}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-ink-100 dark:bg-ink-800 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-focus-400 to-focus-500 rounded-full transition-all duration-500"
            style={{ width: `${ilerleme}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-ink-850 rounded-2xl border border-ink-100 dark:border-ink-700/80 shadow-card p-4 md:p-5 mb-4">
          <div className="text-base md:text-lg font-semibold text-ink-900 dark:text-white leading-relaxed space-y-2">
            {mevcutSoru.soru.split("\n").map((line, index, arr) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Son anlamlı satırı bul (soru cümlesi) — o bold, gerisi normal
              const lastMeaningfulIndex = [...arr].reverse().findIndex((l) => l.trim());
              const lastIdx = arr.length - 1 - lastMeaningfulIndex;
              const isLastLine = index === lastIdx;

              // Madde numaralı satırlar: "I. ", "II. ", "1. " vb. → girinti
              const isStatement = /^(I{1,3}|IV|V|X|\d+)\.\s/.test(trimmed);

              return (
                <p
                  key={index}
                  className={clsx(
                    "text-ink-900 dark:text-white",
                    isLastLine ? "font-bold pt-2" : "font-normal",
                    isStatement && !isLastLine && "pl-4"
                  )}
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
          {mevcutSoru.gorsel && (
            <div className="mt-3 overflow-hidden rounded-xl border border-ink-100 dark:border-ink-700/80 bg-ink-50/50 dark:bg-ink-900/50 flex justify-center p-2">
              <img
                src={
                  mevcutSoru.gorsel.startsWith("/")
                    ? mevcutSoru.gorsel
                    : `/images/quizzes/${mevcutSoru.gorsel}`
                }
                alt="Soru Harita Görseli"
                className="max-h-[140px] sm:max-h-[180px] md:max-h-[220px] object-contain rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {mevcutSoru.siklar.map((sik, index) => {
            const isDogru = sik === mevcutSoru.dogru;
            const isSecilen = sik === secilenSik;
            const isLastOptionAndOdd =
              index === mevcutSoru.siklar.length - 1 && mevcutSoru.siklar.length % 2 !== 0;

            let renk =
              "bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-800 dark:text-ink-200 hover:border-focus-300 dark:hover:border-focus-700 hover:bg-focus-50 dark:hover:bg-focus-950/20";

            if (feedbackMode === "aninda") {
              if (cevapDurumu !== "bekleniyor") {
                if (isDogru)
                  renk =
                    "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-300";
                else if (isSecilen && !isDogru)
                  renk =
                    "bg-rose-50 dark:bg-rose-950/20 border-rose-400 dark:border-rose-700/80 text-rose-800 dark:text-rose-300";
                else
                  renk =
                    "bg-white dark:bg-ink-800 border-ink-100 dark:border-ink-850 text-ink-400 dark:text-ink-600";
              }
            } else {
              // sınav modu: sadece secileni vurgula
              if (isSecilen) {
                renk =
                  "bg-focus-50 dark:bg-focus-950/20 border-focus-400 dark:border-focus-600 text-focus-800 dark:text-focus-400";
              }
            }

            return (
              <button
                key={sik}
                onClick={() => sikasTikla(sik)}
                disabled={cevapDurumu !== "bekleniyor" && feedbackMode === "aninda"}
                className={clsx(
                  "w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 text-xs sm:text-sm md:text-base",
                  renk,
                  isLastOptionAndOdd && "sm:col-span-2",
                  (cevapDurumu === "bekleniyor" || feedbackMode === "sonunda") &&
                    "cursor-pointer active:scale-[0.98]",
                  cevapDurumu !== "bekleniyor" && feedbackMode === "aninda" && "cursor-default"
                )}
              >
                <span className="flex items-center gap-2">
                  {feedbackMode === "aninda" && cevapDurumu !== "bekleniyor" && isDogru && (
                    <span>✅</span>
                  )}
                  {feedbackMode === "aninda" &&
                    cevapDurumu !== "bekleniyor" &&
                    isSecilen &&
                    !isDogru && <span>❌</span>}
                  {sik}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation (only in anında mode) */}
        {feedbackMode === "aninda" && cevapDurumu !== "bekleniyor" && (
          <div
            className={clsx(
              "rounded-xl p-3 border-l-4 mb-4 animate-fade-in text-xs sm:text-sm",
              cevapDurumu === "dogru"
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-300"
            )}
          >
            <p className="font-bold text-sm mb-1">
              {cevapDurumu === "dogru"
                ? "✅ Doğru!"
                : `❌ Yanlış! Doğru cevap: ${mevcutSoru.dogru}`}
            </p>
            <p className="text-sm leading-relaxed">{mevcutSoru.aciklama}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={oncekiSoru}
            disabled={soruIndex === 0}
            className={clsx(
              "flex-1 font-bold py-3 px-4 rounded-xl border transition-all text-center text-sm md:text-base cursor-pointer",
              soruIndex === 0
                ? "bg-ink-50 dark:bg-ink-800 text-ink-300 dark:text-ink-650 border-ink-150 dark:border-ink-750/30 cursor-not-allowed opacity-40"
                : "bg-ink-100 dark:bg-ink-800 hover:bg-ink-150 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-200 border-ink-200 dark:border-ink-700"
            )}
          >
            ← Önceki Soru
          </button>

          <button
            onClick={sonrakiSoru}
            disabled={
              feedbackMode === "sonunda" ? secilenSik === null : cevapDurumu === "bekleniyor"
            }
            className={clsx(
              "flex-1 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-center text-sm md:text-base cursor-pointer",
              (feedbackMode === "sonunda" ? secilenSik === null : cevapDurumu === "bekleniyor")
                ? "bg-focus-300 dark:bg-focus-800/40 text-focus-100 dark:text-focus-500 cursor-not-allowed"
                : "bg-focus-600 hover:bg-focus-700"
            )}
          >
            {soruIndex + 1 >= toplamSoru ? "Sonuçları Gör →" : "Sonraki Soru →"}
          </button>
        </div>
      </div>
    );
  }

  // RESULT PHASE
  const sonFinalDogru = dogruSayisi;
  const finalSkor = Math.round((sonFinalDogru / toplamSoru) * 100);
  const sonSureSn = Math.floor(gecenSure);

  const skorRenk =
    finalSkor >= 80 ? "text-green-600" : finalSkor >= 50 ? "text-amber-600" : "text-red-600";

  const sonucMesaj =
    finalSkor >= 80
      ? "🎉 Mükemmel! KPSS'ye hazırsın."
      : finalSkor >= 60
        ? "👍 İyi! Biraz daha tekrar yap."
        : finalSkor >= 40
          ? "📚 Konu anlatımını tekrar oku."
          : "💪 Hayal kırıklığına uğrama, tekrar dene!";

  return (
    <div className="max-w-xl mx-auto text-center py-10 px-4 text-ink-800 dark:text-ink-200">
      <div className="text-6xl mb-4">{finalSkor >= 70 ? "🏆" : "📊"}</div>
      <h2 className="text-3xl font-bold text-ink-900 dark:text-white mb-1">Quiz Bitti!</h2>
      <p className="text-ink-500 dark:text-ink-450 mb-6">{konuMeta.baslik}</p>

      {/* Score Card */}
      <div className="bg-white dark:bg-ink-850 rounded-2xl border border-ink-100 dark:border-ink-700/80 shadow-card p-8 mb-6">
        <p
          className={clsx(
            "text-7xl font-black mb-2",
            skorRenk,
            finalSkor >= 80 &&
              "bg-gradient-to-r from-glow-500 to-glow-600 bg-clip-text text-transparent"
          )}
        >
          {finalSkor}
        </p>
        <p className="text-ink-400 dark:text-ink-550 text-sm mb-4">/ 100 puan</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-850/30">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-450">
              {sonFinalDogru}
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs">Doğru</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-3 border border-rose-100 dark:border-rose-850/30">
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-450">
              {toplamSoru - sonFinalDogru}
            </p>
            <p className="text-rose-700 dark:text-rose-400 text-xs">Yanlış</p>
          </div>
          <div className="bg-focus-50 dark:bg-focus-950/20 rounded-xl p-3 border border-focus-100 dark:border-focus-850/30">
            <p className="text-2xl font-bold text-focus-600 dark:text-focus-400">
              {sureFmt(sonSureSn)}
            </p>
            <p className="text-focus-700 dark:text-focus-400 text-xs">Süre</p>
          </div>
        </div>
      </div>

      <p className="text-ink-600 dark:text-ink-350 mb-6 text-lg">{sonucMesaj}</p>

      {kazanilanXp > 0 && (
        <div className="bg-amber-100 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900 text-amber-800 dark:text-amber-400 rounded-xl py-3 px-6 mb-6 inline-flex items-center gap-2 font-bold shadow-sm">
          🌟 +{kazanilanXp} XP Kazandın!
        </div>
      )}

      {feedbackMode === "sonunda" && (
        <div className="text-left bg-white dark:bg-ink-800 rounded-xl p-4 md:p-6 border border-ink-200 dark:border-ink-700 mb-6 max-h-96 overflow-y-auto shadow-inner">
          <h3 className="font-bold text-lg mb-4 text-ink-900 dark:text-white border-b border-ink-200 dark:border-ink-700 pb-2">
            Cevap Anahtarı ve Açıklamalar
          </h3>
          <div className="flex flex-col gap-4">
            {aktifSorular.map((soru, idx) => {
              const uSec = tumCevaplar[idx];
              const dogruMu = uSec === soru.dogru;
              return (
                <div
                  key={idx}
                  className={clsx(
                    "p-4 rounded-xl border-l-4",
                    dogruMu
                      ? "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-400 text-emerald-900 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/10 border-rose-400 text-rose-900 dark:text-rose-300"
                  )}
                >
                  <p className="font-bold text-sm mb-1.5">Soru {idx + 1}</p>
                  <p className="text-xs text-ink-600 dark:text-ink-400 mb-2.5 line-clamp-2">
                    {soru.soru.replace(/\n/g, " ")}
                  </p>
                  <div className="flex gap-4 text-xs font-semibold mb-2">
                    <span
                      className={
                        dogruMu
                          ? "text-emerald-700 dark:text-emerald-450"
                          : "text-rose-700 dark:text-rose-450"
                      }
                    >
                      Senin Cevabın: {uSec || "Boş"}
                    </span>
                    {!dogruMu && (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        Doğru Cevap: {soru.dogru}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-700 dark:text-ink-300 bg-white/50 dark:bg-ink-900/50 p-2.5 rounded-lg mt-2 italic border border-ink-100 dark:border-ink-800">
                    💡 {soru.aciklama}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {enYuksekSkor !== null && (
        <p className="text-sm text-glow-700 dark:text-glow-400 font-semibold mb-4 shadow-glow inline-block px-3 py-1 rounded-lg bg-glow-50 dark:bg-glow-950/20 border border-glow-200 dark:border-glow-800/80">
          🏅 En yüksek skorum: {enYuksekSkor}/100
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => quizBaslat()}
          className="flex-1 bg-focus-600 hover:bg-focus-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
        >
          🔄 Tekrar Dene
        </button>
        <a
          href={`/konu/${konuSlug}`}
          className="flex-1 bg-ink-50 dark:bg-ink-800 hover:bg-ink-100 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-200 font-bold py-3.5 rounded-xl transition-colors border border-ink-100 dark:border-ink-700"
        >
          📖 Konuya Git
        </a>
      </div>

      {/* Past Results */}
      {sonSonuclar.filter((s) => s.konuSlug === konuSlug).length > 1 && (
        <div className="mt-8 text-left bg-paper-100 dark:bg-ink-850 rounded-xl p-4 border border-ink-100 dark:border-ink-700">
          <p className="text-xs font-bold uppercase text-ink-400 dark:text-ink-500 mb-3">
            Geçmiş Denemelerim
          </p>
          {sonSonuclar
            .filter((s) => s.konuSlug === konuSlug)
            .slice(0, 5)
            .map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1.5 border-b border-ink-100 dark:border-ink-700 last:border-0 text-sm"
              >
                <span className="text-ink-500 dark:text-ink-400">
                  {new Date(s.tarih).toLocaleDateString("tr-TR")}
                </span>
                <span className="text-ink-600 dark:text-ink-300">
                  {s.dogruSayisi}/{s.toplamSoru}
                </span>
                <span
                  className={clsx(
                    "font-bold",
                    s.skor >= 70
                      ? "text-green-600"
                      : s.skor >= 40
                        ? "text-amber-600"
                        : "text-red-600"
                  )}
                >
                  {s.skor}/100
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
