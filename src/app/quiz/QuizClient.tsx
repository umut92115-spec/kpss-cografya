"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Map,
  Target,
  X,
  Trophy,
  BarChart3,
  HelpCircle,
  Award,
  Clock,
} from "lucide-react";
import {
  getStats,
  getCurrentRank,
  getNextRank,
  getLeaderboard,
  UserStats,
  RANKS,
} from "@/lib/gamification";
import QuizModu from "@/components/QuizModu";
import { generateDenemeAction } from "./actions";

const denemeMeta = {
  slug: "deneme",
  baslik: "Genel Deneme Sınavı",
  kisa_baslik: "Genel Deneme",
  kpss_soru_sayisi_ort: 20,
  agirlik: "yüksek",
  icon: "📝",
  renk: "#4F46E5",
  harita_renk: "#818CF8",
  aciklama: "Tüm KPSS coğrafya konularını kapsayan 20 soruluk genel deneme sınavı.",
};

export default function QuizClient({ konular }: { konular: any[] }) {
  const [mode, setMode] = useState<"initial" | "konu" | "deneme">("initial");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeModal, setActiveModal] = useState<"stats" | "ranks" | "leaderboard" | null>(null);
  const [denemeSorulari, setDenemeSorulari] = useState<any[]>([]);
  const [isLoadingDeneme, setIsLoadingDeneme] = useState(false);

  useEffect(() => {
    const s = getStats();
    setStats(s);

    if (!s.hasSeenRankOverview) {
      s.hasSeenRankOverview = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("kpss_cografya_stats", JSON.stringify(s));
      }
      setActiveModal("ranks");
    }
  }, []);

  // Sync stats when modal opens or updates
  const refreshStats = () => {
    setStats(getStats());
  };

  const rank = stats ? getCurrentRank(stats.totalXP) : null;
  const nextRank = stats ? getNextRank(stats.totalXP) : null;

  // Leaderboard logic
  const leaderboardList = stats && rank ? getLeaderboard(stats.totalXP, rank.name, rank.icon) : [];
  const userPosition = leaderboardList.findIndex((u) => u.isCurrentUser) + 1;

  if (mode === "initial") {
    return (
      <div className="max-w-4xl mx-auto text-center px-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-ink-900 dark:text-white mb-4 tracking-tight">
          Soru Bankası
        </h1>
        <p className="text-ink-500 text-lg mb-8 max-w-2xl mx-auto">
          Hangi modda ilerlemek istersin? İster konuları pekiştir, ister kendini genel denemelerle
          test et.
        </p>

        {/* Profil Özeti Card */}
        {rank && stats && (
          <div className="max-w-2xl mx-auto mb-10 bg-gradient-to-r from-focus-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative overflow-hidden group">
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            {/* Clickable Rank Info & Access badging */}
            <div className="flex-1 flex items-center gap-4 text-left p-2 rounded-2xl relative z-10">
              <div
                onClick={() => {
                  refreshStats();
                  setActiveModal("stats");
                }}
                className="text-5xl shrink-0 drop-shadow-md hover:scale-110 cursor-pointer transition-transform duration-300"
                title="Rütbe Detayı ve İstatistikleri Gör"
              >
                {rank.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-indigo-150 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90 leading-none mb-1">
                  Mevcut Rütben
                </div>
                <div
                  onClick={() => {
                    refreshStats();
                    setActiveModal("stats");
                  }}
                  className="text-2xl font-black truncate leading-tight hover:text-amber-300 cursor-pointer transition-colors"
                >
                  {rank.name}
                </div>

                {/* Horizontally aligned access pills directly under the rank name */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      refreshStats();
                      setActiveModal("stats");
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <BarChart3 size={11} /> İstatistik
                  </button>
                  <button
                    onClick={() => {
                      refreshStats();
                      setActiveModal("leaderboard");
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase bg-amber-400/20 hover:bg-amber-400/35 text-amber-300 border border-amber-400/20 hover:border-amber-400/35 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    🏆 Sıralama: #{userPosition}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats & Leaderboard Action Button */}
            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/15 pt-4 md:pt-0 relative z-10">
              <div className="flex gap-5 text-center">
                <div>
                  <div className="text-2xl font-black text-amber-300 drop-shadow-sm">
                    {stats.totalXP}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-150 uppercase tracking-wider">
                    Toplam XP
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-300 drop-shadow-sm">
                    {stats.totalTestsCompleted}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-150 uppercase tracking-wider">
                    Çözülen Test
                  </div>
                </div>
                {stats.loginStreak && stats.loginStreak > 0 ? (
                  <div>
                    <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-0.5 drop-shadow-sm">
                      🔥{stats.loginStreak}
                    </div>
                    <div className="text-[10px] font-bold text-indigo-150 uppercase tracking-wider">
                      Seri (Gün)
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Leaderboard Button */}
              <button
                onClick={() => {
                  refreshStats();
                  setActiveModal("leaderboard");
                }}
                className="flex items-center gap-1.5 px-4 py-3 bg-amber-400 hover:bg-amber-300 text-ink-950 text-xs font-black rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-wider"
              >
                <Trophy size={14} className="shrink-0 animate-bounce" /> Liderlik
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            disabled={isLoadingDeneme}
            onClick={async () => {
              try {
                setIsLoadingDeneme(true);
                const res = await generateDenemeAction();
                if (res.success && res.sorular) {
                  setDenemeSorulari(res.sorular);
                  setMode("deneme");
                } else {
                  alert(res.error || "Deneme sınavı oluşturulamadı.");
                }
              } catch (err) {
                console.error(err);
                alert("Sınav oluşturulurken bir hata oluştu.");
              } finally {
                setIsLoadingDeneme(false);
              }
            }}
            className="group p-8 rounded-3xl border-2 border-ink-100 dark:border-ink-800 hover:border-focus-300 dark:hover:border-focus-700 bg-white dark:bg-ink-900 hover:bg-focus-50 dark:hover:bg-focus-950/30 transition-all flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md cursor-pointer relative"
          >
            {isLoadingDeneme && (
              <div className="absolute inset-0 bg-white/70 dark:bg-ink-950/70 rounded-3xl flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-focus-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="w-20 h-20 bg-focus-50 dark:bg-focus-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden border border-focus-100 dark:border-focus-800">
              <img
                src="/images/deneme.gif"
                alt="Deneme Modu"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <Target size={32} className="absolute text-focus-600 opacity-20" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-2">Deneme Çöz</h2>
            <p className="text-ink-500 text-sm">
              Tüm konulardan karma sorularla gerçek sınav deneyimini yaşa.
            </p>
          </button>

          <button
            onClick={() => setMode("konu")}
            className="group p-8 rounded-3xl border-2 border-ink-100 dark:border-ink-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-ink-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md"
          >
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden border border-emerald-100 dark:border-emerald-800">
              <img
                src="/images/konu.gif"
                alt="Konu Pekiştirme"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <Map size={32} className="absolute text-emerald-600 opacity-20" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-2">Konu Pekiştir</h2>
            <p className="text-ink-500 text-sm">
              Spesifik konuları seçerek o alandaki eksiklerini kapat.
            </p>
          </button>
        </div>

        {/* Features row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: "⏱️", label: "Süreli mod" },
            { icon: "📊", label: "Anlık analiz" },
            { icon: "🏆", label: "Skor takibi" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-center gap-2.5 bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 px-4 py-4 shadow-sm"
            >
              <span className="text-xl">{f.icon}</span>
              <span className="text-sm font-semibold text-ink-700 dark:text-ink-300">
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* ==================== 1. MODAL: DETAYLI İSTATİSTİKLER ==================== */}
        {activeModal === "stats" && stats && rank && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-left">
            <div className="relative w-full max-w-2xl bg-white dark:bg-ink-900 rounded-[32px] border border-focus-100 dark:border-focus-900/50 shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-scale-up">
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-focus-600 dark:text-focus-400 w-8 h-8" />
                <h3 className="text-2xl font-black text-ink-900 dark:text-white tracking-tight">
                  İstasyon Raporu & İstatistikler
                </h3>
              </div>

              {/* Rütbe İlerleme Çubuğu */}
              <div className="bg-focus-50/50 dark:bg-focus-950/20 border border-focus-100 dark:border-focus-950 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{rank.icon}</span>
                    <div>
                      <div className="text-[10px] text-focus-600 dark:text-focus-400 font-bold uppercase tracking-wider leading-none">
                        Şu Anki Rütben
                      </div>
                      <h4 className="text-xl font-bold text-ink-900 dark:text-white leading-tight mt-1">
                        {rank.name}
                      </h4>
                    </div>
                  </div>
                  {nextRank && (
                    <div className="text-right">
                      <div className="text-[10px] text-ink-400 font-bold uppercase tracking-wider leading-none">
                        Sonraki Hedef
                      </div>
                      <h4 className="text-sm font-semibold text-ink-600 dark:text-indigo-400 leading-tight mt-1 flex items-center justify-end gap-1">
                        <span>{nextRank.icon}</span> {nextRank.name}
                      </h4>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {nextRank ? (
                  (() => {
                    const userProgress = stats.totalXP - rank.xp;
                    const neededProgress = nextRank.xp - rank.xp;
                    const percent = Math.min(
                      100,
                      Math.max(0, (userProgress / neededProgress) * 100)
                    );
                    return (
                      <div>
                        <div className="w-full bg-ink-200 dark:bg-ink-800 rounded-full h-3 overflow-hidden border border-ink-300 dark:border-ink-700 mb-2">
                          <div
                            className="bg-gradient-to-r from-focus-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-ink-500 dark:text-ink-400">
                          <span>{stats.totalXP} XP</span>
                          <span>{nextRank.xp} XP</span>
                        </div>
                        <p className="text-[11px] font-bold text-focus-600 dark:text-focus-400 text-center mt-2">
                          Bir sonraki seviyeye ulaşmak için son {nextRank.xp - stats.totalXP} XP
                          kaldı! 🚀
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center font-bold text-amber-500 py-2">
                    👑 Tebrikler! Coğrafya Bilgesi olarak maksimum rütbeye ulaştın!
                  </div>
                )}
              </div>

              {/* Global Sıralama & Streak Özet */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-ink-50 dark:bg-ink-800/50 border border-ink-150 dark:border-ink-750 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                    🏆
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400 font-bold uppercase tracking-wider">
                      Genel Sıralaman
                    </div>
                    <div className="text-lg font-black text-ink-900 dark:text-white mt-0.5">
                      #{userPosition}. Sıra
                    </div>
                  </div>
                </div>

                <div className="bg-ink-50 dark:bg-ink-800/50 border border-ink-150 dark:border-ink-750 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl shrink-0">
                    🔥
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400 font-bold uppercase tracking-wider">
                      Giriş Serin
                    </div>
                    <div className="text-lg font-black text-ink-900 dark:text-white mt-0.5">
                      {stats.loginStreak || 0} Gün
                    </div>
                  </div>
                </div>
              </div>

              {/* Konu İstatistikleri */}
              <h4 className="text-base font-extrabold text-ink-900 dark:text-white mb-3 uppercase tracking-wider text-focus-600 dark:text-focus-400">
                Konu Bazlı Başarı Oranları
              </h4>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {konular.map((k) => {
                  const stat = stats.topicStats[k.slug];
                  if (!stat) {
                    return (
                      <div
                        key={k.slug}
                        className="bg-ink-50/50 dark:bg-ink-900/30 border border-dashed border-ink-200 dark:border-ink-800 p-4 rounded-2xl flex justify-between items-center text-xs text-ink-400"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{k.icon}</span>
                          <span className="font-semibold">{k.baslik}</span>
                        </div>
                        <span>Henüz test çözülmedi</span>
                      </div>
                    );
                  }

                  const total = stat.dogru + stat.yanlis;
                  const accuracy = total > 0 ? Math.round((stat.dogru / total) * 100) : 0;
                  const avgSpeed =
                    stat.cozumSayisi > 0 && total > 0 ? Math.round(stat.sureMs / 1000 / total) : 0;

                  return (
                    <div
                      key={k.slug}
                      className="bg-white dark:bg-ink-800 border border-ink-150 dark:border-ink-750 p-4 rounded-2xl hover:border-focus-300 dark:hover:border-focus-700 transition-all shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{k.icon}</span>
                          <span className="font-bold text-sm text-ink-900 dark:text-white">
                            {k.baslik}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 bg-focus-500/10 text-focus-600 dark:text-focus-400 rounded-full text-xs font-black">
                          %{accuracy} Doğruluk
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-ink-500 dark:text-ink-400">
                        <div className="bg-emerald-500/5 dark:bg-emerald-950/20 py-2 rounded-xl">
                          <div className="font-black text-emerald-600 dark:text-emerald-400">
                            {stat.dogru}
                          </div>
                          <div className="text-[10px]">Doğru</div>
                        </div>
                        <div className="bg-red-500/5 dark:bg-red-950/20 py-2 rounded-xl">
                          <div className="font-black text-red-600 dark:text-red-400">
                            {stat.yanlis}
                          </div>
                          <div className="text-[10px]">Yanlış</div>
                        </div>
                        <div className="bg-indigo-500/5 dark:bg-indigo-950/20 py-2 rounded-xl">
                          <div className="font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-0.5">
                            <Clock size={10} /> {avgSpeed}s
                          </div>
                          <div className="text-[10px]">Soru Hızı</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Alt Butonlar */}
              <div className="mt-8 pt-4 border-t border-ink-150 dark:border-ink-800 flex gap-3">
                <button
                  onClick={() => setActiveModal("ranks")}
                  className="flex-1 py-3 border border-focus-200 dark:border-focus-800 hover:bg-focus-50 dark:hover:bg-focus-950/30 text-focus-700 dark:text-focus-400 text-sm font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <HelpCircle size={16} /> Rütbe Sistemi Nasıl Çalışır?
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-3 bg-ink-900 dark:bg-ink-800 hover:bg-ink-800 text-white text-sm font-bold rounded-2xl active:scale-95 transition-all"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. MODAL: RÜTBE SİSTEMİ AÇIKLAMA SAYFASI ==================== */}
        {activeModal === "ranks" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-left">
            <div className="relative w-full max-w-2xl bg-white dark:bg-ink-900 rounded-[32px] border border-focus-100 dark:border-focus-900/50 shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-scale-up">
              {/* Close Button */}
              <button
                onClick={() => setActiveModal("stats")}
                className="absolute top-6 right-6 p-2 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 transition-all cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Award className="text-amber-500 w-8 h-8" />
                <h3 className="text-2xl font-black text-ink-900 dark:text-white tracking-tight">
                  Coğrafya Rütbe Sistemi 🏔️
                </h3>
              </div>

              {/* Rütbe Görseli - Premium Chalkboard */}
              <div className="relative mb-4 rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-700 bg-ink-950 shadow-lg group flex justify-center items-center h-[340px] md:h-[400px]">
                <img
                  src="/images/rank_system_showcase.png"
                  alt="Coğrafya Rütbeleri"
                  className="max-w-full max-h-full object-contain scale-100 hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="mb-6 p-3 bg-focus-50/50 dark:bg-focus-950/20 border border-focus-100 dark:border-focus-900/30 rounded-xl">
                <p className="text-xs text-focus-700 dark:text-focus-300 font-semibold flex items-center gap-1.5 justify-center text-center">
                  ✨ Her doğru yanıt ve quizi tamamlama seviyeni artırarak seni zirvedeki Evliya
                  Çelebi rütbesine taşıyacak!
                </p>
              </div>

              {/* Rütbeler Listesi */}
              <h4 className="text-base font-extrabold text-ink-900 dark:text-white mb-3 uppercase tracking-wider">
                Rütbe Kademeleri & Gereken XP
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {RANKS.map((r) => {
                  const isCurrent =
                    stats &&
                    stats.totalXP >= r.xp &&
                    (RANKS[RANKS.indexOf(r) + 1]
                      ? stats.totalXP < RANKS[RANKS.indexOf(r) + 1].xp
                      : true);
                  return (
                    <div
                      key={r.name}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? "bg-gradient-to-r from-focus-500/10 to-indigo-500/10 border-focus-400 dark:border-focus-600 shadow-md scale-[1.01]"
                          : "bg-white dark:bg-ink-800 border-ink-150 dark:border-ink-750"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl shrink-0">{r.icon}</span>
                        <div>
                          <h5 className="font-bold text-sm text-ink-900 dark:text-white">
                            {r.name}
                          </h5>
                          <span className="text-[10px] text-ink-400 font-semibold uppercase">
                            Gereken: {r.xp} XP
                          </span>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-focus-500/20 text-focus-700 dark:text-focus-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                          Şu Anki
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Puanlama Kuralları */}
              <h4 className="text-base font-extrabold text-ink-900 dark:text-white mb-3 uppercase tracking-wider">
                XP Nasıl Kazanılır?
              </h4>

              <div className="bg-ink-50 dark:bg-ink-800/40 border border-ink-150 dark:border-ink-800 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✔️</span>
                  <div>
                    <div className="font-bold text-ink-800 dark:text-ink-200">Her Doğru Soru</div>
                    <p className="text-ink-400 mt-0.5">+10 XP</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <div>
                    <div className="font-bold text-ink-800 dark:text-ink-200">Her Yanlış Soru</div>
                    <p className="text-ink-400 mt-0.5">-2 XP (Min: 0)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">🏆</span>
                  <div>
                    <div className="font-bold text-ink-800 dark:text-ink-200">
                      Quiz Tamamlama Bonusu
                    </div>
                    <p className="text-ink-400 mt-0.5">+50 XP</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">📅</span>
                  <div>
                    <div className="font-bold text-ink-800 dark:text-ink-200">
                      Günlük Düzenli Giriş
                    </div>
                    <p className="text-ink-400 mt-0.5">+500 XP Ödülü</p>
                  </div>
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="mt-8 pt-4 border-t border-ink-150 dark:border-ink-800 flex justify-end">
                <button
                  onClick={() => setActiveModal("stats")}
                  className="px-6 py-3 bg-focus-600 hover:bg-focus-700 text-white text-sm font-bold rounded-2xl active:scale-95 transition-all"
                >
                  Geri Dön
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. MODAL: GLOBAL LİDERLİK TABLOSU ==================== */}
        {activeModal === "leaderboard" && stats && rank && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-left">
            <div className="relative w-full max-w-md bg-white dark:bg-ink-900 rounded-[32px] border border-focus-100 dark:border-focus-900/50 shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-scale-up">
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <Trophy className="text-amber-500 w-8 h-8 animate-bounce" />
                <h3 className="text-2xl font-black text-ink-900 dark:text-white tracking-tight">
                  Global Sıralama 🏆
                </h3>
              </div>

              <p className="text-xs text-ink-400 mb-4 font-semibold">
                Türkiye genelinde KPSS Coğrafya&apos;ya hazırlanan en iyi adaylar. Sıranı yükseltmek
                için konu pekiştirme quizlerini çöz!
              </p>

              {/* Liderlik Listesi */}
              <div className="space-y-2 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {leaderboardList.map((user, idx) => {
                  const place = idx + 1;
                  return (
                    <div
                      key={user.name + idx}
                      className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                        user.isCurrentUser
                          ? "bg-gradient-to-r from-focus-500/10 to-indigo-500/10 border-focus-500 ring-2 ring-focus-500/20 shadow-md font-bold scale-[1.01]"
                          : "bg-ink-50 dark:bg-ink-800/40 border-ink-150 dark:border-ink-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Sıra Numarası Badge */}
                        <div
                          className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                            place === 1
                              ? "bg-amber-400 text-ink-950"
                              : place === 2
                                ? "bg-slate-350 dark:bg-slate-500 text-ink-950 dark:text-white"
                                : place === 3
                                  ? "bg-amber-700 text-white"
                                  : "bg-ink-200 dark:bg-ink-800 text-ink-600 dark:text-ink-400"
                          }`}
                        >
                          {place}
                        </div>

                        <span className="text-2xl shrink-0">{user.rankIcon}</span>

                        <div className="min-w-0">
                          <div
                            className={`text-sm truncate ${
                              user.isCurrentUser
                                ? "text-focus-700 dark:text-focus-400 font-extrabold"
                                : "text-ink-800 dark:text-ink-250 font-bold"
                            }`}
                          >
                            {user.name}
                          </div>
                          <div className="text-[10px] text-ink-400 font-semibold uppercase leading-none mt-0.5">
                            {user.rankName}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-focus-600 dark:text-focus-400">
                          {user.xp} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Competitive Motivation Prompt */}
              {(() => {
                const userIdx = leaderboardList.findIndex((u) => u.isCurrentUser);
                if (userIdx > 0) {
                  const aheadUser = leaderboardList[userIdx - 1];
                  const xpDiff = aheadUser.xp - stats.totalXP;
                  return (
                    <div className="bg-focus-50 dark:bg-focus-950/20 border border-focus-100 dark:border-focus-900/50 rounded-2xl p-4 text-xs font-semibold text-focus-800 dark:text-focus-400 text-center leading-relaxed">
                      🔥 Önündeki <span className="underline">{aheadUser.name}</span> adayını
                      geçmene sadece{" "}
                      <span className="font-extrabold text-amber-500">{xpDiff} XP</span> kaldı!
                      Hemen quize başla ve sıranı kap!
                    </div>
                  );
                } else if (userIdx === 0) {
                  return (
                    <div className="bg-amber-400/10 border border-amber-450 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-bold text-amber-600 dark:text-amber-400 text-center leading-relaxed">
                      👑 Muhteşemsin! KPSS Coğrafya sıralamasının zirvesindesin! Liderliği korumak
                      için yeni quizi tamamla!
                    </div>
                  );
                }
                return null;
              })()}

              {/* Alt Butonlar */}
              <div className="mt-6 pt-3 border-t border-ink-150 dark:border-ink-800 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3 bg-ink-900 dark:bg-ink-800 hover:bg-ink-800 text-white text-sm font-bold rounded-2xl active:scale-95 transition-all text-center"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (mode === "deneme") {
    return (
      <div className="max-w-5xl mx-auto px-4 animate-fade-in text-left">
        {/* Header */}
        <div className="mb-6 flex items-center gap-5">
          <button
            onClick={() => setMode("initial")}
            className="p-3.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl hover:bg-ink-50 dark:hover:bg-ink-700 text-ink-600 dark:text-ink-400 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-2 tracking-tight">
              Genel Deneme Sınavı 📝
            </h1>
            <p className="text-ink-500 text-base max-w-xl leading-relaxed">
              ÖSYM standartlarında hazırlanmış, tüm konuları içeren 20 soruluk sınav.
            </p>
          </div>
        </div>

        <QuizModu konuSlug="deneme" konuMeta={denemeMeta as any} sorular={denemeSorulari} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-10 flex items-center gap-5">
        <button
          onClick={() => setMode("initial")}
          className="p-3.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl hover:bg-ink-50 dark:hover:bg-ink-700 text-ink-600 dark:text-ink-400 transition-colors shadow-sm animate-pulse-subtle"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white mb-2 tracking-tight">
            Konu Pekiştirme
          </h1>
          <p className="text-ink-500 text-base max-w-xl leading-relaxed">
            2000+ özgün soru. Üzerine çalışmak istediğin konuyu seç, testini çöz.
          </p>
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {konular.map((k) => (
          <div
            key={k.slug}
            className="group bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 p-5 hover:border-focus-200 dark:hover:border-focus-700 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-focus-50 dark:bg-focus-900/50 border border-focus-100/50 dark:border-focus-800/50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                {k.icon}
              </div>
              <div>
                <h3 className="font-bold text-ink-900 dark:text-white text-sm group-hover:text-focus-700 dark:group-hover:text-focus-400 transition-colors">
                  {k.baslik}
                </h3>
                <p className="text-xs text-ink-400">~{k.kpss_soru_sayisi_ort} soru/yıl</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/quiz/${k.slug}`}
                className="flex-1 text-center py-3 rounded-xl bg-focus-600 text-white text-sm font-bold hover:bg-focus-700 transition-colors shadow-sm"
              >
                Tam Quiz
              </Link>
              <Link
                href={`/quiz/${k.slug}?mode=quick`}
                className="flex-1 text-center py-3 rounded-xl bg-glow-50 dark:bg-glow-900/20 text-glow-700 dark:text-glow-400 text-sm font-bold border border-glow-200 dark:border-glow-800 hover:bg-glow-100 dark:hover:bg-glow-900/40 transition-colors"
              >
                Hızlı (10)
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
