const STATS_KEY = "kpss_cografya_stats";

export interface TopicStat {
  dogru: number;
  yanlis: number;
  sureMs: number;
  cozumSayisi: number;
}

export interface UserStats {
  totalXP: number;
  topicStats: Record<string, TopicStat>;
  totalTestsCompleted: number;
  lastLoginDate?: string;
  loginStreak?: number;
  username?: string;
  hasSeenRankOverview?: boolean;
}

export interface LeaderboardUser {
  name: string;
  xp: number;
  rankName: string;
  rankIcon: string;
  isCurrentUser?: boolean;
}

export const RANKS = [
  { xp: 0, name: "Amatör Kaşif", icon: "🌱" },
  { xp: 500, name: "Stajyer Coğrafyacı", icon: "🧭" },
  { xp: 1500, name: "Harita Kurdu", icon: "🗺️" },
  { xp: 3000, name: "İklim Uzmanı", icon: "🌤️" },
  { xp: 5000, name: "Uzman Coğrafyacı", icon: "🎓" },
  { xp: 10000, name: "Evliya Çelebi", icon: "🌍" },
];

export function generateRandomUsername(): string {
  const adjectives = [
    "Kutup",
    "Karstik",
    "Masif",
    "Delta",
    "Ria",
    "Dalmaçya",
    "Ekvator",
    "Bozkır",
    "Kanyon",
    "Fiyort",
    "Alüvyal",
    "Mevsimlik",
    "Topografik",
    "Litosfer",
    "Atmosfer",
    "Barometre",
    "İzoterm",
    "İzobar",
    "Meteorolojik",
    "Kartografik",
  ];
  const nouns = [
    "Kaşifi",
    "Kurdu",
    "Gezgini",
    "Uzmanı",
    "Yolcusu",
    "Maceracısı",
    "Severi",
    "Dostu",
    "Rüzgarı",
    "Haritacısı",
    "Pusulası",
    "Atlası",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(10 + Math.random() * 89);
  return `${adj}${noun}_${randomNum}`;
}

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { name: "AtlasGezgini_34", xp: 12450, rankName: "Evliya Çelebi", rankIcon: "🌍" },
  { name: "KutupGezgini_61", xp: 9550, rankName: "Uzman Coğrafyacı", rankIcon: "🎓" },
  { name: "KanyonSever_06", xp: 7400, rankName: "Uzman Coğrafyacı", rankIcon: "🎓" },
  { name: "DeltaUzmanı_35", xp: 5200, rankName: "Uzman Coğrafyacı", rankIcon: "🎓" },
  { name: "KarstikKaşif_99", xp: 4100, rankName: "İklim Uzmanı", rankIcon: "🌤️" },
  { name: "RiaRüzgarı_77", xp: 2850, rankName: "Harita Kurdu", rankIcon: "🗺️" },
  { name: "BozkırKaşifi_42", xp: 1800, rankName: "Harita Kurdu", rankIcon: "🗺️" },
  { name: "EkvatorYolcusu_10", xp: 950, rankName: "Stajyer Coğrafyacı", rankIcon: "🧭" },
  { name: "MasifDostu_88", xp: 400, rankName: "Amatör Kaşif", rankIcon: "🌱" },
];

export function getStats(): UserStats {
  if (typeof window === "undefined") {
    return {
      totalXP: 0,
      topicStats: {},
      totalTestsCompleted: 0,
      loginStreak: 0,
      username: "MisafirKaşif_00",
    };
  }

  try {
    const raw = localStorage.getItem(STATS_KEY);
    let stats: UserStats;
    if (raw) {
      stats = JSON.parse(raw);
    } else {
      stats = { totalXP: 0, topicStats: {}, totalTestsCompleted: 0, loginStreak: 0 };
    }

    // Ensure defaults are populated
    if (stats.loginStreak === undefined) stats.loginStreak = 0;

    // Automatically assign a cool geographic nickname if none exists
    if (!stats.username) {
      stats.username = generateRandomUsername();
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }

    return stats;
  } catch (e) {
    console.error("Failed to parse gamification stats", e);
  }

  return {
    totalXP: 0,
    topicStats: {},
    totalTestsCompleted: 0,
    loginStreak: 0,
    username: "MisafirKaşif_00",
  };
}

export function getCurrentRank(xp: number) {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xp) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
}

export function getNextRank(xp: number) {
  for (const rank of RANKS) {
    if (xp < rank.xp) return rank;
  }
  return null; // Max rank
}

export function saveQuizResult(konuSlug: string, dogru: number, yanlis: number, sureMs: number) {
  const stats = getStats();

  // Calculate XP (10 XP per correct answer, -2 XP per wrong answer)
  let xpGained = dogru * 10 - yanlis * 2;
  if (xpGained < 0) xpGained = 0;

  // Bonus for completing the quiz
  xpGained += 50;

  stats.totalXP += xpGained;
  stats.totalTestsCompleted += 1;

  if (!stats.topicStats[konuSlug]) {
    stats.topicStats[konuSlug] = { dogru: 0, yanlis: 0, sureMs: 0, cozumSayisi: 0 };
  }

  stats.topicStats[konuSlug].dogru += dogru;
  stats.topicStats[konuSlug].yanlis += yanlis;
  stats.topicStats[konuSlug].sureMs += sureMs;
  stats.topicStats[konuSlug].cozumSayisi += 1;

  if (typeof window !== "undefined") {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  return { xpGained, newTotalXp: stats.totalXP };
}

export function checkDailyLogin() {
  if (typeof window === "undefined") {
    return { isAwarded: false, xpGained: 0, newTotalXp: 0, streak: 0 };
  }

  const stats = getStats();
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local format
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");

  if (stats.lastLoginDate === today) {
    return {
      isAwarded: false,
      xpGained: 0,
      newTotalXp: stats.totalXP,
      streak: stats.loginStreak || 1,
    };
  }

  const xpGained = 500;
  let newStreak = 1;

  if (stats.lastLoginDate === yesterday) {
    newStreak = (stats.loginStreak || 0) + 1;
  } else {
    newStreak = 1;
  }

  stats.totalXP += xpGained;
  stats.loginStreak = newStreak;
  stats.lastLoginDate = today;

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));

  return {
    isAwarded: true,
    xpGained,
    newTotalXp: stats.totalXP,
    streak: newStreak,
  };
}

export function getLeaderboard(
  currentUserXp: number,
  currentRankName: string,
  currentRankIcon: string
): LeaderboardUser[] {
  // Deep clone mock leaderboard
  const list = JSON.parse(JSON.stringify(MOCK_LEADERBOARD)) as LeaderboardUser[];

  const stats = getStats();
  const userName = stats.username ? `${stats.username} (Sen)` : "Sen (Senin Profilin)";

  // Add current user
  list.push({
    name: userName,
    xp: currentUserXp,
    rankName: currentRankName,
    rankIcon: currentRankIcon,
    isCurrentUser: true,
  });

  // Sort by XP descending
  list.sort((a, b) => b.xp - a.xp);

  return list;
}
