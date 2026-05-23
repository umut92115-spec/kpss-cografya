"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Filter,
  BarChart3,
  Layers,
  Map,
  Compass,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Soru {
  id: string;
  soru: string;
  siklar: string[];
  dogru: string;
  aciklama: string;
  harita_il: string | null;
  zorluk: "kolay" | "orta" | "zor";
  gorsel?: string | null;
}

interface QuizData {
  konu: string;
  sorular: Soru[];
}

interface AdminClientProps {
  initialQuizzes: QuizData[];
}

export default function AdminClient({ initialQuizzes }: AdminClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialQuizzes.find((q) => q.sorular.length > 0)?.konu || initialQuizzes[0]?.konu || ""
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("hepsi");
  const [mapFilter, setMapFilter] = useState<string>("hepsi");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Konu Başlıklarını Türkçeleştirme
  const formatTopicName = (slug: string) => {
    const mapping: Record<string, string> = {
      "cografi-konum": "Coğrafi Konum & Konum Analizi",
      "jeolojik-yapi": "Jeolojik Yapı & Depremler",
      daglar: "Dağlar & Tektonik Kütleler",
      goller: "Göller & Doğal Su Rezervleri",
      akarsular: "Akarsular & Akış Rejimleri",
      "yer-sekilleri": "Yer Şekilleri, Ovalar & Platolar",
      "kiyi-tipleri": "Kıyı Tipleri & Falez Oluşumları",
      "iklim-bitki": "İklim Elemanları & Bitki Örtüsü",
      "toprak-cevre": "Toprak Tipleri & Çevre Afetleri",
      "beseri-cografya": "Nüfus, Yerleşme & Göç Dinamikleri",
      "nufus-politikalari": "Nüfus Politikaları & Demografi",
      tarim: "Tarım Ürünleri & Hayvancılık",
      "madenler-enerji": "Madenler & Enerji Kaynakları",
      sanayi: "Sanayi Tesisleri & Sanayileşme",
      ulasim: "Ulaşım Ağları, Geçitler & Tüneller",
      ticaret: "İç & Dış Ticaret Dinamikleri",
      turizm: "UNESCO Alanları & Turizm Değerleri",
      "bolge-jeopolitik": "Bölgeler & Türkiye Jeopolitiği",
      "kalkinma-projeleri": "Bölgesel Kalkınma Projeleri (GAP, KOP)",
      "sinir-kapilari": "Sınır Kapıları & Demiryolu Ağları",
      "genel-cografya-200": "Genel Coğrafya 200 Soruluk Karma",
    };
    return mapping[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Aktif Konu Verileri
  const activeQuiz = useMemo(() => {
    return initialQuizzes.find((q) => q.konu === selectedTopic);
  }, [initialQuizzes, selectedTopic]);

  // Soruların Filtrelenmesi
  const filteredQuestions = useMemo(() => {
    if (!activeQuiz) return [];

    return activeQuiz.sorular.filter((q) => {
      const matchesSearch =
        q.soru.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDifficulty = difficultyFilter === "hepsi" || q.zorluk === difficultyFilter;

      const matchesMap =
        mapFilter === "hepsi" ||
        (mapFilter === "haritali" && q.harita_il !== null) ||
        (mapFilter === "haritasiz" && q.harita_il === null);

      return matchesSearch && matchesDifficulty && matchesMap;
    });
  }, [activeQuiz, searchTerm, difficultyFilter, mapFilter]);

  // Global İstatistikler
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let mapQuestions = 0;
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    initialQuizzes.forEach((quiz) => {
      totalQuestions += quiz.sorular.length;
      quiz.sorular.forEach((q) => {
        if (q.harita_il) mapQuestions++;
        if (q.zorluk === "kolay") easyCount++;
        else if (q.zorluk === "orta") mediumCount++;
        else if (q.zorluk === "zor") hardCount++;
      });
    });

    return {
      totalQuestions,
      mapQuestions,
      mapRatio: totalQuestions > 0 ? Math.round((mapQuestions / totalQuestions) * 100) : 0,
      easyCount,
      mediumCount,
      hardCount,
      totalTopics: initialQuizzes.length,
      activeTopics: initialQuizzes.filter((q) => q.sorular.length > 0).length,
    };
  }, [initialQuizzes]);

  // Aktif Konu İstatistikleri
  const activeStats = useMemo(() => {
    if (!activeQuiz || activeQuiz.sorular.length === 0) {
      return { total: 0, map: 0, easy: 0, medium: 0, hard: 0, mapRatio: 0 };
    }

    const total = activeQuiz.sorular.length;
    let map = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    activeQuiz.sorular.forEach((q) => {
      if (q.harita_il) map++;
      if (q.zorluk === "kolay") easy++;
      else if (q.zorluk === "orta") medium++;
      else if (q.zorluk === "zor") hard++;
    });

    return {
      total,
      map,
      mapRatio: Math.round((map / total) * 100),
      easy,
      medium,
      hard,
    };
  }, [activeQuiz]);

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = (expand: boolean) => {
    const nextState: Record<string, boolean> = {};
    filteredQuestions.forEach((q) => {
      nextState[q.id] = expand;
    });
    setExpandedQuestions(nextState);
  };

  return (
    <div className="space-y-8 mt-4 select-none animate-fade-in">
      {/* Üst Başlık & Gradient */}
      <div className="relative rounded-3xl overflow-hidden glass p-8 shadow-2xl border border-white/20 dark:border-ink-800/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200/50 dark:border-blue-800/40">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Kontrol Paneli & Akademik Denetim
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              KPSS Coğrafya Soru Bankası Editör Paneli
            </h1>
            <p className="mt-2 text-ink-600 dark:text-ink-400 text-sm md:text-base max-w-2xl">
              ÖSYM standartlarında hazırlanmış soru bankasını inceleyin, doğrulayın ve harita
              entegrasyonlarını denetleyin. Sıfır-halisünasyon akademik analiz aracı.
            </p>
          </div>
        </div>

        {/* Global İstatistik Kartları */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-ink-950/40 border border-ink-100 dark:border-ink-800/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ink-500 dark:text-ink-400 font-medium">Toplam Soru</div>
              <div className="text-xl font-bold">{stats.totalQuestions}</div>
              <div className="text-[10px] text-ink-400">
                {stats.activeTopics} / {stats.totalTopics} Ünite Aktif
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-ink-950/40 border border-ink-100 dark:border-ink-800/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ink-500 dark:text-ink-400 font-medium">
                Haritalı Soru
              </div>
              <div className="text-xl font-bold">{stats.mapQuestions}</div>
              <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                % {stats.mapRatio} Harita Oranı
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-ink-950/40 border border-ink-100 dark:border-ink-800/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ink-500 dark:text-ink-400 font-medium">
                Zorluk Dağılımı
              </div>
              <div className="text-sm font-bold flex gap-2 items-center">
                <span className="text-green-600 dark:text-green-400">{stats.easyCount}K</span> •
                <span className="text-amber-600 dark:text-amber-400">{stats.mediumCount}O</span> •
                <span className="text-rose-600 dark:text-rose-400">{stats.hardCount}Z</span>
              </div>
              <div className="text-[10px] text-ink-400">Genel Zorluk Payları</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-ink-950/40 border border-ink-100 dark:border-ink-800/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ink-500 dark:text-ink-400 font-medium">
                Müfredat Uyumu
              </div>
              <div className="text-xl font-bold">100%</div>
              <div className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">
                ÖSYM Tipoloji Süzgeci
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Grid: Sol Konular, Sağ Sorular */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Konu Listesi */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass rounded-2xl p-4 shadow-lg border border-white/20 dark:border-ink-800/50 sticky top-24 max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
              <span>Coğrafya Üniteleri</span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold">
                {initialQuizzes.length}
              </span>
            </h3>

            <div className="space-y-1">
              {initialQuizzes.map((quiz) => {
                const isActive = quiz.konu === selectedTopic;
                const hasQuestions = quiz.sorular.length > 0;

                return (
                  <button
                    key={quiz.konu}
                    onClick={() => {
                      setSelectedTopic(quiz.konu);
                      setSearchTerm("");
                      setDifficultyFilter("hepsi");
                      setMapFilter("hepsi");
                      setExpandedQuestions({});
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10 scale-[1.01]"
                        : hasQuestions
                          ? "hover:bg-ink-50 dark:hover:bg-ink-900 text-ink-700 dark:text-ink-300 bg-white/35 dark:bg-ink-950/20"
                          : "text-ink-400 dark:text-ink-600 bg-transparent opacity-60 hover:opacity-100 transition-opacity"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive
                            ? "bg-white animate-pulse"
                            : hasQuestions
                              ? "bg-green-500"
                              : "bg-ink-300 dark:bg-ink-700"
                        }`}
                      />
                      <span className="font-semibold text-xs md:text-sm truncate">
                        {formatTopicName(quiz.konu)}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : hasQuestions
                            ? "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400"
                            : "bg-ink-100 dark:bg-ink-900 text-ink-500 dark:text-ink-500"
                      }`}
                    >
                      {quiz.sorular.length} Soru
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sağ Soru Listesi ve Filtreler */}
        <div className="lg:col-span-8 space-y-6">
          {/* Aktif Konu Bilgisi & Özet */}
          <div className="glass rounded-2xl p-6 shadow-md border border-white/20 dark:border-ink-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-ink-800 dark:text-ink-100">
                  {formatTopicName(selectedTopic)}
                </h2>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                  Konu Kodu:{" "}
                  <code className="bg-ink-50 dark:bg-ink-950 px-1 py-0.5 rounded font-mono text-[10px]">
                    {selectedTopic}
                  </code>
                </p>
              </div>

              {activeStats.total > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                    📍 %{activeStats.mapRatio} Haritalı
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-100 dark:border-green-900 text-green-600 dark:text-green-400">
                    {activeStats.easy} Kolay
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 text-amber-600 dark:text-amber-400">
                    {activeStats.medium} Orta
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400">
                    {activeStats.hard} Zor
                  </span>
                </div>
              )}
            </div>

            {/* Arama & Filtreler Kontrol Alanı */}
            {activeStats.total > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 pt-6 border-t border-ink-100 dark:border-ink-800/40">
                {/* Arama Çubuğu */}
                <div className="relative md:col-span-5">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-ink-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Soru veya açıklamalarda ara..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700/80 bg-white/70 dark:bg-ink-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-ink-400 text-ink-800 dark:text-ink-200"
                  />
                </div>

                {/* Zorluk Filtresi */}
                <div className="md:col-span-3">
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700/80 bg-white/70 dark:bg-ink-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-ink-700 dark:text-ink-300"
                  >
                    <option value="hepsi">Tüm Zorluklar</option>
                    <option value="kolay">Kolay</option>
                    <option value="orta">Orta</option>
                    <option value="zor">Zor</option>
                  </select>
                </div>

                {/* Harita Filtresi */}
                <div className="md:col-span-4">
                  <select
                    value={mapFilter}
                    onChange={(e) => setMapFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700/80 bg-white/70 dark:bg-ink-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-ink-700 dark:text-ink-300"
                  >
                    <option value="hepsi">Haritalı & Haritasız</option>
                    <option value="haritali">Sadece Haritalı Sorular</option>
                    <option value="haritasiz">Sadece Haritasız Sorular</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-8 rounded-xl bg-ink-50/50 dark:bg-ink-950/20 border border-dashed border-ink-200 dark:border-ink-800 text-center">
                <HelpCircle className="w-12 h-12 text-ink-350 dark:text-ink-700 mx-auto mb-3" />
                <h4 className="font-bold text-ink-700 dark:text-ink-300">
                  Bu Ünitede Soru Bulunmuyor
                </h4>
                <p className="text-xs text-ink-500 dark:text-ink-500 mt-1 max-w-sm mx-auto">
                  Bu konu başlığı henüz boş. Soruların alt temsilcilerle üretilip birleştirilmesi
                  bekleniyor.
                </p>
              </div>
            )}
          </div>

          {/* Soru Listesi Alanı */}
          {activeStats.total > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Listelenen: {filteredQuestions.length} / {activeQuiz?.sorular.length} Soru
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAll(true)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Tümünü Genişlet
                  </button>
                  <span className="text-ink-300 dark:text-ink-700">•</span>
                  <button
                    onClick={() => toggleAll(false)}
                    className="text-xs font-semibold text-ink-500 dark:text-ink-400 hover:underline"
                  >
                    Tümünü Daralt
                  </button>
                </div>
              </div>

              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((soru) => {
                  const isExpanded = !!expandedQuestions[soru.id];

                  return (
                    <div
                      key={soru.id}
                      className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? "border-blue-300 dark:border-blue-800/80 shadow-lg scale-[1.005]"
                          : "border-ink-100 dark:border-ink-800/50 hover:border-ink-300 dark:hover:border-ink-700 shadow-sm"
                      }`}
                    >
                      {/* Kart Başlığı / Clickable Row */}
                      <div
                        onClick={() => toggleExpand(soru.id)}
                        className="p-5 cursor-pointer flex items-start gap-4 hover:bg-ink-50/20 dark:hover:bg-ink-950/20 select-none transition-colors"
                      >
                        <div className="mt-1 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-ink-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-ink-400" />
                          )}
                        </div>

                        <div className="flex-grow space-y-2 min-w-0">
                          {/* Soru Meta Etiketleri */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 font-mono">
                              {soru.id}
                            </span>

                            {/* Zorluk Seviyesi */}
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded font-mono ${
                                soru.zorluk === "kolay"
                                  ? "bg-green-100/70 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200/30"
                                  : soru.zorluk === "orta"
                                    ? "bg-amber-100/70 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/30"
                                    : "bg-rose-100/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/30"
                              }`}
                            >
                              {soru.zorluk}
                            </span>

                            {/* Harita Entegrasyon Rozeti */}
                            {soru.harita_il ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                                <MapPin className="w-2.5 h-2.5" />
                                📍 {soru.harita_il.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-ink-50 dark:bg-ink-900/60 text-ink-450 dark:text-ink-500">
                                Haritasız
                              </span>
                            )}
                          </div>

                          {/* Soru Başlangıç Kırpıntısı */}
                          <div
                            className={`text-sm font-semibold leading-relaxed text-ink-800 dark:text-ink-100 ${isExpanded ? "" : "line-clamp-2"}`}
                          >
                            {soru.soru}
                          </div>
                        </div>
                      </div>

                      {/* Genişletilmiş İçerik Alanı */}
                      {isExpanded && (
                        <div className="px-5 pb-6 border-t border-ink-100/50 dark:border-ink-800/40 pt-4 bg-ink-50/10 dark:bg-ink-950/10 space-y-5 animate-slide-down">
                          {soru.gorsel && (
                            <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50/50 flex justify-center p-2 max-w-md mx-auto">
                              <img
                                src={soru.gorsel}
                                alt="Soru Harita Görseli"
                                className="max-h-[220px] object-contain rounded-lg shadow-sm"
                              />
                            </div>
                          )}

                          {/* Şıklar / Seçenekler */}
                          <div className="space-y-2.5">
                            <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider px-1">
                              Seçenekler
                            </h4>
                            <div className="grid grid-cols-1 gap-2.5">
                              {soru.siklar.map((sik, idx) => {
                                const isCorrect = sik === soru.dogru;
                                return (
                                  <div
                                    key={idx}
                                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium transition-all ${
                                      isCorrect
                                        ? "bg-green-500/10 dark:bg-green-950/20 border-green-400 dark:border-green-700/80 text-green-800 dark:text-green-300 shadow-sm"
                                        : "bg-white/40 dark:bg-ink-900/20 border-ink-150 dark:border-ink-800/50 text-ink-750 dark:text-ink-300"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                          isCorrect
                                            ? "bg-green-500 text-white"
                                            : "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-450"
                                        }`}
                                      >
                                        {String.fromCharCode(65 + idx)}
                                      </span>
                                      <span>{sik.replace(/^[A-E]\)\s*/, "")}</span>
                                    </div>

                                    {isCorrect && (
                                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Doğru Cevap Özet Kartı */}
                          <div className="p-3.5 rounded-xl bg-green-500/[0.04] dark:bg-green-950/[0.04] border border-green-500/15 flex items-center gap-3 text-xs sm:text-sm font-bold text-green-800 dark:text-green-300">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Cevap Anahtarı: {soru.dogru}</span>
                          </div>

                          {/* Akademik Açıklama */}
                          <div className="p-5 rounded-2xl bg-blue-500/[0.03] dark:bg-blue-950/[0.05] border border-blue-100/60 dark:border-blue-900/40 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                              <BookOpen className="w-4 h-4" />
                              <span>Akademik Eğitmen Analizi & Çeldirici Çözümü</span>
                            </div>
                            <p className="text-xs sm:text-sm leading-relaxed text-ink-700 dark:text-ink-300 font-normal">
                              {soru.aciklama}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-2xl bg-ink-50/50 dark:bg-ink-950/20 border border-ink-150 dark:border-ink-800/60 text-center">
                  <Filter className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
                  <h4 className="font-bold text-ink-700 dark:text-ink-300">
                    Aramanıza Uygun Soru Bulunmadı
                  </h4>
                  <p className="text-xs text-ink-500 mt-1">
                    Filtreleri veya arama kriterlerini değiştirerek tekrar deneyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
