"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  LayerGroup,
  Marker,
  Tooltip,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IlKonuData } from "@/types";
import { slugify } from "@/lib/slugify";

// Leaflet Default Icon Düzeltmesi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- ÖZEL İKONLAR (Premium SVG & Canlı Degradeler) ---

const createCustomIcon = (
  gradientClass: string,
  svgContent: string,
  size: [number, number] = [38, 38]
) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-[38px] h-[38px] rounded-full p-2 bg-gradient-to-tr ${gradientClass} text-white border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-125 hover:rotate-6 hover:shadow-[0_0_18px_rgba(255,255,255,0.8)] cursor-pointer group">
        <div class="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        ${svgContent}
      </div>
    `,
    className: "bg-transparent",
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
  });
};

const icons = {
  mountain: (color: string) => {
    let gradient = "from-indigo-500 via-purple-500 to-fuchsia-600 shadow-indigo-500/30"; // Folded
    if (color === "#dc2626") {
      gradient = "from-rose-500 via-red-500 to-orange-500 shadow-red-500/30"; // Volcanic
    } else if (color === "#d97706") {
      gradient = "from-yellow-500 via-amber-500 to-orange-600 shadow-orange-500/30"; // Faulted
    } else if (color === "#78350f") {
      gradient = "from-stone-700 via-slate-600 to-neutral-800 shadow-stone-700/30"; // Masif
    }
    return createCustomIcon(
      gradient,
      `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
      </svg>`
    );
  },
  lake: createCustomIcon(
    "from-cyan-400 via-sky-500 to-blue-600 shadow-blue-500/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2C12 2 6 8 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8 12 2 12 2Z"/>
      <path d="M12 15C13.6569 15 15 13.6569 15 12" stroke-width="1.5"/>
    </svg>`
  ),
  gate: createCustomIcon(
    "from-rose-600 via-red-500 to-orange-600 shadow-rose-500/30 animate-pulse",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>`
  ),
  borderGate: createCustomIcon(
    "from-red-500 via-rose-600 to-rose-700 shadow-rose-600/30 animate-pulse",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>`
  ),
  gecit: createCustomIcon(
    "from-emerald-500 via-teal-600 to-cyan-600 shadow-teal-500/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 22V14C8 11.7909 9.79086 10 12 10C14.2091 10 16 11.7909 16 14V22"/>
      <path d="M4 22V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V22"/>
    </svg>`
  ),
  jeopolitik: createCustomIcon(
    "from-indigo-700 via-violet-600 to-pink-600 shadow-indigo-700/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>`
  ),
  project: createCustomIcon(
    "from-teal-500 via-emerald-500 to-cyan-400 shadow-teal-500/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18"/>
      <rect x="8" y="6" width="8" height="8" rx="1"/>
    </svg>`
  ),
  mine: createCustomIcon(
    "from-yellow-700 via-amber-600 to-yellow-500 shadow-amber-600/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2 22 9.5M2 22 9.5 14.5M16 11.5l4.5-4.5M7 16.5l4.5-4.5"/>
    </svg>`
  ),
  energy: createCustomIcon(
    "from-yellow-400 via-amber-500 to-yellow-300 shadow-yellow-400/30 animate-pulse",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>`
  ),
  tourism: createCustomIcon(
    "from-fuchsia-500 via-pink-500 to-rose-500 shadow-pink-500/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>`
  ),
  populationDense: createCustomIcon(
    "from-red-600 via-rose-500 to-red-500 shadow-red-500/30 animate-pulse",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>`
  ),
  populationSparse: createCustomIcon(
    "from-amber-400 via-yellow-500 to-orange-500 shadow-yellow-500/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>`
  ),
  trade: createCustomIcon(
    "from-emerald-500 via-teal-500 to-emerald-400 shadow-emerald-500/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>`
  ),
  river: createCustomIcon(
    "from-sky-400 via-cyan-500 to-blue-500 shadow-blue-400/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 6c4-2 6 2 10 0s6-2 10 0"/>
      <path d="M2 12c4-2 6 2 10 0s6-2 10 0"/>
      <path d="M2 18c4-2 6 2 10 0s6-2 10 0"/>
    </svg>`
  ),
  wave: createCustomIcon(
    "from-teal-400 via-cyan-400 to-emerald-500 shadow-teal-400/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12a5 5 0 0 1 5-5c2.5 0 2.5 5 5 5s2.5-5 5-5a5 5 0 0 1 5 5"/>
      <path d="M2 17a5 5 0 0 1 5-5c2.5 0 2.5 5 5 5s2.5-5 5-5a5 5 0 0 1 5 5"/>
    </svg>`
  ),
  plain: createCustomIcon(
    "from-emerald-600 via-green-500 to-lime-500 shadow-green-600/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22V8M12 8c2.5-3 5-3 7-1M12 12c-2.5-3-5-3-7-1M12 16c2.5-2 5-2 6-0.5"/>
    </svg>`
  ),
  port: createCustomIcon(
    "from-blue-700 via-indigo-600 to-cyan-500 shadow-blue-700/30",
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="5" r="3"/>
      <line x1="12" y1="8" x2="12" y2="22"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
      <path d="M5 14a7 7 0 0 0 14 0"/>
    </svg>`
  ),
};

interface HaritaGoruntuleProps {
  konuSlug: string;
  secilenIl: string | null;
  onIlSec?: (slug: string) => void;
  matrisData: Record<string, IlKonuData> | null;
  temaRenk: string;
}

interface Dag {
  ad: string;
  lat: number;
  lng: number;
  tur: "kivrim" | "kiriklik" | "volkanik";
  yukseklik?: number;
  ozellik?: string;
  grup?: string;
}

interface Kapi {
  ad: string;
  lat: number;
  lng: number;
  ulke: string;
  ozellik?: string;
  aktif?: boolean;
  tip?: string;
}

interface Akarsu {
  ad: string;
  lat: number;
  lng: number;
  havza: string;
  ozellik?: string;
  tip?: "kaynak" | "agiz";
}

interface Ova {
  ad: string;
  lat: number;
  lng: number;
  olusum: string;
  akarsu: string;
  ozellik?: string;
  alan?: number;
  il?: string;
}

interface Liman {
  ad: string;
  lat: number;
  lng: number;
  tip: string;
  kapasite?: string;
  deniz: string;
  il: string;
  ozellik?: string;
}

interface KiyiOlusum {
  ad: string;
  lat: number;
  lng: number;
  tip: string;
  deniz: string;
  kiyi_tipi: string;
  ozellik?: string;
}

export default function HaritaGoruntule({
  konuSlug,
  secilenIl,
  onIlSec,
  matrisData,
  temaRenk,
}: HaritaGoruntuleProps) {
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [tumDaglar, setTumDaglar] = useState<Dag[]>([]);
  const [tumKapilar, setTumKapilar] = useState<Kapi[]>([]);
  const [tumAkarsular, setTumAkarsular] = useState<Akarsu[]>([]);
  const [nehirYollari, setNehirYollari] = useState<
    { ad: string; path: [number, number][]; uzunluk: number; dokulduguYer: string }[]
  >([]);
  const [tumOvalar, setTumOvalar] = useState<Ova[]>([]);
  const [tumLimanlar, setTumLimanlar] = useState<Liman[]>([]);
  const [tumKiyiOlusumlar, setTumKiyiOlusumlar] = useState<KiyiOlusum[]>([]);
  const [illerHaritasi, setIllerHaritasi] = useState<Map<string, any>>(new Map());
  const [layersData, setLayersData] = useState<any>({});

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const geoRes = await fetch("/maps/turkey-iller.geojson");
        const geoJson = await geoRes.json();
        setGeoData(geoJson);

        // Dinamik Importlar (Yeni konsolide veri + Mevcut ek katmanlar)
        const [
          cografyaData,
          beseriData,
          madenEnerjiData,
          ulasimTurizmData,
          ticaretData,
          jeolojikData,
          jeopolitikData,
          kalkinmaData,
          kiyiData,
        ] = await Promise.all([
          import("../../data/leaflet/turkiye_cografya.json").then((m) => m.default),
          import("../../data/beseri-cografya.json").then((m) => m.default),
          import("../../data/madenler-enerji.json").then((m) => m.default),
          import("../../data/ulasim-turizm.json").then((m) => m.default),
          import("../../data/ticaret.json").then((m) => m.default),
          import("../../data/jeolojik-yapi.json").then((m) => m.default),
          import("../../data/jeopolitik.json").then((m) => m.default),
          import("../../data/kalkinma-projeleri.json").then((m) => m.default),
          import("../../data/kiyi-tipleri.json").then((m) => m.default),
        ]);

        // 81 İli Map olarak sakla
        const illerMap = new Map<string, any>();
        if (cografyaData.iller) {
          cografyaData.iller.forEach((il: any) => {
            illerMap.set(slugify(il.isim), il);
          });
        }
        setIllerHaritasi(illerMap);

        // Dağları KPSS türlerine göre sınıflandırarak yükle
        const daglarArr: Dag[] = (cografyaData.daglar || []).map((dag: any) => {
          let tur: "kivrim" | "kiriklik" | "volkanik" = "kivrim";
          const lowerNotlar = (dag.notlar || "").toLowerCase();
          const lowerIsim = (dag.isim || "").toLowerCase();

          if (
            lowerNotlar.includes("volkan") ||
            lowerNotlar.includes("krater") ||
            lowerNotlar.includes("kratere") ||
            lowerNotlar.includes("lav") ||
            [
              "ağrı",
              "nemrut",
              "süphan",
              "tendürek",
              "erciyes",
              "hasan",
              "melendiz",
              "karacadağ",
              "kula",
            ].some((v) => lowerIsim.includes(v))
          ) {
            tur = "volkanik";
          } else if (
            lowerNotlar.includes("kırık") ||
            lowerNotlar.includes("horst") ||
            lowerNotlar.includes("graben") ||
            ["kazdağ", "madra", "yunt", "bozdağ", "aydın", "menteşe", "amanos", "nur"].some((k) =>
              lowerIsim.includes(k)
            )
          ) {
            tur = "kiriklik";
          }

          return {
            ad: dag.isim,
            lat: dag.lat,
            lng: dag.lng,
            tur,
            yukseklik: dag.yukseklik_m,
            ozellik: `${dag.sira_dag ? dag.sira_dag + " - " : ""}${dag.notlar || ""}`,
          };
        });
        setTumDaglar(daglarArr);

        // Gölleri entegre et
        const gollerDataMerged = {
          goller: (cografyaData.goller || []).map((gol: any) => ({
            ad: gol.isim,
            lat: gol.lat,
            lng: gol.lng,
            su_turu: gol.su_tipi,
            olusum: gol.olusum_tipi,
            kpss_notu: `${gol.il ? gol.il + " - " : ""}Yüzölçümü: ${gol.yuzolcumu_km2} km² - ${gol.notlar || ""}`,
          })),
        };

        // Sınır Kapılarını entegre et
        const kapiArr: Kapi[] = (cografyaData.sinir_kapilari || []).map((kapi: any) => ({
          ad: kapi.isim,
          lat: kapi.lat,
          lng: kapi.lng,
          ulke: kapi.ulke,
          ozellik: `${kapi.il ? kapi.il + " - " : ""}${(kapi.kapi_tipi || "kara").toUpperCase()} Sınır Kapısı (${kapi.aktif ? "Aktif" : "Pasif"}) - ${kapi.notlar || ""}`,
          aktif: kapi.aktif,
          tip: kapi.kapi_tipi,
        }));
        setTumKapilar(kapiArr);

        // Akarsuları entegre et (Akış rotası çizgileri ile birlikte)
        const akarsuArr: Akarsu[] = (cografyaData.akarsular || []).map((ak: any) => ({
          ad: ak.isim,
          lat: ak.lat,
          lng: ak.lng,
          havza: ak.dokulduğu_yer || "",
          tip: ak.tip,
          ozellik: `${ak.tip === "kaynak" ? "Nehir Başlangıç Kaynağı" : "Döküldüğü Ağız"}. Uzunluk: ${ak.uzunluk_km} km. Geçtiği İller: ${ak.gectiği_iller?.join(", ") || ""}`,
        }));
        setTumAkarsular(akarsuArr);

        const yollar: {
          ad: string;
          path: [number, number][];
          uzunluk: number;
          dokulduguYer: string;
        }[] = [];
        const nehirGruplari: Record<
          string,
          {
            kaynak?: [number, number];
            agiz?: [number, number];
            uzunluk: number;
            dokulduguYer: string;
          }
        > = {};

        (cografyaData.akarsular || []).forEach((ak: any) => {
          if (!nehirGruplari[ak.isim]) {
            nehirGruplari[ak.isim] = {
              uzunluk: ak.uzunluk_km,
              dokulduguYer: ak.dokulduğu_yer || "",
            };
          }
          if (ak.tip === "kaynak") {
            nehirGruplari[ak.isim].kaynak = [ak.lat, ak.lng];
          } else if (ak.tip === "agiz") {
            nehirGruplari[ak.isim].agiz = [ak.lat, ak.lng];
          }
        });

        Object.entries(nehirGruplari).forEach(([ad, veri]) => {
          if (veri.kaynak && veri.agiz) {
            yollar.push({
              ad,
              path: [veri.kaynak, veri.agiz],
              uzunluk: veri.uzunluk,
              dokulduguYer: veri.dokulduguYer,
            });
          }
        });
        setNehirYollari(yollar);

        // Ovaları entegre et
        const ovalarArr: Ova[] = (cografyaData.ovalar || []).map((ova: any) => ({
          ad: ova.isim,
          lat: ova.lat,
          lng: ova.lng,
          olusum: ova.olusum_tipi,
          akarsu: ova.bagli_akarsu,
          alan: ova.alan_km2,
          il: ova.il,
          ozellik: ova.ekonomik_onemi,
        }));
        setTumOvalar(ovalarArr);

        // Limanları entegre et
        const limanlarArr: Liman[] = (cografyaData.limanlar || []).map((lim: any) => ({
          ad: lim.isim,
          lat: lim.lat,
          lng: lim.lng,
          tip: lim.liman_tipi,
          kapasite: lim.yillik_kapasite,
          deniz: lim.deniz,
          il: lim.il,
          ozellik: lim.notlar,
        }));
        setTumLimanlar(limanlarArr);

        // Kıyı ve Coğrafi Oluşumları entegre et
        const kiyiOlusumlarArr: KiyiOlusum[] = (cografyaData.kiyi_olusumlar || []).map(
          (ko: any) => ({
            ad: ko.isim,
            lat: ko.lat,
            lng: ko.lng,
            tip: ko.tip,
            deniz: ko.deniz,
            kiyi_tipi: ko.kiyi_tipi,
            ozellik: ko.notlar,
          })
        );
        setTumKiyiOlusumlar(kiyiOlusumlarArr);

        // Yeni zengin Maden yataklarını entegre et
        const madenlerData = (cografyaData.madenler || []).map((m: any) => ({
          ad: m.isim,
          lat: m.lat,
          lng: m.lng,
          tur: m.maden_turu,
          ozellik: `Konum: ${m.il}. ${m.dunya_siralamasi ? m.dunya_siralamasi + ". " : ""}${m.notlar || ""}`,
        }));

        // Yeni zengin Turizm yataklarını entegre et
        const turizmData = (cografyaData.turizm || []).map((t: any) => ({
          ad: t.isim,
          lat: t.lat,
          lng: t.lng,
          tur: t.turizm_tipi,
          il: t.il,
          ozellik: `${t.unesco ? "★ UNESCO Dünya Mirası Listesi. " : ""}${t.notlar || ""}`,
        }));

        setLayersData({
          gollerData: gollerDataMerged,
          beseriData,
          madenEnerjiData: {
            ...madenEnerjiData,
            Madenler: madenlerData, // Yeni veri seti ile değiştirildi
          },
          ulasimTurizmData: {
            ...ulasimTurizmData,
            turizm_merkezleri: turizmData, // Yeni veri seti ile değiştirildi
          },
          ticaretData,
          jeolojikData,
          jeopolitikData,
          kalkinmaData,
          kiyiData,
        });
      } catch (err) {
        console.error("Harita verileri yüklenirken hata:", err);
      }
    };

    loadMapData();
  }, []);

  const getFillColor = (ilSlug: string): string => {
    if (!matrisData || !matrisData[ilSlug]) return "#f8fafc";
    const data = matrisData[ilSlug];
    const durum = data && "harita_renk" in data ? data.harita_renk : "yok";

    if (durum === "koyu") return temaRenk;
    if (durum === "orta") return `${temaRenk}CC`;
    if (durum === "açık") return `${temaRenk}66`;
    return "#f8fafc";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styleFeature = (feature: any) => {
    const adHam: string = feature?.properties?.name ?? feature?.properties?.il_adi ?? "";
    const ilSlug = slugify(adHam);
    const isSelected = secilenIl === ilSlug;

    return {
      fillColor: getFillColor(ilSlug),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? "#2563eb" : "#cbd5e1",
      fillOpacity: isSelected ? 0.95 : 0.8,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const adHam: string = feature?.properties?.name ?? feature?.properties?.il_adi ?? "";
    const ilSlug = slugify(adHam);

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: "#6366f1",
          fillOpacity: 0.95,
        });
        l.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        e.target.setStyle(styleFeature(feature));
      },
      click: () => onIlSec && onIlSec(ilSlug),
    });

    if (adHam) {
      const ilDetay = illerHaritasi.get(ilSlug);

      let tooltipContent = `
        <div class="px-3 py-2 font-sans min-w-[160px]">
          <div class="font-bold text-gray-900 border-b pb-1 mb-1.5 flex items-center justify-between gap-3">
            <span>${adHam}</span>
            ${ilDetay ? `<span class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-blue-100">${String(ilDetay.plaka_kodu).padStart(2, "0")}</span>` : ""}
          </div>
      `;

      if (ilDetay) {
        tooltipContent += `
          <div class="text-xs text-gray-700 space-y-1">
            <div><span class="text-gray-400">Bölge:</span> <b>${ilDetay.cografya_bolgesi}</b></div>
            <div><span class="text-gray-400">Nüfus:</span> <b>${ilDetay.nufus_yaklasik.toLocaleString("tr-TR")}</b></div>
            ${ilDetay.notlar ? `<div class="text-[10px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded mt-1 border border-amber-100 font-semibold">📌 ${ilDetay.notlar}</div>` : ""}
          </div>
        `;
      }

      tooltipContent += `
          <div class="text-[9px] text-blue-600 font-semibold uppercase mt-2 tracking-wider border-t pt-1.5">Detaylar için tıkla</div>
        </div>
      `;

      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: "top",
        className: "custom-tooltip shadow-xl border-0 rounded-lg overflow-hidden p-0",
      });
    }
  };

  if (!geoData) {
    return (
      <div className="w-full h-full min-h-[500px] bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Harita Verileri Yükleniyor…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group">
      <MapContainer
        center={[39.0, 35.2]}
        zoom={6.5}
        minZoom={6}
        maxZoom={12}
        maxBounds={[
          [33.0, 22.0],
          [44.5, 49.0],
        ]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: "#f8fafc" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Modern Sade">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; CARTO"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topoğrafik (Fiziki)">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenTopoMap"
            />
          </LayersControl.BaseLayer>

          {/* İller Katmanı */}
          <LayersControl.Overlay checked name="📍 Şehir Dağılımı">
            <LayerGroup>
              {geoData && (
                <GeoJSON
                  key={`${konuSlug}-${secilenIl}`}
                  data={geoData}
                  style={styleFeature}
                  onEachFeature={onEachFeature}
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Dağlar */}
          <LayersControl.Overlay
            checked={["yer-sekilleri", "daglar"].includes(konuSlug)}
            name="⛰️ Dağlar"
          >
            <LayerGroup>
              {tumDaglar.map((dag, i) => (
                <Marker
                  key={`dag-${i}`}
                  position={[dag.lat, dag.lng]}
                  icon={icons.mountain(
                    dag.tur === "volkanik"
                      ? "#dc2626"
                      : dag.tur === "kiriklik"
                        ? "#d97706"
                        : "#7c3aed"
                  )}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -15]}
                    className="rounded-lg shadow-lg border-0 p-2"
                  >
                    <div className="text-center">
                      <div className="font-bold text-gray-800">{dag.ad}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        {dag.tur === "volkanik"
                          ? "🌋 Volkanik"
                          : dag.tur === "kiriklik"
                            ? "🧱 Kırıklı"
                            : "⛰️ Kıvrımlı"}{" "}
                        Dağ
                      </div>
                    </div>
                  </Tooltip>
                  <Popup className="premium-popup">
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{dag.tur === "volkanik" ? "🌋" : "⛰️"}</span>
                        <h3 className="font-bold text-lg leading-tight">{dag.ad}</h3>
                      </div>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="text-gray-500">Oluşum Türü:</span>{" "}
                          <span className="font-semibold text-indigo-700 capitalize">
                            {dag.tur}
                          </span>
                        </p>
                        {dag.yukseklik && (
                          <p>
                            <span className="text-gray-500">Zirve Yüksekliği:</span>{" "}
                            <span className="font-bold text-blue-600">{dag.yukseklik} m</span>
                          </p>
                        )}
                        {dag.ozellik && (
                          <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded mt-2 border border-gray-100">
                            &quot;{dag.ozellik}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Göller */}
          <LayersControl.Overlay
            checked={["yer-sekilleri", "goller"].includes(konuSlug)}
            name="🌊 Göller"
          >
            <LayerGroup>
              {layersData.gollerData?.goller
                ?.filter((g: any) => g.lat)
                .map((gol: any, i: number) => (
                  <Marker key={`gol-${i}`} position={[gol.lat, gol.lng]} icon={icons.lake}>
                    <Tooltip direction="top" offset={[0, -15]}>
                      <span className="font-bold">{gol.ad} Gölü</span>
                    </Tooltip>
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">💧</span>
                          <h3 className="font-bold text-lg text-blue-800">{gol.ad} Gölü</h3>
                        </div>
                        <div className="text-sm space-y-1 border-t pt-2 mt-2">
                          <p>
                            <span className="text-gray-500">Su Karakteri:</span>{" "}
                            <span className="font-medium text-cyan-700 capitalize">
                              {gol.su_turu}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-500">Jeolojik Oluşum:</span>{" "}
                            <span className="font-medium text-indigo-700 capitalize">
                              {gol.olusum}
                            </span>
                          </p>
                          {gol.kpss_notu && (
                            <div className="mt-3 bg-blue-50 text-blue-800 p-2.5 rounded-lg text-xs border border-blue-100 font-medium">
                              📌 {gol.kpss_notu}
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Ovalar */}
          <LayersControl.Overlay
            checked={["yer-sekilleri", "ovalar"].includes(konuSlug)}
            name="🌾 Ovalar"
          >
            <LayerGroup>
              {tumOvalar.map((ova, i) => (
                <Marker key={`ova-${i}`} position={[ova.lat, ova.lng]} icon={icons.plain}>
                  <Tooltip direction="top" offset={[0, -12]}>
                    <span className="font-bold">{ova.ad} Ovası</span>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 min-w-[220px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🌾</span>
                        <h3 className="font-bold text-green-700 text-lg leading-tight">
                          {ova.ad} Ovası
                        </h3>
                      </div>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="text-gray-500">Oluşum Türü:</span>{" "}
                          <span className="font-semibold text-green-800 uppercase">
                            {ova.olusum}
                          </span>
                        </p>
                        {ova.akarsu && ova.akarsu !== "Yok (kuru ova)" && (
                          <p>
                            <span className="text-gray-500">Besleyen Akarsu:</span>{" "}
                            <span className="font-medium text-blue-600">{ova.akarsu}</span>
                          </p>
                        )}
                        {ova.alan && (
                          <p>
                            <span className="text-gray-500">Yüzölçümü:</span>{" "}
                            <span className="font-bold text-slate-700">
                              {ova.alan.toLocaleString("tr-TR")} km²
                            </span>
                          </p>
                        )}
                        {ova.il && (
                          <p>
                            <span className="text-gray-500">Konum (İl):</span>{" "}
                            <span className="font-medium text-slate-800">{ova.il}</span>
                          </p>
                        )}
                        {ova.ozellik && (
                          <p className="text-xs text-green-900 bg-green-50/70 p-2.5 rounded mt-3 border border-green-100 leading-relaxed italic">
                            📌 &quot;{ova.ozellik}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Sınır Kapıları */}
          <LayersControl.Overlay
            checked={["cografi-konum", "sinir-kapilari"].includes(konuSlug)}
            name="🚩 Sınır Kapıları"
          >
            <LayerGroup>
              {tumKapilar.map((kapi, i) => (
                <Marker key={`kapi-${i}`} position={[kapi.lat, kapi.lng]} icon={icons.borderGate}>
                  <Tooltip offset={[0, -12]}>
                    <b>{kapi.ad} Sınır Kapısı</b>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h4 className="font-bold text-red-600 text-lg mb-1">{kapi.ad} Kapısı</h4>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="text-gray-500">Bağlantı Ülkesi:</span>{" "}
                          <span className="font-bold text-gray-800">{kapi.ulke}</span>
                        </p>
                        {kapi.tip && (
                          <p>
                            <span className="text-gray-500">Ulaşım Yolu:</span>{" "}
                            <span className="font-medium text-indigo-600 uppercase font-semibold">
                              {kapi.tip} Yolu
                            </span>
                          </p>
                        )}
                        {kapi.ozellik && (
                          <p className="text-xs mt-3 text-red-900 bg-red-50 p-2.5 rounded border border-red-100 font-medium">
                            {kapi.ozellik}
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Nüfus Yoğunluğu */}
          {konuSlug === "beseri-cografya" && (
            <>
              <LayersControl.Overlay checked name="🔴 Yoğun Nüfus">
                <LayerGroup>
                  {layersData.beseriData?.nufus_yogunlugu?.yogun?.map((yer: any, i: number) => (
                    <Marker
                      key={`y-${i}`}
                      position={[yer.lat, yer.lng]}
                      icon={icons.populationDense}
                    >
                      <Popup>
                        <div className="p-2 font-sans">
                          <h4 className="font-bold text-red-700 text-lg">{yer.ad}</h4>
                          <p className="text-sm mt-1">
                            <b>Yoğunluk Sebebi:</b> {yer.sebep}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="🟡 Seyrek Nüfus">
                <LayerGroup>
                  {layersData.beseriData?.nufus_yogunlugu?.seyrek?.map((yer: any, i: number) => (
                    <Marker
                      key={`s-${i}`}
                      position={[yer.lat, yer.lng]}
                      icon={icons.populationSparse}
                    >
                      <Popup>
                        <div className="p-2 font-sans">
                          <h4 className="font-bold text-amber-700 text-lg">{yer.ad}</h4>
                          <p className="text-sm mt-1">
                            <b>Seyreklik Sebebi:</b> {yer.sebep}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            </>
          )}

          {/* Madenler ve Enerji */}
          <LayersControl.Overlay checked={konuSlug === "madenler-enerji"} name="⛏️ Madenler">
            <LayerGroup>
              {layersData.madenEnerjiData?.["Madenler"]?.map((maden: any, i: number) => (
                <Marker key={`m-${i}`} position={[maden.lat, maden.lng]} icon={icons.mine}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h4 className="font-bold text-amber-950 text-lg leading-tight">{maden.ad}</h4>
                      <div className="text-xs font-bold uppercase text-amber-700 mt-1">
                        ⚙️ {maden.tur} Yatağı
                      </div>
                      <p className="text-xs mt-3 text-gray-700 bg-amber-50/50 p-2.5 rounded border border-amber-100 leading-relaxed font-medium">
                        {maden.ozellik}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay
            checked={konuSlug === "madenler-enerji"}
            name="⚡ Enerji Santralleri"
          >
            <LayerGroup>
              {layersData.madenEnerjiData?.["Enerji Santralleri"]?.map((enerji: any, i: number) => (
                <Marker key={`e-${i}`} position={[enerji.lat, enerji.lng]} icon={icons.energy}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-yellow-700 text-lg">{enerji.ad}</h4>
                      <p className="text-sm">
                        <b>Kaynak:</b> {enerji.tur}
                      </p>
                      <p className="text-xs mt-2 text-gray-600">{enerji.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Ulaşım, Limanlar ve Turizm */}
          <LayersControl.Overlay checked={konuSlug === "ulasim"} name="🛣️ Geçitler & Tüneller">
            <LayerGroup>
              {layersData.ulasimTurizmData?.gecitler_ve_tuneller?.map((gecit: any, i: number) => (
                <Marker key={`gecit-${i}`} position={[gecit.lat, gecit.lng]} icon={icons.gecit}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-slate-800 text-lg">{gecit.ad}</h4>
                      <p className="text-sm mt-1">
                        <b>Bağlantı:</b> {gecit.baglanti}
                      </p>
                      {gecit.not && (
                        <p className="text-xs mt-2 italic text-blue-700 font-medium">
                          📌 {gecit.not}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay
            checked={["ulasim", "ticaret"].includes(konuSlug)}
            name="⚓ Limanlar"
          >
            <LayerGroup>
              {tumLimanlar.map((liman, i) => (
                <Marker key={`lim-${i}`} position={[liman.lat, liman.lng]} icon={icons.port}>
                  <Tooltip direction="top" offset={[0, -12]}>
                    <span className="font-bold">{liman.ad}</span>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 min-w-[210px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⚓</span>
                        <h3 className="font-bold text-blue-800 text-lg leading-tight">
                          {liman.ad}
                        </h3>
                      </div>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="text-gray-500">Liman Tipi:</span>{" "}
                          <span className="font-semibold text-blue-600 uppercase font-mono">
                            {liman.tip}
                          </span>
                        </p>
                        {liman.kapasite && (
                          <p>
                            <span className="text-gray-500">Yıllık Kapasite:</span>{" "}
                            <span className="font-bold text-amber-600">{liman.kapasite}</span>
                          </p>
                        )}
                        <p>
                          <span className="text-gray-500">Kıyısı Olduğu Deniz:</span>{" "}
                          <span className="font-medium text-slate-800">{liman.deniz} Denizi</span>
                        </p>
                        <p>
                          <span className="text-gray-500">Şehir:</span>{" "}
                          <span className="font-semibold text-slate-700">{liman.il}</span>
                        </p>
                        {liman.ozellik && (
                          <p className="text-xs text-gray-700 bg-blue-50/50 p-2.5 rounded mt-3 border border-blue-100 font-medium leading-relaxed">
                            📌 {liman.ozellik}
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked={konuSlug === "turizm"} name="🏖️ Turizm Merkezleri">
            <LayerGroup>
              {layersData.ulasimTurizmData?.turizm_merkezleri?.map((turizm: any, i: number) => (
                <Marker key={`tur-${i}`} position={[turizm.lat, turizm.lng]} icon={icons.tourism}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h4 className="font-bold text-pink-700 text-lg leading-tight">{turizm.ad}</h4>
                      <div className="text-[10px] font-bold uppercase text-gray-400 mt-1 mb-2">
                        🌴 {(turizm.tur || "genel").toUpperCase()} TURİZMİ
                      </div>
                      <div className="text-sm border-t pt-2">
                        <p>
                          <span className="text-gray-500">Şehir:</span>{" "}
                          <span className="font-bold text-slate-800">{turizm.il}</span>
                        </p>
                        <p className="text-xs mt-2.5 text-slate-700 bg-pink-50/50 p-2.5 rounded border border-pink-100 leading-relaxed font-semibold">
                          {turizm.ozellik}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Akarsular */}
          <LayersControl.Overlay checked={konuSlug === "akarsular"} name="🗾 Akarsular">
            <LayerGroup>
              {nehirYollari.map((nehir, i) => (
                <Polyline
                  key={`yol-${i}`}
                  positions={nehir.path}
                  pathOptions={{
                    color: "#0ea5e9",
                    weight: 3.5,
                    opacity: 0.8,
                    dashArray: "6, 12",
                  }}
                >
                  <Tooltip sticky>
                    <div className="font-sans px-1.5 py-0.5">
                      <span className="font-bold text-blue-900">{nehir.ad}</span>
                      <span className="text-[10px] text-gray-500 block">Akış Rotası</span>
                    </div>
                  </Tooltip>
                </Polyline>
              ))}
              {tumAkarsular.map((ak, i) => (
                <Marker key={`ak-${i}`} position={[ak.lat, ak.lng]} icon={icons.river}>
                  <Tooltip direction="top" offset={[0, -12]}>
                    <span className="font-bold">
                      {ak.ad} ({ak.tip === "kaynak" ? "Kaynağı" : "Ağzı"})
                    </span>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 min-w-[220px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">💧</span>
                        <h4 className="font-bold text-blue-800 text-lg leading-tight">{ak.ad}</h4>
                      </div>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="text-gray-500">Konum Tipi:</span>{" "}
                          <span className="font-bold text-blue-600 uppercase text-[11px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block mt-0.5">
                            {ak.tip === "kaynak" ? "Nehir Kaynağı" : "Denize Döküldüğü Ağız"}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">Havza / Döküldüğü Yer:</span>{" "}
                          <span className="font-medium text-slate-800">{ak.havza}</span>
                        </p>
                        <p className="text-xs text-gray-700 mt-3 bg-blue-50/30 p-2.5 rounded border border-blue-100 leading-relaxed font-semibold">
                          {ak.ozellik}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Kıyı Oluşumları */}
          <LayersControl.Overlay
            checked={["kiyi-tipleri", "yer-sekilleri"].includes(konuSlug)}
            name="🌊 Coğrafi ve Kıyı Oluşumları"
          >
            <LayerGroup>
              {tumKiyiOlusumlar.map((ko, i) => (
                <Marker key={`ko-${i}`} position={[ko.lat, ko.lng]} icon={icons.wave}>
                  <Tooltip direction="top" offset={[0, -12]}>
                    <span className="font-bold">{ko.ad}</span>
                  </Tooltip>
                  <Popup>
                    <div className="p-2 min-w-[220px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🌊</span>
                        <h3 className="font-bold text-cyan-800 text-lg leading-tight">{ko.ad}</h3>
                      </div>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="text-gray-500">Oluşum Tipi:</span>{" "}
                          <span className="font-bold text-cyan-700 uppercase font-mono">
                            {ko.tip}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">Kıyı Tipi Karakteristiği:</span>{" "}
                          <span className="font-semibold text-indigo-600 uppercase text-[11px]">
                            {ko.kiyi_tipi} Kıyı Tipi
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">Deniz:</span>{" "}
                          <span className="font-medium">{ko.deniz} Denizi</span>
                        </p>
                        {ko.ozellik && (
                          <p className="text-xs text-cyan-950 bg-cyan-50/70 p-2.5 rounded mt-3 border border-cyan-100 leading-relaxed font-medium italic">
                            📌 &quot;{ko.ozellik}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Ticaret */}
          <LayersControl.Overlay checked={konuSlug === "ticaret"} name="💰 Ticaret & Sanayi">
            <LayerGroup>
              {layersData.ticaretData?.ticaret_merkezleri?.map((tm: any, i: number) => (
                <Marker key={`tm-${i}`} position={[tm.lat, tm.lng]} icon={icons.trade}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-emerald-700 text-lg">{tm.ad}</h4>
                      <p className="text-sm">
                        <b>Tip:</b> {tm.tip}
                      </p>
                      <p className="text-xs mt-2 text-gray-600">{tm.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Jeopolitik */}
          <LayersControl.Overlay
            checked={konuSlug === "bolge-jeopolitik"}
            name="🏛️ Jeopolitik Noktalar"
          >
            <LayerGroup>
              {layersData.jeopolitikData?.stratejik_noktalar?.map((sn: any, i: number) => (
                <Marker key={`sn-${i}`} position={[sn.lat, sn.lng]} icon={icons.jeopolitik}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-indigo-700 text-lg">{sn.ad}</h4>
                      <p className="text-xs mt-2 text-gray-600">{sn.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Jeolojik Yapı */}
          <LayersControl.Overlay checked={konuSlug === "jeolojik-yapi"} name="🧬 Masifler & Faylar">
            <LayerGroup>
              {layersData.jeolojikData?.masifler?.map((ms: any, i: number) => (
                <Marker
                  key={`ms-${i}`}
                  position={[ms.lat, ms.lng]}
                  icon={icons.mountain("#78350f")}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-orange-900 text-lg">{ms.ad}</h4>
                      <p className="text-xs mt-2 text-gray-600">{ms.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Kalkınma Projeleri */}
          <LayersControl.Overlay
            checked={konuSlug === "kalkinma-projeleri"}
            name="🏗️ Bölgesel Projeler"
          >
            <LayerGroup>
              {layersData.kalkinmaData?.projeler?.map((kp: any, i: number) => (
                <Marker key={`kp-${i}`} position={[kp.lat, kp.lng]} icon={icons.project}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-red-700 text-lg">{kp.ad}</h4>
                      <p className="text-xs mt-2 text-gray-600">{kp.ozellik}</p>
                      <p className="text-[10px] mt-1 text-gray-400">
                        Kapsam: {kp.iller.join(", ")}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Kıyı Tipleri (Ekstra Bilgiler) */}
          <LayersControl.Overlay
            checked={konuSlug === "kiyi-tipleri"}
            name="🌊 Kıyı Tipleri Bilgisi"
          >
            <LayerGroup>
              {layersData.kiyiData?.kiyi_tipleri?.map((kt: any, i: number) => (
                <Marker key={`kt-${i}`} position={[kt.lat, kt.lng]} icon={icons.wave}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-cyan-700 text-lg">{kt.ad}</h4>
                      <p className="text-sm">
                        <b>Konum:</b> {kt.ornek || kt.bolge}
                      </p>
                      <p className="text-xs mt-2 text-gray-600">{kt.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* Legend / Bilgi Kutusu (Sağ Alt) */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">
          Harita Rehberi
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: temaRenk }}></div>
            <span className="text-[11px] font-medium text-gray-600">Yoğun Dağılım</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${temaRenk}66` }}></div>
            <span className="text-[11px] font-medium text-gray-600">Seyrek Dağılım</span>
          </div>
        </div>
      </div>
    </div>
  );
}
