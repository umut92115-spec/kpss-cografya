import { Konu } from "@/types";

const TOPIC_ALIASES: Record<string, string[]> = {
  "cografi-konum": [
    "coğrafi konum[auıunin]?",
    "mutlak konum[auıunin]?",
    "matematik konum[auıunin]?",
    "göreceli konum[auıunin]?",
    "özel konum[auıunin]?",
  ],
  "yer-sekilleri": [
    "yer şekil(leri|lerinin|lerine|i|inin|ine|lerimize)?",
    "yerşekil(leri|lerinin|lerine|i|inin|ine|lerimize)?",
  ],
  daglar: ["dağ(lar|ları|ların|larında|larımıza|lık|cılık)?", "sıradağ(lar|ları|ların)?"],
  goller: [
    "göl(ler|leri|lerin|lerinde|lerimize|ü|ünün|üne)?",
    "baraj(lar|ı|ının|ına|ları|larında)?",
  ],
  "sinir-kapilari": [
    "sınır kapı(ları|larının|larına|mız|sı|sının|sına)?",
    "gümrük kapı(ları|larının|larına|mız|sı|sının|sına)?",
  ],
  "iklim-bitki": ["iklim(i|in|inin|ine|ler|leri|sel)?", "bitki örtüsü", "vejetasyon"],
  "toprak-cevre": ["toprak(lar|ı|ının|ına|larımız|ta)?", "erozyon[auıunin]?", "heyelan[adın]?"],
  "beseri-cografya": [
    "nüfus(u|un|unun|una|umuz|ta|lu|suz)?",
    "göç(ler|ü|ünün|üne|ten)?",
    "yerleşme(ler|si|sinin|sine)?",
  ],
  tarim: ["tarım(sal|ı|ının|a|ımız)?", "hayvancılık(ta|ın|ı|la)?"],
  "madenler-enerji": [
    "maden(ler|i|inin|ine|lerimiz|ocakları|cilik)?",
    "yeraltı kaynak(ları|larının)?",
    "enerji kaynak(ları|larının)?",
    "enerji santral(i|leri|lerinin)?",
  ],
  sanayi: ["sanayi(yi|nin|sine|miz|leşme)?", "endüstri(yel|nin|ye)?"],
  ulasim: [
    "ulaşım(ın|a|ımız|ı|la)?",
    "geçit(ler|i|inin|ine|lerden)?",
    "tünel(ler|i|inin|ine|lerden)?",
    "demiryolu(nu|nun|na|ları)?",
    "karayolu(nu|nun|na|ları)?",
  ],
  turizm: ["turizm(in|e|i|lerimiz)?", "turistik", "unesco"],
  ticaret: ["ticaret(in|e|imiz|i)?", "dış ticaret[in]?", "ihracat[ıa]?", "ithalat[ıa]?"],
  "jeolojik-yapi": [
    "jeolojik yapı(sı|sının|sına)?",
    "jeolojik zaman(lar|ı|ından)?",
    "iç kuvvet(ler|leri)?",
    "fay hat(tı|ları|larının)?",
  ],
  "bolge-jeopolitik": [
    "jeopolitik(i|in|ine|imiz)?",
    "bölge kavramı",
    "coğrafi bölge(ler|i|lerinin)?",
  ],
  "kalkinma-projeleri": [
    "kalkınma proje(leri|lerinin|lerine|si)?",
    "bölgesel kalkınma",
    "gap",
    "kop",
    "dap",
    "dokap",
    "zbk",
  ],
  akarsular: [
    "akarsu(lar|ları|ların|larında|yun|yuna)?",
    "nehir(ler|leri|lerin|lerinde|i|inin|ine)?",
  ],
  "kiyi-tipleri": [
    "kıyı tip(leri|lerinin|lerine|i|inin|ine)?",
    "körfez(ler|i|inin|ine)?",
    "boğaz(lar|ı|ının|ına)?",
  ],
  sozluk: ["sözlük", "coğrafya sözlüğü", "terimler sözlüğü"],
};

const GLOSSARY_TERMS = [
  { term: "Alüvyon", slug: "sozluk#alüvyon" },
  { term: "Bakı", slug: "sozluk#bakı" },
  { term: "Delta", slug: "sozluk#delta" },
  { term: "Falez", slug: "sozluk#falez" },
  { term: "Hinterland", slug: "sozluk#hinterland" },
  { term: "Mikroklima", slug: "sozluk#mikroklima" },
  { term: "Obruk", slug: "sozluk#obruk" },
  { term: "Terra Rossa", slug: "sozluk#terra-rossa" },
  { term: "Tektonik", slug: "sozluk#tektonik" },
  { term: "Masif", slug: "sozluk#masif" },
  { term: "Karstik", slug: "sozluk#karstik" },
  { term: "Epirojenez", slug: "sozluk#epirojenez" },
  { term: "Orojenez", slug: "sozluk#orojenez" },
  { term: "Graben", slug: "sozluk#graben" },
  { term: "Horst", slug: "sozluk#horst" },
  { term: "Linyit", slug: "sozluk#linyit" },
  { term: "Maki", slug: "sozluk#maki" },
  { term: "Step", slug: "sozluk#step" },
  { term: "Bozkır", slug: "sozluk#bozkır" },
  { term: "Plato", slug: "sozluk#plato" },
  { term: "Ria", slug: "sozluk#ria" },
  { term: "Dalmaçya", slug: "sozluk#dalmaçya" },
  { term: "Endemik", slug: "sozluk#endemik" },
  { term: "Relikt", slug: "sozluk#relikt" },
  { term: "Nadas", slug: "sozluk#nadas" },
  { term: "Sirk", slug: "sozluk#sirk" },
  { term: "Moren", slug: "sozluk#moren" },
  { term: "Tombolo", slug: "sozluk#tombolo" },
  { term: "Lagün", slug: "sozluk#lagün" },
  { term: "Regresyon", slug: "sozluk#regresyon" },
  { term: "Transgresyon", slug: "sozluk#transgresyon" },
  { term: "Volkanik set", slug: "sozluk#volkanik-set" },
  { term: "Heyelan set", slug: "sozluk#heyelan-set" },
  { term: "Alüvyal set", slug: "sozluk#alüvyal-set" },
  { term: "Kıyı set", slug: "sozluk#kıyı-set" },
  { term: "Kalker", slug: "sozluk#kalker" },
  { term: "Jips", slug: "sozluk#jips" },
  { term: "Kaya tuzu", slug: "sozluk#kaya-tuzu" },
];

export function linkKeywords(content: string, currentSlug: string, konular: Konu[]): string {
  if (!content) return "";

  const placeholders: string[] = [];

  // 1. Korumaya al: Fenced Code Blocks (``` ... ```)
  let protectedContent = content.replace(/```[\s\S]+?```/g, (match) => {
    placeholders.push(match);
    return `___CODE_${placeholders.length - 1}___`;
  });

  // 2. Korumaya al: Inline Code (`...`)
  protectedContent = protectedContent.replace(/`[\s\S]+?`/g, (match) => {
    placeholders.push(match);
    return `___INLINE_${placeholders.length - 1}___`;
  });

  // 3. Korumaya al: MDX/HTML Tag'leri (Çok satırlı destekli)
  protectedContent = protectedContent.replace(/<[a-zA-Z\/][\s\S]*?>/g, (match) => {
    placeholders.push(match);
    return `___TAG_${placeholders.length - 1}___`;
  });

  // 4. Korumaya al: Mevcut Markdown Linkleri [text](url)
  protectedContent = protectedContent.replace(/\[[\s\S]+?\]\([\s\S]+?\)/g, (match) => {
    placeholders.push(match);
    return `___LINK_${placeholders.length - 1}___`;
  });

  // 5. Linkleme İşlemi (Sadece korumasız metin üzerinde)
  let result = protectedContent;

  // Konu başlıklarını linkle
  const sortedKonular = [...konular]
    .filter((k) => k.slug !== currentSlug)
    .sort((a, b) => b.baslik.length - a.baslik.length);

  sortedKonular.forEach((konu) => {
    const aliases = TOPIC_ALIASES[konu.slug] || [konu.kisa_baslik];
    const sortedAliases = [...aliases].sort((a, b) => b.length - a.length);
    const joinedAliases = sortedAliases.join("|");

    // Turkish characters word boundary protection
    const regex = new RegExp(
      `(?<![a-zA-ZçğıöşüÇĞİÖŞÜ0-9\\[])(${joinedAliases})(?![a-zA-ZçğıöşüÇĞİÖŞÜ0-9\\s]*\\]\\()`,
      "gi"
    );

    let found = false;
    result = result.replace(regex, (match) => {
      if (!found) {
        found = true;
        return `[${match}](/konu/${konu.slug})`;
      }
      return match;
    });
  });

  // Sözlük terimlerini linkle (sozluk.mdx sayfasındayken sözlük terimlerini linkleme)
  if (currentSlug !== "sozluk") {
    GLOSSARY_TERMS.forEach((item) => {
      let termPattern = item.term;
      const lowerTerm = item.term.toLowerCase();

      if (lowerTerm === "hinterland") termPattern = "hinterland[ıınad]?";
      else if (lowerTerm === "alüvyon") termPattern = "alüvyon[laraııneü]*";
      else if (lowerTerm === "delta") termPattern = "delta(lar|ları|sının|sına|ya|nın)?";
      else if (lowerTerm === "falez") termPattern = "falez(ler|i|in|lerin|lerine|li)?";
      else if (lowerTerm === "mikroklima") termPattern = "mikroklima(lar|sı|sının|ya|nın)?";
      else if (lowerTerm === "obruk") termPattern = "obruk(lar|u|unun|una|ların)?";
      else if (lowerTerm === "terra rossa") termPattern = "terra rossa(lar)?";
      else if (lowerTerm === "tektonik") termPattern = "tektonik(ler|i|inin|ine)?";
      else if (lowerTerm === "masif") termPattern = "masif(ler|i|inin|ine|lerden)?";
      else if (lowerTerm === "karstik") termPattern = "karstik(ler|i|inin|ine|leşme|leşmiş)?";
      else if (lowerTerm === "epirojenez") termPattern = "epirojenez(in|e|le)?";
      else if (lowerTerm === "orojenez") termPattern = "orojenez(in|e|le)?";
      else if (lowerTerm === "graben") termPattern = "graben(ler|i|inin|e|lerin)?";
      else if (lowerTerm === "horst") termPattern = "horst(lar|u|unun|a|ların)?";
      else if (lowerTerm === "linyit") termPattern = "linyit(in|e|leri|lerin)?";
      else if (lowerTerm === "maki") termPattern = "maki(ler|si|sinin|ye)?";
      else if (lowerTerm === "step") termPattern = "step(ler|i|inin)?";
      else if (lowerTerm === "bozkır") termPattern = "bozkır(lar|ı|ının|a|ların)?";
      else if (lowerTerm === "plato") termPattern = "plato(lar|su|sunun|ya|ların)?";
      else if (lowerTerm === "ria") termPattern = "ria(lar)?";
      else if (lowerTerm === "dalmaçya") termPattern = "dalmaçya(lar)?";
      else if (lowerTerm === "endemik") termPattern = "endemik(ler|i|inin)?";
      else if (lowerTerm === "relikt") termPattern = "relikt(ler|i|inin)?";
      else if (lowerTerm === "nadas") termPattern = "nadas(a|ı|ın)?";
      else if (lowerTerm === "sirk") termPattern = "sirk(ler|i|lerinin)?";
      else if (lowerTerm === "moren") termPattern = "moren(ler|i|lerinin)?";
      else if (lowerTerm === "tombolo") termPattern = "tombolo(lar)?";
      else if (lowerTerm === "lagün") termPattern = "lagün(ler|ü|ünün|e)?";
      else if (lowerTerm === "kalker") termPattern = "kalker(ler|i|inin|li)?";
      else if (lowerTerm === "jips") termPattern = "jips(ler|i|inin|li)?";
      else if (lowerTerm === "kaya tuzu") termPattern = "kaya tuzu(nu|nun|na)?";

      const regex = new RegExp(
        `(?<![a-zA-ZçğıöşüÇĞİÖŞÜ0-9\\[])(${termPattern})(?![a-zA-ZçğıöşüÇĞİÖŞÜ0-9\\s]*\\]\\()`,
        "gi"
      );
      let found = false;
      result = result.replace(regex, (match) => {
        if (!found) {
          found = true;
          return `[${match}](/konu/${item.slug})`;
        }
        return match;
      });
    });
  }

  // 6. Placeholder'ları geri yükle (Sondan başa doğru)
  for (let i = placeholders.length - 1; i >= 0; i--) {
    result = result.replace(`___LINK_${i}___`, () => placeholders[i]);
    result = result.replace(`___TAG_${i}___`, () => placeholders[i]);
    result = result.replace(`___INLINE_${i}___`, () => placeholders[i]);
    result = result.replace(`___CODE_${i}___`, () => placeholders[i]);
  }

  return result;
}

export function getNextPrevKonu(currentSlug: string, konular: Konu[]) {
  const currentIndex = konular.findIndex((k) => k.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? konular[currentIndex - 1] : null,
    next: currentIndex < konular.length - 1 ? konular[currentIndex + 1] : null,
  };
}
