const fs = require('fs');

let content = fs.readFileSync('src/components/QuizModu.tsx', 'utf8');

// 1. Add saveQuizResult import
content = content.replace(
  'import clsx from "clsx";',
  'import clsx from "clsx";\nimport { saveQuizResult } from "@/lib/gamification";'
);

// 2. Add feedback types
content = content.replace(
  'type FazTip = "hazir" | "quiz" | "sonuc";',
  'type FazTip = "hazir" | "quiz" | "sonuc";\ntype FeedbackMode = "aninda" | "sonunda";'
);

// 3. Add states
content = content.replace(
  'const [faz, setFaz] = useState<FazTip>("hazir");',
  `const [faz, setFaz] = useState<FazTip>("hazir");
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("aninda");
  const [tumCevaplar, setTumCevaplar] = useState<(string | null)[]>([]);
  const [kazanilanXp, setKazanilanXp] = useState<number>(0);`
);

// 4. Update quizBaslat
content = content.replace(
  'const quizBaslat = useCallback(',
  `const quizBaslat = useCallback(
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
  
  // original:`
);

// Now we need to carefully replace the old quizBaslat with the new one. Since we added "// original:", we can do regex.
content = content.replace(/\/\/ original:[\s\S]*?\[sorular\]\n  \);/, '');

// 5. Update sikasTikla
content = content.replace(
  'const sikasTikla = (sik: string) => {',
  `const sikasTikla = (sik: string) => {
    if (cevapDurumu !== "bekleniyor" && feedbackMode === "aninda") return;
    setSecilenSik(sik);
    
    const yeniCevaplar = [...tumCevaplar];
    yeniCevaplar[soruIndex] = sik;
    setTumCevaplar(yeniCevaplar);

    if (feedbackMode === "aninda") {
      const dogru = sik === mevcutSoru.dogru;
      setCevapDurumu(dogru ? "dogru" : "yanlis");
      if (dogru) setDogruSayisi((p) => p + 1);
    }
    // original_sikasTikla:`
);

content = content.replace(/\/\/ original_sikasTikla:[\s\S]*?};/, '};');

// 6. Update sonrakiSoru
content = content.replace(
  'const sonrakiSoru = () => {',
  `const sonrakiSoru = () => {
    if (soruIndex + 1 >= toplamSoru) {
      if (timerRef.current) clearInterval(timerRef.current);
      const sureMs = Date.now() - baslangicZamani;
      
      let finalDogru = 0;
      let finalYanlis = 0;
      if (feedbackMode === "aninda") {
        finalDogru = dogruSayisi + (cevapDurumu === "dogru" ? 1 : 0);
        finalYanlis = toplamSoru - finalDogru;
      } else {
        aktifSorular.forEach((soru, idx) => {
          if (tumCevaplar[idx] === soru.dogru) finalDogru++;
          else finalYanlis++;
        });
        setDogruSayisi(finalDogru);
      }

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
      setSoruIndex((p) => p + 1);
      if (feedbackMode === "aninda") {
        setSecilenSik(null);
        setCevapDurumu("bekleniyor");
      } else {
        setSecilenSik(tumCevaplar[soruIndex + 1] || null);
        setCevapDurumu("bekleniyor");
      }
    }
  };
  
  // original_sonrakiSoru:`
);

content = content.replace(/\/\/ original_sonrakiSoru:[\s\S]*?};/, '');


fs.writeFileSync('src/components/QuizModu.tsx', content);
console.log("Replaced Core Logic.");
