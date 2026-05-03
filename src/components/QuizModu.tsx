'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizSoru, QuizSonuc } from '@/types/quiz';
import { Konu } from '@/types';
import clsx from 'clsx';

const STORAGE_KEY = 'kpss_quiz_sonuclar';
const TOP_SCORE_KEY = 'kpss_quiz_top';

// ─── LocalStorage Helpers ────────────────────────────────────────────────────
function sonuclariOku(): QuizSonuc[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function sonucuKaydet(yeniSonuc: QuizSonuc) {
  const mevcutlar = sonuclariOku();
  const guncellenmis = [yeniSonuc, ...mevcutlar].slice(0, 20); // son 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guncellenmis));

  // Konu bazlı en yüksek skor
  const topMap: Record<string, number> = JSON.parse(
    localStorage.getItem(TOP_SCORE_KEY) ?? '{}'
  );
  if (!topMap[yeniSonuc.konuSlug] || yeniSonuc.skor > topMap[yeniSonuc.konuSlug]) {
    topMap[yeniSonuc.konuSlug] = yeniSonuc.skor;
    localStorage.setItem(TOP_SCORE_KEY, JSON.stringify(topMap));
  }
}

// ─── Zorluk Renkleri ─────────────────────────────────────────────────────────
const zorluKRenk: Record<string, string> = {
  kolay: 'bg-green-100 text-green-700 border-green-300',
  orta:  'bg-yellow-100 text-yellow-700 border-yellow-300',
  zor:   'bg-red-100 text-red-700 border-red-300',
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface QuizModuProps {
  konuSlug: string;
  konuMeta: Konu;
  sorular: QuizSoru[];
}

type FazTip = 'hazir' | 'quiz' | 'sonuc';
type CevapDurumu = 'bekleniyor' | 'dogru' | 'yanlis';

// ─── Bileşen ─────────────────────────────────────────────────────────────────
export default function QuizModu({ konuSlug, konuMeta, sorular }: QuizModuProps) {
  const [faz, setFaz] = useState<FazTip>('hazir');
  const [aktifSorular, setAktifSorular] = useState<QuizSoru[]>([]);
  const [soruIndex, setSoruIndex] = useState(0);
  const [secilenSik, setSecilenSik] = useState<string | null>(null);
  const [cevapDurumu, setCevapDurumu] = useState<CevapDurumu>('bekleniyor');
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [baslangicZamani, setBaslangicZamani] = useState<number>(0);
  const [gecenSure, setGecenSure] = useState(0);
  const [sonSonuclar, setSonSonuclar] = useState<QuizSonuc[]>([]);
  const [enYuksekSkor, setEnYuksekSkor] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoStarted = useRef(false);

  const mevcutSoru = aktifSorular[soruIndex];
  const toplamSoru = aktifSorular.length;

  const quizBaslat = useCallback((hizli = false) => {
    let secilecekSorular = [...sorular];
    if (hizli) {
      secilecekSorular = secilecekSorular
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    }
    setAktifSorular(secilecekSorular);
    setSoruIndex(0);
    setSecilenSik(null);
    setCevapDurumu('bekleniyor');
    setDogruSayisi(0);
    setBaslangicZamani(Date.now());
    setGecenSure(0);
    setFaz('quiz');
  }, [sorular]);

  // Auto-start for quick mode if URL param exists
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasAutoStarted.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'quick' && sorular.length > 0) {
        hasAutoStarted.current = true;
        quizBaslat(true);
      }
    }
  }, [sorular, quizBaslat]);

  // Timer
  useEffect(() => {
    if (faz === 'quiz') {
      timerRef.current = setInterval(() => {
        setGecenSure(Math.floor((Date.now() - baslangicZamani) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [faz, baslangicZamani]);

  const sureFmt = (sn: number) => {
    const dk = Math.floor(sn / 60);
    const s = sn % 60;
    return `${dk}:${String(s).padStart(2, '0')}`;
  };

  const sikasTikla = (sik: string) => {
    if (cevapDurumu !== 'bekleniyor') return;
    setSecilenSik(sik);
    const dogru = sik === mevcutSoru.dogru;
    setCevapDurumu(dogru ? 'dogru' : 'yanlis');
    if (dogru) setDogruSayisi((p) => p + 1);
  };

  const sonrakiSoru = () => {
    if (soruIndex + 1 >= toplamSoru) {
      // Quiz bitti
      if (timerRef.current) clearInterval(timerRef.current);
      const sureMs = Date.now() - baslangicZamani;
      const skor = Math.round(((dogruSayisi + (cevapDurumu === 'dogru' ? 1 : 0)) / toplamSoru) * 100);
      const yeniSonuc: QuizSonuc = {
        konuSlug,
        tarih: new Date().toISOString(),
        toplamSoru,
        dogruSayisi: dogruSayisi + (cevapDurumu === 'dogru' ? 1 : 0),
        sureMs,
        skor,
      };
      sonucuKaydet(yeniSonuc);
      setSonSonuclar(sonuclariOku());

      // En yüksek skor güncelle
      const topMap: Record<string, number> = JSON.parse(
        localStorage.getItem(TOP_SCORE_KEY) ?? '{}'
      );
      setEnYuksekSkor(topMap[konuSlug] ?? skor);
      setFaz('sonuc');
    } else {
      setSoruIndex((p) => p + 1);
      setSecilenSik(null);
      setCevapDurumu('bekleniyor');
    }
  };

  // ─── FAZ: HAZIR ─────────────────────────────────────────────────────────────
  if (faz === 'hazir') {
    const gecmisler = sonuclariOku().filter((s) => s.konuSlug === konuSlug).slice(0, 3);
    const topMap: Record<string, number> = JSON.parse(
      typeof window !== 'undefined' ? (localStorage.getItem(TOP_SCORE_KEY) ?? '{}') : '{}'
    );
    const topSkor = topMap[konuSlug] ?? null;

    return (
      <div className="max-w-xl mx-auto text-center py-10 px-4">
        <div className="text-6xl mb-4">{konuMeta.icon}</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{konuMeta.baslik}</h2>
        <p className="text-gray-500 mb-2">Quiz Modu — Sınava Hazırlık</p>

        {topSkor !== null && (
          <div className="inline-block bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-2 mb-4 text-yellow-800 text-sm font-semibold">
            🏆 En yüksek skorum: {topSkor}/100
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => quizBaslat(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-colors shadow-lg"
          >
            Tam Quiz&apos;i Başlat ({sorular.length} Soru) 🚀
          </button>
          
          <button
            onClick={() => quizBaslat(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-colors shadow-lg"
          >
            Hızlı Test (10 Karışık Soru) ⏱️
          </button>
        </div>

        {gecmisler.length > 0 && (
          <div className="text-left bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-bold uppercase text-gray-400 mb-3">Son Denemelerim</p>
            {gecmisler.map((s, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-sm">
                <span className="text-gray-500">{new Date(s.tarih).toLocaleDateString('tr-TR')}</span>
                <span className="font-semibold text-gray-700">{s.dogruSayisi}/{s.toplamSoru}</span>
                <span className={clsx('font-bold', s.skor >= 70 ? 'text-green-600' : s.skor >= 40 ? 'text-yellow-600' : 'text-red-600')}>
                  {s.skor}/100
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── FAZ: QUIZ ──────────────────────────────────────────────────────────────
  if (faz === 'quiz') {
    const ilerleme = ((soruIndex) / toplamSoru) * 100;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Üst Bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500">
            Soru <span className="text-gray-900">{soruIndex + 1}</span> / {toplamSoru}
          </span>
          <span className="text-sm font-mono font-semibold text-gray-600">⏱ {sureFmt(gecenSure)}</span>
          <span className={clsx('text-xs font-bold px-2 py-1 rounded-full border', zorluKRenk[mevcutSoru.zorluk])}>
            {mevcutSoru.zorluk}
          </span>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${ilerleme}%` }}
          />
        </div>

        {/* Soru */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <p className="text-lg font-semibold text-gray-900 leading-relaxed">{mevcutSoru.soru}</p>
        </div>

        {/* Şıklar */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {mevcutSoru.siklar.map((sik) => {
            const isDogru = sik === mevcutSoru.dogru;
            const isSecilen = sik === secilenSik;
            let renk = 'bg-white border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50';

            if (cevapDurumu !== 'bekleniyor') {
              if (isDogru) renk = 'bg-green-50 border-green-500 text-green-800';
              else if (isSecilen && !isDogru) renk = 'bg-red-50 border-red-500 text-red-800';
              else renk = 'bg-white border-gray-200 text-gray-400';
            }

            return (
              <button
                key={sik}
                onClick={() => sikasTikla(sik)}
                disabled={cevapDurumu !== 'bekleniyor'}
                className={clsx(
                  'w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-200',
                  renk,
                  cevapDurumu === 'bekleniyor' && 'cursor-pointer active:scale-[0.98]',
                  cevapDurumu !== 'bekleniyor' && 'cursor-default'
                )}
              >
                <span className="flex items-center gap-3">
                  {cevapDurumu !== 'bekleniyor' && isDogru && <span>✅</span>}
                  {cevapDurumu !== 'bekleniyor' && isSecilen && !isDogru && <span>❌</span>}
                  {sik}
                </span>
              </button>
            );
          })}
        </div>

        {/* Açıklama */}
        {cevapDurumu !== 'bekleniyor' && (
          <div className={clsx(
            'rounded-xl p-4 border-l-4 mb-6 animate-fade-in',
            cevapDurumu === 'dogru'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          )}>
            <p className="font-bold text-sm mb-1">
              {cevapDurumu === 'dogru' ? '✅ Doğru!' : `❌ Yanlış! Doğru cevap: ${mevcutSoru.dogru}`}
            </p>
            <p className="text-sm leading-relaxed">{mevcutSoru.aciklama}</p>
          </div>
        )}

        {/* Sonraki Buton */}
        {cevapDurumu !== 'bekleniyor' && (
          <button
            onClick={sonrakiSoru}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            {soruIndex + 1 >= toplamSoru ? 'Sonuçları Gör →' : 'Sonraki Soru →'}
          </button>
        )}
      </div>
    );
  }

  // ─── FAZ: SONUÇ ─────────────────────────────────────────────────────────────
  const sonFinalDogru = dogruSayisi;
  const finalSkor = Math.round((sonFinalDogru / toplamSoru) * 100);
  const sonSureSn = Math.floor(gecenSure);

  const skorRenk =
    finalSkor >= 80 ? 'text-green-600' :
    finalSkor >= 50 ? 'text-yellow-600' :
    'text-red-600';

  const sonucMesaj =
    finalSkor >= 80 ? '🎉 Mükemmel! KPSS&apos;ye hazırsın.' :
    finalSkor >= 60 ? '👍 İyi! Biraz daha tekrar yap.' :
    finalSkor >= 40 ? '📚 Konu anlatımını tekrar oku.' :
    '💪 Hayal kırıklığına uğrama, tekrar dene!';

  return (
    <div className="max-w-xl mx-auto text-center py-10 px-4">
      <div className="text-6xl mb-4">{finalSkor >= 70 ? '🏆' : '📊'}</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Quiz Bitti!</h2>
      <p className="text-gray-500 mb-6">{konuMeta.baslik}</p>

      {/* Büyük Skor */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 mb-6">
        <p className={clsx('text-7xl font-black mb-2', skorRenk)}>{finalSkor}</p>
        <p className="text-gray-400 text-sm mb-4">/ 100 puan</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-green-600">{sonFinalDogru}</p>
            <p className="text-green-700 text-xs">Doğru</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-red-600">{toplamSoru - sonFinalDogru}</p>
            <p className="text-red-700 text-xs">Yanlış</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-blue-600">{sureFmt(sonSureSn)}</p>
            <p className="text-blue-700 text-xs">Süre</p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6 text-lg" dangerouslySetInnerHTML={{ __html: sonucMesaj }} />

      {enYuksekSkor !== null && (
        <p className="text-sm text-yellow-700 font-semibold mb-4">
          🏅 En yüksek skorum: {enYuksekSkor}/100
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => quizBaslat()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          🔄 Tekrar Dene
        </button>
        <a
          href={`/konu/${konuSlug}`}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors"
        >
          📖 Konuya Git
        </a>
      </div>

      {/* Son Denemeler */}
      {sonSonuclar.filter((s) => s.konuSlug === konuSlug).length > 1 && (
        <div className="mt-8 text-left bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs font-bold uppercase text-gray-400 mb-3">Geçmiş Denemelerim</p>
          {sonSonuclar
            .filter((s) => s.konuSlug === konuSlug)
            .slice(0, 5)
            .map((s, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-sm">
                <span className="text-gray-500">{new Date(s.tarih).toLocaleDateString('tr-TR')}</span>
                <span className="text-gray-600">{s.dogruSayisi}/{s.toplamSoru}</span>
                <span className={clsx('font-bold', s.skor >= 70 ? 'text-green-600' : s.skor >= 40 ? 'text-yellow-600' : 'text-red-600')}>
                  {s.skor}/100
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
