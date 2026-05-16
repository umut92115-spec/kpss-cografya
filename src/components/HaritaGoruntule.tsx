'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, LayerGroup, Marker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IlKonuData } from '@/types';
import { slugify } from '@/lib/slugify';

// JSON verileri artık dinamik olarak (import()) yüklenecek.

// Leaflet Default Icon Düzeltmesi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- ÖZEL İKONLAR (Premium SVG) ---

const createCustomIcon = (svgHtml: string, size: [number, number] = [32, 32]) => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center filter drop-shadow-md transition-transform hover:scale-110">${svgHtml}</div>`,
    className: 'bg-transparent',
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
  });
};

const icons = {
  mountain: (color: string) => createCustomIcon(`
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
    </svg>
  `),
  lake: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="28" height="28" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill-opacity="0.2"/>
      <path d="M12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" fill-opacity="0.4"/>
      <path d="M12 14c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill-opacity="0.8"/>
    </svg>
  `),
  gate: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#ef4444" stroke="white" stroke-width="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12h6m-3-3v6" stroke="white" stroke-width="2"/>
    </svg>
  `),
  mine: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#92400e" stroke="white" stroke-width="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M7 12h10M12 7v10" stroke-opacity="0.5"/>
    </svg>
  `),
  energy: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#eab308" stroke="#854d0e" stroke-width="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  `),
  tourism: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="28" height="28" fill="#ec4899" stroke="white" stroke-width="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  `),
  populationDense: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="30" height="30" fill="#dc2626" stroke="white" stroke-width="1.5">
      <circle cx="12" cy="12" r="8" fill-opacity="0.6" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  `),
  populationSparse: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#f59e0b" stroke="white" stroke-width="1.5">
      <circle cx="12" cy="12" r="6" fill-opacity="0.4" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  `),
  trade: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#10b981" stroke="white" stroke-width="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  `),
  river: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round">
      <path d="M12 2c0 10-10 10-10 20M12 2c0 10 10 10 10 20" />
    </svg>
  `),
  wave: createCustomIcon(`
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round">
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 16c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  `),
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
  tur: 'kivrim' | 'kiriklik' | 'volkanik';
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
}

interface Akarsu {
  ad: string;
  lat: number;
  lng: number;
  havza: string;
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
  const [layersData, setLayersData] = useState<any>({});

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const geoRes = await fetch('/maps/turkey-iller.geojson');
        const geoJson = await geoRes.json();
        setGeoData(geoJson);

        // Dinamik Importlar (Bundle optimizasyonu için)
        const [
          daglarData,
          komsularData,
          akarsuData,
          gollerData,
          beseriData,
          madenEnerjiData,
          ulasimTurizmData,
          ticaretData,
          jeolojikData,
          jeopolitikData,
          kalkinmaData,
          kiyiData
        ] = await Promise.all([
          import('../../data/yer-sekilleri/daglar.json').then(m => m.default),
          import('../../data/sinir-komsulari.json').then(m => m.default),
          import('../../data/akarsular.json').then(m => m.default),
          import('../../data/goller.json').then(m => m.default),
          import('../../data/beseri-cografya.json').then(m => m.default),
          import('../../data/madenler-enerji.json').then(m => m.default),
          import('../../data/ulasim-turizm.json').then(m => m.default),
          import('../../data/ticaret.json').then(m => m.default),
          import('../../data/jeolojik-yapi.json').then(m => m.default),
          import('../../data/jeopolitik.json').then(m => m.default),
          import('../../data/kalkinma-projeleri.json').then(m => m.default),
          import('../../data/kiyi-tipleri.json').then(m => m.default)
        ]);

        setLayersData({
          gollerData,
          beseriData,
          madenEnerjiData,
          ulasimTurizmData,
          ticaretData,
          jeolojikData,
          jeopolitikData,
          kalkinmaData,
          kiyiData
        });

        // Verileri Düzleştir
        const daglarArr: Dag[] = [];
        const seenDags = new Set<string>();

        (['kivrim', 'kiriklik', 'volkanik'] as const).forEach(tur => {
          const turData = (daglarData as any)[tur];
          if (!turData) return;
          const gruplar = turData.gruplar || (turData.daglar ? [{ daglar: turData.daglar }] : []);
          gruplar.forEach((grup: any) => {
            if (grup.daglar) {
              grup.daglar.forEach((dag: any) => {
                if (dag.lat) {
                  daglarArr.push({...dag, tur, grup: grup.grup || ''});
                  seenDags.add(dag.ad);
                }
              });
            }
          });
          if (turData.daglar && !turData.gruplar) {
            turData.daglar.forEach((dag: any) => {
              if (dag.lat && !seenDags.has(dag.ad)) {
                daglarArr.push({...dag, tur});
                seenDags.add(dag.ad);
              }
            });
          }
        });
        setTumDaglar(daglarArr);

        const kapiArr: Kapi[] = [];
        (komsularData as any).forEach((komsu: any) => {
          if (komsu.sinir_kapilari) {
            komsu.sinir_kapilari.forEach((kapi: any) => {
              if (kapi.lat) kapiArr.push({...kapi, ulke: komsu.ulke});
            });
          }
        });
        setTumKapilar(kapiArr);

        const akarsuArr: Akarsu[] = [];
        Object.keys((akarsuData as any).dokulduklari_havzalar).forEach(havza => {
          const hData = (akarsuData as any).dokulduklari_havzalar[havza];
          if (hData.akarsular) {
            hData.akarsular.forEach((ak: any) => {
              if (ak.lat) akarsuArr.push({...ak, havza});
            });
          }
        });
        setTumAkarsular(akarsuArr);
      } catch (err) {
        console.error("Harita verileri yüklenirken hata:", err);
      }
    };

    loadMapData();
  }, []);

  const getFillColor = (ilSlug: string): string => {
    if (!matrisData || !matrisData[ilSlug]) return '#f1f5f9';
    const data = matrisData[ilSlug];
    const durum = data && 'harita_renk' in data ? data.harita_renk : 'yok';
    
    // Daha doygun ve premium renk paleti
    if (durum === 'koyu') return temaRenk;
    if (durum === 'orta') return `${temaRenk}CC`;
    if (durum === 'açık') return `${temaRenk}66`;
    return '#f1f5f9';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styleFeature = (feature: any) => {
    const adHam: string = feature?.properties?.name ?? feature?.properties?.il_adi ?? '';
    const ilSlug = slugify(adHam);
    const isSelected = secilenIl === ilSlug;
    
    return {
      fillColor: getFillColor(ilSlug),
      weight: isSelected ? 2.5 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : '#cbd5e1',
      fillOpacity: isSelected ? 0.9 : 0.7,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const adHam: string = feature?.properties?.name ?? feature?.properties?.il_adi ?? '';
    const ilSlug = slugify(adHam);

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const l = e.target;
        l.setStyle({ 
          weight: 3, 
          color: '#3b82f6', 
          fillOpacity: 0.95 
        });
        l.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        e.target.setStyle(styleFeature(feature));
      },
      click: () => onIlSec && onIlSec(ilSlug),
    });

    if (adHam) {
      layer.bindTooltip(`
        <div class="px-2 py-1 font-sans">
          <div class="font-bold text-gray-900">${adHam}</div>
          <div class="text-[10px] text-gray-500 uppercase tracking-wider">Detaylar için tıkla</div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip shadow-xl border-0 rounded-lg overflow-hidden p-0',
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
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#f8fafc' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Modern Sade">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topoğrafik (Fiziki)">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenTopoMap'
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
          <LayersControl.Overlay checked={['yer-sekilleri', 'daglar'].includes(konuSlug)} name="⛰️ Dağlar">
            <LayerGroup>
              {tumDaglar.map((dag, i) => (
                <Marker
                  key={`dag-${i}`}
                  position={[dag.lat, dag.lng]}
                  icon={icons.mountain(dag.tur === 'volkanik' ? '#dc2626' : dag.tur === 'kiriklik' ? '#d97706' : '#7c3aed')}
                >
                  <Tooltip direction="top" offset={[0, -15]} className="rounded-lg shadow-lg border-0 p-2">
                    <div className="text-center">
                      <div className="font-bold text-gray-800">{dag.ad}</div>
                      <div className="text-[10px] text-gray-500">{dag.tur.toUpperCase()} DAĞ</div>
                    </div>
                  </Tooltip>
                  <Popup className="premium-popup">
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⛰️</span>
                        <h3 className="font-bold text-lg leading-tight">{dag.ad}</h3>
                      </div>
                      <div className="space-y-1 text-sm border-t pt-2 mt-2">
                        <p><span className="text-gray-500">Tür:</span> <span className="font-medium">{dag.tur}</span></p>
                        {dag.yukseklik && <p><span className="text-gray-500">Yükseklik:</span> <span className="font-medium text-blue-600">{dag.yukseklik} m</span></p>}
                        {dag.ozellik && <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded mt-2">&quot;{dag.ozellik}&quot;</p>}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Göller */}
          <LayersControl.Overlay checked={['yer-sekilleri', 'goller'].includes(konuSlug)} name="🌊 Göller">
            <LayerGroup>
              {layersData.gollerData?.goller?.filter((g: any) => g.lat).map((gol: any, i: number) => (
                <Marker
                  key={`gol-${i}`}
                  position={[gol.lat, gol.lng]}
                  icon={icons.lake}
                >
                  <Tooltip direction="top" offset={[0, -15]}>
                    <span className="font-bold">{gol.ad}</span>
                  </Tooltip>
                  <Popup>
                    <div className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">💧</span>
                        <h3 className="font-bold text-lg">{gol.ad} Gölü</h3>
                      </div>
                      <div className="text-sm space-y-1 border-t pt-2 mt-2">
                        <p><span className="text-gray-500">Su:</span> <span className="font-medium">{gol.su_turu}</span></p>
                        <p><span className="text-gray-500">Oluşum:</span> <span className="font-medium">{gol.olusum}</span></p>
                        {gol.kpss_notu && <div className="mt-3 bg-blue-50 text-blue-800 p-2 rounded-lg text-xs font-semibold border border-blue-100 italic">📌 {gol.kpss_notu}</div>}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Sınır Kapıları */}
          <LayersControl.Overlay checked={['cografi-konum', 'sinir-kapilari'].includes(konuSlug)} name="🚩 Sınır Kapıları">
            <LayerGroup>
              {tumKapilar.map((kapi, i) => (
                <Marker
                  key={`kapi-${i}`}
                  position={[kapi.lat, kapi.lng]}
                  icon={icons.gate}
                >
                  <Tooltip offset={[0, -12]}><b>{kapi.ad}</b></Tooltip>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-red-600 text-lg mb-1">{kapi.ad} Kapısı</h4>
                      <p className="text-sm"><b>Ülke:</b> {kapi.ulke}</p>
                      {kapi.ozellik && <p className="text-xs mt-2 text-gray-600 bg-red-50 p-2 rounded">{kapi.ozellik}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Nüfus Yoğunluğu */}
          {konuSlug === 'beseri-cografya' && (
            <>
              <LayersControl.Overlay checked name="🔴 Yoğun Nüfus">
                <LayerGroup>
                  {layersData.beseriData?.nufus_yogunlugu?.yogun?.map((yer: any, i: number) => (
                    <Marker key={`y-${i}`} position={[yer.lat, yer.lng]} icon={icons.populationDense}>
                      <Popup>
                        <div className="p-2 font-sans">
                          <h4 className="font-bold text-red-700 text-lg">{yer.ad}</h4>
                          <p className="text-sm mt-1"><b>Yoğunluk Sebebi:</b> {yer.sebep}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="🟡 Seyrek Nüfus">
                <LayerGroup>
                  {layersData.beseriData?.nufus_yogunlugu?.seyrek?.map((yer: any, i: number) => (
                    <Marker key={`s-${i}`} position={[yer.lat, yer.lng]} icon={icons.populationSparse}>
                      <Popup>
                        <div className="p-2 font-sans">
                          <h4 className="font-bold text-amber-700 text-lg">{yer.ad}</h4>
                          <p className="text-sm mt-1"><b>Seyreklik Sebebi:</b> {yer.sebep}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            </>
          )}

          {/* Madenler ve Enerji */}
          <LayersControl.Overlay checked={konuSlug === 'madenler-enerji'} name="⛏️ Madenler">
            <LayerGroup>
              {layersData.madenEnerjiData?.['Madenler']?.map((maden: any, i: number) => (
                <Marker key={`m-${i}`} position={[maden.lat, maden.lng]} icon={icons.mine}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-amber-900 text-lg">{maden.ad}</h4>
                      <div className="text-sm mt-1 italic">{maden.tur} Yatağı</div>
                      <p className="text-xs mt-2 text-gray-600">{maden.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked={konuSlug === 'madenler-enerji'} name="⚡ Enerji Santralleri">
            <LayerGroup>
              {layersData.madenEnerjiData?.['Enerji Santralleri']?.map((enerji: any, i: number) => (
                <Marker key={`e-${i}`} position={[enerji.lat, enerji.lng]} icon={icons.energy}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-yellow-700 text-lg">{enerji.ad}</h4>
                      <p className="text-sm"><b>Kaynak:</b> {enerji.tur}</p>
                      <p className="text-xs mt-2 text-gray-600">{enerji.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Ulaşım ve Turizm */}
          <LayersControl.Overlay checked={konuSlug === 'ulasim'} name="🛣️ Geçitler & Tüneller">
            <LayerGroup>
              {layersData.ulasimTurizmData?.gecitler_ve_tuneller?.map((gecit: any, i: number) => (
                <Marker key={`gecit-${i}`} position={[gecit.lat, gecit.lng]} icon={icons.gate}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-slate-800 text-lg">{gecit.ad}</h4>
                      <p className="text-sm mt-1"><b>Bağlantı:</b> {gecit.baglanti}</p>
                      {gecit.not && <p className="text-xs mt-2 italic text-blue-700 font-medium">📌 {gecit.not}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked={konuSlug === 'turizm'} name="🏖️ Turizm Merkezleri">
            <LayerGroup>
              {layersData.ulasimTurizmData?.turizm_merkezleri?.map((turizm: any, i: number) => (
                <Marker key={`tur-${i}`} position={[turizm.lat, turizm.lng]} icon={icons.tourism}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-pink-700 text-lg">{turizm.ad}</h4>
                      <div className="text-xs font-bold uppercase text-gray-400 mb-1">{turizm.tur}</div>
                      <p className="text-sm"><b>Konum:</b> {turizm.il}</p>
                      <p className="text-xs mt-2 text-gray-600">{turizm.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Akarsular */}
          <LayersControl.Overlay checked={konuSlug === 'akarsular'} name="🗾 Akarsular">
            <LayerGroup>
              {tumAkarsular.map((ak, i) => (
                <Marker key={`ak-${i}`} position={[ak.lat, ak.lng]} icon={icons.river}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-blue-700 text-lg">{ak.ad}</h4>
                      <p className="text-sm"><b>Havza:</b> {ak.havza.toUpperCase()}</p>
                      <p className="text-xs mt-2 text-gray-600">{ak.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Ticaret */}
          <LayersControl.Overlay checked={konuSlug === 'ticaret'} name="💰 Ticaret & Limanlar">
            <LayerGroup>
              {layersData.ticaretData?.ticaret_merkezleri?.map((tm: any, i: number) => (
                <Marker key={`tm-${i}`} position={[tm.lat, tm.lng]} icon={icons.trade}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-emerald-700 text-lg">{tm.ad}</h4>
                      <p className="text-sm"><b>Tip:</b> {tm.tip}</p>
                      <p className="text-xs mt-2 text-gray-600">{tm.ozellik}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Jeopolitik */}
          <LayersControl.Overlay checked={konuSlug === 'bolge-jeopolitik'} name="🏛️ Jeopolitik Noktalar">
            <LayerGroup>
              {layersData.jeopolitikData?.stratejik_noktalar?.map((sn: any, i: number) => (
                <Marker key={`sn-${i}`} position={[sn.lat, sn.lng]} icon={icons.gate}>
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
          <LayersControl.Overlay checked={konuSlug === 'jeolojik-yapi'} name="🧬 Masifler & Faylar">
            <LayerGroup>
              {layersData.jeolojikData?.masifler?.map((ms: any, i: number) => (
                <Marker key={`ms-${i}`} position={[ms.lat, ms.lng]} icon={icons.mountain('#78350f')}>
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
          <LayersControl.Overlay checked={konuSlug === 'kalkinma-projeleri'} name="🏗️ Bölgesel Projeler">
            <LayerGroup>
              {layersData.kalkinmaData?.projeler?.map((kp: any, i: number) => (
                <Marker key={`kp-${i}`} position={[kp.lat, kp.lng]} icon={icons.mine}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-red-700 text-lg">{kp.ad}</h4>
                      <p className="text-xs mt-2 text-gray-600">{kp.ozellik}</p>
                      <p className="text-[10px] mt-1 text-gray-400">Kapsam: {kp.iller.join(', ')}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Kıyı Tipleri */}
          <LayersControl.Overlay checked={konuSlug === 'kiyi-tipleri'} name="🌊 Kıyı Tipleri">
            <LayerGroup>
              {layersData.kiyiData?.kiyi_tipleri?.map((kt: any, i: number) => (
                <Marker key={`kt-${i}`} position={[kt.lat, kt.lng]} icon={icons.wave}>
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-bold text-cyan-700 text-lg">{kt.ad}</h4>
                      <p className="text-sm"><b>Konum:</b> {kt.ornek || kt.bolge}</p>
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
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Harita Rehberi</h4>
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

