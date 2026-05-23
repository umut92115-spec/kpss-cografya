const fs = require('fs');

let content = fs.readFileSync('src/components/QuizModu.tsx', 'utf8');

// 1. Update the hazir UI to include mode selection
content = content.replace(
  '<div className="flex flex-col gap-3 mb-6">',
  `
        <div className="bg-white p-4 rounded-xl border border-ink-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-left shadow-sm">
          <div>
            <h4 className="font-bold text-ink-900 text-sm">Cevap Gösterimi</h4>
            <p className="text-xs text-ink-500">Sınav modunda cevapları test sonunda görürsün.</p>
          </div>
          <div className="flex bg-ink-50 p-1 rounded-lg">
            <button
              onClick={() => setFeedbackMode("aninda")}
              className={"px-4 py-2 text-sm font-bold rounded-md transition-all " + (feedbackMode === "aninda" ? "bg-white text-focus-600 shadow-sm" : "text-ink-500 hover:text-ink-700")}
            >
              Anında
            </button>
            <button
              onClick={() => setFeedbackMode("sonunda")}
              className={"px-4 py-2 text-sm font-bold rounded-md transition-all " + (feedbackMode === "sonunda" ? "bg-white text-focus-600 shadow-sm" : "text-ink-500 hover:text-ink-700")}
            >
              Sınav Modu
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">`
);

// We need to pass feedbackMode to quizBaslat calls in hazir phase
content = content.replace(
  'onClick={() => quizBaslat(false)}',
  'onClick={() => quizBaslat(false, feedbackMode)}'
);
content = content.replace(
  'onClick={() => quizBaslat(true)}',
  'onClick={() => quizBaslat(true, feedbackMode)}'
);

// 2. Update Quiz Phase - Options styling for "sonunda"
content = content.replace(
  'if (cevapDurumu !== "bekleniyor") {',
  `if (cevapDurumu !== "bekleniyor") {`
);
// In "sonunda" mode, if selected, highlight it slightly, but not right/wrong
content = content.replace(
  'if (isDogru) renk = "bg-emerald-50 border-emerald-400 text-emerald-800";',
  `if (feedbackMode === "sonunda") {
                if (isSecilen) renk = "bg-focus-50 border-focus-400 text-focus-800";
                else renk = "bg-white border-ink-100 text-ink-400";
              } else {
                if (isDogru) renk = "bg-emerald-50 border-emerald-400 text-emerald-800";`
);
content = content.replace(
  'else renk = "bg-white border-ink-100 text-ink-400";\n            }',
  `else renk = "bg-white border-ink-100 text-ink-400";\n              }\n            }`
);

// Fix options button logic:
content = content.replace(
  'disabled={cevapDurumu !== "bekleniyor"}',
  'disabled={cevapDurumu !== "bekleniyor" && feedbackMode === "aninda"}'
);
content = content.replace(
  'cevapDurumu === "bekleniyor" && "cursor-pointer active:scale-[0.98]",',
  '(cevapDurumu === "bekleniyor" || feedbackMode === "sonunda") && "cursor-pointer active:scale-[0.98]",'
);
content = content.replace(
  'cevapDurumu !== "bekleniyor" && "cursor-default"',
  'cevapDurumu !== "bekleniyor" && feedbackMode === "aninda" && "cursor-default"'
);

// Icons inside options:
content = content.replace(
  '{cevapDurumu !== "bekleniyor" && isDogru && <span>✅</span>}',
  '{cevapDurumu !== "bekleniyor" && feedbackMode === "aninda" && isDogru && <span>✅</span>}'
);
content = content.replace(
  '{cevapDurumu !== "bekleniyor" && isSecilen && !isDogru && <span>❌</span>}',
  '{cevapDurumu !== "bekleniyor" && feedbackMode === "aninda" && isSecilen && !isDogru && <span>❌</span>}'
);

// 3. Update Next button visibility
content = content.replace(
  '{cevapDurumu !== "bekleniyor" && (',
  '{(cevapDurumu !== "bekleniyor" || (feedbackMode === "sonunda" && secilenSik)) && ('
);
// Also hide explanation in "sonunda" mode
content = content.replace(
  '{cevapDurumu !== "bekleniyor" && (',
  '{cevapDurumu !== "bekleniyor" && feedbackMode === "aninda" && ('
);


// 4. Update Result Phase to show Kazanilan XP and Table of answers if mode was "sonunda"
content = content.replace(
  '<p className="text-ink-600 mb-6 text-lg">{sonucMesaj}</p>',
  `<p className="text-ink-600 mb-6 text-lg">{sonucMesaj}</p>
      
      {kazanilanXp > 0 && (
        <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-xl py-3 px-6 mb-6 inline-flex items-center gap-2 font-bold shadow-sm">
          🌟 +{kazanilanXp} XP Kazandın!
        </div>
      )}

      {feedbackMode === "sonunda" && (
        <div className="text-left bg-white rounded-xl p-4 border border-ink-200 mb-6 max-h-96 overflow-y-auto shadow-inner">
          <h3 className="font-bold text-lg mb-4 text-ink-900 border-b pb-2">Cevap Anahtarı ve Açıklamalar</h3>
          <div className="flex flex-col gap-4">
            {aktifSorular.map((soru, idx) => {
              const uSec = tumCevaplar[idx];
              const dogruMu = uSec === soru.dogru;
              return (
                <div key={idx} className={"p-4 rounded-xl border-l-4 " + (dogruMu ? "bg-emerald-50 border-emerald-400" : "bg-rose-50 border-rose-400")}>
                  <p className="font-bold text-sm text-ink-800 mb-2">Soru {idx + 1}</p>
                  <p className="text-xs text-ink-600 mb-2 line-clamp-2">{soru.soru.replace(/\\n/g, ' ')}</p>
                  <div className="flex gap-4 text-xs font-semibold mb-2">
                    <span className={dogruMu ? "text-emerald-700" : "text-rose-700"}>Senin Cevabın: {uSec || "Boş"}</span>
                    {!dogruMu && <span className="text-emerald-700">Doğru Cevap: {soru.dogru}</span>}
                  </div>
                  <div className="text-xs text-ink-700 bg-white/50 p-2 rounded-lg mt-2 italic">
                    💡 {soru.aciklama}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
`
);

fs.writeFileSync('src/components/QuizModu.tsx', content);
console.log("Updated UI Logic.");
