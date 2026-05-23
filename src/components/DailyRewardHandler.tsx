"use client";

import { useEffect, useState } from "react";
import { checkDailyLogin } from "@/lib/gamification";

export default function DailyRewardHandler() {
  const [awardInfo, setAwardInfo] = useState<{
    show: boolean;
    streak: number;
    xpGained: number;
    newTotalXp: number;
  }>({
    show: false,
    streak: 0,
    xpGained: 0,
    newTotalXp: 0,
  });

  useEffect(() => {
    // Small delay to let the app load smoothly
    const timer = setTimeout(() => {
      const result = checkDailyLogin();
      if (result.isAwarded) {
        setAwardInfo({
          show: true,
          streak: result.streak,
          xpGained: result.xpGained,
          newTotalXp: result.newTotalXp,
        });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!awardInfo.show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-ink-900 rounded-[32px] border border-focus-100 dark:border-focus-900/50 shadow-2xl p-8 text-center overflow-hidden animate-scale-up">
        {/* Glow effect in background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-focus-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-glow-500/20 rounded-full blur-3xl" />

        {/* Icon container */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-3xl shadow-lg shadow-amber-500/30 animate-bounce">
            <span className="text-5xl">🔥</span>
            {/* Sparkles badge */}
            <span className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</span>
          </div>
        </div>

        <h3 className="text-3xl font-extrabold text-ink-900 dark:text-white mb-2 tracking-tight">
          Günlük Giriş Ödülü!
        </h3>
        <p className="text-focus-600 dark:text-focus-400 font-bold text-sm tracking-widest uppercase mb-4">
          {awardInfo.streak}. Gün Serisi!
        </p>

        <div className="bg-focus-50 dark:bg-focus-950/40 border border-focus-100 dark:border-focus-900/50 rounded-2xl p-5 mb-6">
          <div className="text-4xl font-black text-amber-500 dark:text-amber-400 mb-1 animate-pulse">
            +{awardInfo.xpGained} XP
          </div>
          <p className="text-xs text-ink-500 font-semibold uppercase tracking-wider">
            Hesabına Eklendi
          </p>
        </div>

        <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-6">
          KPSS Coğrafya hazırlığında gösterdiğin bu istikrar seni başarıya ulaştıracak! Her gün
          giriş yap, rütbeni yükselt ve zirveye tırman. 🏔️
        </p>

        <button
          onClick={() => setAwardInfo((prev) => ({ ...prev, show: false }))}
          className="w-full py-4 bg-gradient-to-r from-focus-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all text-base tracking-wide"
        >
          Harika! Devam Et 🚀
        </button>
      </div>
    </div>
  );
}
