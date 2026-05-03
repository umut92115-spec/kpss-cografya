# KPSS Coğrafya — Seviye Landing Page'leri & Makale Görevi

## Genel Bakış
3 adet seviye landing page'i ve 3 adet makale oluştur.  
Amaç: "KPSS lisans/önlisans/ortaöğretim coğrafya" sorgularında rank almak.  
Yeni altyapı kurma. Mevcut sisteme dokunma.

---

## BÖLÜM 1: HAZIRLIK LANDING PAGE'LERİ

### 1.1 Dosya Yapısı

```bash
mkdir -p src/app/hazirlik/[seviye]
touch src/app/hazirlik/page.tsx
touch src/app/hazirlik/[seviye]/page.tsx
```

---

### 1.2 Seviye Konfig Dosyası

`src/lib/hazirlikConfig.ts` dosyasını oluştur:

```typescript
export interface SeviyeConfig {
  slug: string;
  baslik: string;
  aciklama: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  h2: string;
  soruSayisi: number;
  sinav_suresi: string;
  sinav_periyot: string;
  hedef_kitle: string;
  favicon: string;
  renk: string;
  faqlar: { soru: string; cevap: string }[];
}

export const seviyeler: SeviyeConfig[] = [
  {
    slug: 'lisans',
    baslik: 'KPSS Lisans',
    aciklama: '4 yıllık lisans mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Lisans Coğrafya Konuları 2026 — Konu Anlatımı, Quiz ve Harita',
    seoDescription:
      'KPSS lisans coğrafya konuları ve soru dağılımı 2026. 18 soruyu tam yapmak için harita destekli konu anlatımı, çıkmış sorular ve interaktif quiz.',
    h1: 'KPSS Lisans Coğrafya',
    h2: '18 Soruda Tam Net — Harita ile Öğren, Quiz ile Test Et',
    soruSayisi: 18,
    sinav_suresi: '130 dakika',
    sinav_periyot: 'Her yıl',
    hedef_kitle: '4 yıllık üniversite mezunları',
    favicon: '🎓',
    renk: 'blue',
    faqlar: [
      {
        soru: 'KPSS lisans sınavında coğrafya kaç soru?',
        cevap:
          'KPSS lisans sınavının Genel Kültür bölümünde 18 coğrafya sorusu yer almaktadır. Her 4 yanlış 1 doğruyu götürdüğünden net hesabı iyi yapılmalıdır.',
      },
      {
        soru: 'KPSS lisans coğrafya konuları nelerdir?',
        cevap:
          'Türkiye\'nin fiziki coğrafyası (dağlar, ovalar, akarsular, göller), iklim ve bitki örtüsü, nüfus ve yerleşme, madenler ve enerji kaynakları, tarım, sanayi, ulaşım ve turizm.',
      },
      {
        soru: 'KPSS lisans coğrafyasında en çok hangi konudan soru çıkıyor?',
        cevap:
          'Fiziki coğrafya (dağlar, platolar, akarsular) 5-6 soru ile en ağırlıklı konudur. Nüfus ve yerleşme 3-4 soru, madenler ve enerji 2-3 soru ile ikinci sıradadır.',
      },
      {
        soru: 'KPSS lisans sınavı ne zaman yapılıyor?',
        cevap:
          'KPSS lisans sınavı her yıl yapılmaktadır. Sınav takvimi ÖSYM tarafından yılın başında açıklanır.',
      },
      {
        soru: 'Harita üzerinde coğrafya çalışmak KPSS\'de avantaj sağlar mı?',
        cevap:
          'Evet. KPSS coğrafya sorularının önemli bir kısmı konuma dayalıdır (hangi ilde, hangi bölgede vs.). Harita üzerinde çalışmak görsel hafızayı güçlendirerek bu tür soruları doğru çözme oranını artırır.',
      },
    ],
  },
  {
    slug: 'onlisans',
    baslik: 'KPSS Önlisans',
    aciklama: '2 yıllık önlisans mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Önlisans Coğrafya Konuları 2026 — 18 Soru, Harita, Quiz',
    seoDescription:
      'KPSS önlisans coğrafya konuları ve soru dağılımı 2026. Önlisans adayları için harita destekli konu anlatımı, çıkmış sorular ve interaktif testler.',
    h1: 'KPSS Önlisans Coğrafya',
    h2: '18 Soruyu Harita Üzerinde Çalış, Quiz ile Puan Al',
    soruSayisi: 18,
    sinav_suresi: '130 dakika',
    sinav_periyot: 'Çift yıllarda (2024, 2026...)',
    hedef_kitle: '2 yıllık önlisans mezunları',
    favicon: '📋',
    renk: 'green',
    faqlar: [
      {
        soru: 'KPSS önlisans sınavında coğrafya kaç soru?',
        cevap:
          'KPSS önlisans Genel Kültür testinde 18 coğrafya sorusu bulunmaktadır. Toplam 120 soruluk sınavda coğrafya önemli bir yer tutar.',
      },
      {
        soru: 'KPSS önlisans coğrafya konuları lisansla aynı mı?',
        cevap:
          'Büyük ölçüde aynıdır. Her iki sınavda da Türkiye\'nin fiziki coğrafyası, iklim, nüfus, madenler, tarım, sanayi ve ulaşım konuları yer almaktadır.',
      },
      {
        soru: 'KPSS önlisans sınavı kaç yılda bir yapılıyor?',
        cevap:
          'KPSS önlisans sınavı iki yılda bir, çift yıllarda (2024, 2026...) ÖSYM tarafından yapılmaktadır.',
      },
      {
        soru: 'Önlisans KPSS coğrafyasında harita soruları çıkıyor mu?',
        cevap:
          'Evet, konum ve bölge bilgisini ölçen harita tabanlı sorular çıkmaktadır. Harita üzerinde çalışmak bu soruları çözmede büyük avantaj sağlar.',
      },
      {
        soru: 'KPSS önlisans coğrafya için ne kadar süre çalışmalıyım?',
        cevap:
          'Günde 1 saat, 3-4 haftalık düzenli çalışma ile 18 sorudan 14-16 net yapılabilir. Harita üzerinde görsel çalışma ve quiz pratiği bu süreyi kısaltır.',
      },
    ],
  },
  {
    slug: 'ortaogretim',
    baslik: 'KPSS Ortaöğretim',
    aciklama: 'Lise ve ortaöğretim mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Ortaöğretim Coğrafya Konuları 2026 — Lise, Konu Anlatımı, Quiz',
    seoDescription:
      'KPSS ortaöğretim (lise) coğrafya konuları ve soru dağılımı 2026. Harita destekli konu anlatımı, çıkmış sorular çözümü ve interaktif testler.',
    h1: 'KPSS Ortaöğretim Coğrafya',
    h2: 'Lise Mezunları için 18 Soruda Tam Net Rehberi',
    soruSayisi: 18,
    sinav_suresi: '130 dakika',
    sinav_periyot: 'Çift yıllarda (2024, 2026...)',
    hedef_kitle: 'Lise ve ortaöğretim mezunları',
    favicon: '📚',
    renk: 'amber',
    faqlar: [
      {
        soru: 'KPSS ortaöğretim sınavında coğrafya kaç soru çıkıyor?',
        cevap:
          'KPSS ortaöğretim Genel Kültür bölümünde 18 coğrafya sorusu yer almaktadır. Lise mezunları da üniversite mezunları ile aynı coğrafya müfredatından sorumludur.',
      },
      {
        soru: 'KPSS lise coğrafya konuları nelerdir?',
        cevap:
          'Türkiye\'nin fiziki coğrafyası, iklim ve bitki örtüsü, nüfus ve yerleşme, madenler ve enerji, tarım ve hayvancılık, sanayi, ulaşım ve turizm.',
      },
      {
        soru: 'KPSS ortaöğretim sınavına üniversite mezunları da girebilir mi?',
        cevap:
          'Evet. Üniversite mezunları da KPSS ortaöğretim sınavına girebilmektedir. Bazı adaylar puan avantajı için bu sınavı tercih edebilir.',
      },
      {
        soru: 'KPSS ortaöğretim coğrafyasında harita soruları var mı?',
        cevap:
          'Evet, özellikle yer şekilleri, iklim bölgeleri ve ürün dağılışını gösteren harita soruları sıklıkla çıkmaktadır.',
      },
      {
        soru: 'KPSS ortaöğretim ile lisans coğrafya soruları farklı mı?',
        cevap:
          'Konu dağılımı büyük ölçüde aynıdır. Her iki sınavda da Türkiye coğrafyası ağırlıklı olarak sorulmaktadır. Soru zorluk düzeyi benzerdir.',
      },
    ],
  },
];

export function getSeviye(slug: string): SeviyeConfig | undefined {
  return seviyeler.find((s) => s.slug === slug);
}
```

---

### 1.3 Hub Sayfası — `/hazirlik/page.tsx`

```typescript
import Link from 'next/link';
import { Metadata } from 'next';
import { seviyeler } from '@/lib/hazirlikConfig';

export const metadata: Metadata = {
  title: 'KPSS Coğrafya Hazırlık — Lisans, Önlisans, Ortaöğretim',
  description:
    'Hangi KPSS seviyesine hazırlanıyorsun? Lisans, önlisans ve ortaöğretim için ayrı hazırlık rehberleri, konu anlatımları ve interaktif quizler.',
  alternates: {
    canonical: 'https://kpsscografya.com.tr/hazirlik',
  },
  openGraph: {
    title: 'KPSS Coğrafya Hazırlık — Lisans, Önlisans, Ortaöğretim',
    description: 'Seviyene göre KPSS coğrafya hazırlık rehberi.',
    url: 'https://kpsscografya.com.tr/hazirlik',
    siteName: 'kpsscografya.com.tr',
    locale: 'tr_TR',
    type: 'website',
    images: ['/og-default.jpg'],
  },
};

const renkler: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200 hover:border-blue-500 text-blue-700',
  green: 'bg-green-50 border-green-200 hover:border-green-500 text-green-700',
  amber: 'bg-amber-50 border-amber-200 hover:border-amber-500 text-amber-700',
};

export default function HazirlikPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Hangi Seviyeden Hazırlanıyorsun?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            KPSS coğrafya hazırlığı için seviyene özel konu anlatımı, soru dağılımı
            ve interaktif quiz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {seviyeler.map((s) => (
            <Link
              key={s.slug}
              href={`/hazirlik/${s.slug}`}
              className={`group block border-2 rounded-2xl p-8 transition-all duration-200 hover:shadow-lg ${renkler[s.renk]}`}
            >
              <div className="text-5xl mb-4">{s.favicon}</div>
              <h2 className="text-xl font-black mb-2">{s.baslik}</h2>
              <p className="text-sm opacity-80 mb-4">{s.aciklama}</p>
              <div className="text-sm font-bold">
                {s.soruSayisi} Coğrafya Sorusu →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 1.4 Dinamik Seviye Sayfası — `/hazirlik/[seviye]/page.tsx`

```typescript
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeviye, seviyeler } from '@/lib/hazirlikConfig';
import { getAllKonular } from '@/lib/getKonuData';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return seviyeler.map((s) => ({ seviye: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { seviye: string };
}): Promise<Metadata> {
  const s = getSeviye(params.seviye);
  if (!s) return {};

  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: {
      canonical: `https://kpsscografya.com.tr/hazirlik/${s.slug}`,
    },
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      url: `https://kpsscografya.com.tr/hazirlik/${s.slug}`,
      siteName: 'kpsscografya.com.tr',
      locale: 'tr_TR',
      type: 'article',
      images: ['/og-default.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: s.seoTitle,
      images: ['/og-default.jpg'],
    },
    other: {
      'geo.region': 'TR',
      language: 'Turkish',
    },
  };
}

// Soru dağılım tablosu verisi
const konuDagilim = [
  { konu: 'Fiziki Coğrafya (Dağlar, Ovalar, Akarsular)', soru: '5-6', oncelik: 'Kritik' },
  { konu: 'Nüfus ve Yerleşme', soru: '3-4', oncelik: 'Kritik' },
  { konu: 'Madenler ve Enerji Kaynakları', soru: '2-3', oncelik: 'Önemli' },
  { konu: 'İklim ve Bitki Örtüsü', soru: '2-3', oncelik: 'Önemli' },
  { konu: 'Tarım ve Hayvancılık', soru: '1-2', oncelik: 'Normal' },
  { konu: 'Sanayi, Ulaşım, Turizm', soru: '2-3', oncelik: 'Normal' },
];

const oncelikRenk: Record<string, string> = {
  Kritik: 'bg-red-100 text-red-700',
  Önemli: 'bg-amber-100 text-amber-700',
  Normal: 'bg-green-100 text-green-700',
};

export default function SeviyePage({ params }: { params: { seviye: string } }) {
  const s = getSeviye(params.seviye);
  if (!s) notFound();

  const konular = getAllKonular();

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD: FAQPage */}
      <JsonLd
        tip="FAQPage"
        veri={{
          mainEntity: s.faqlar.map((f) => ({
            '@type': 'Question',
            name: f.soru,
            acceptedAnswer: { '@type': 'Answer', text: f.cevap },
          })),
        }}
      />

      {/* JSON-LD: LearningResource */}
      <JsonLd
        tip="LearningResource"
        veri={{
          name: s.seoTitle,
          description: s.seoDescription,
          url: `https://kpsscografya.com.tr/hazirlik/${s.slug}`,
          educationalLevel: s.baslik,
          teaches: 'KPSS Coğrafya',
          inLanguage: 'tr',
          provider: {
            '@type': 'Organization',
            name: 'KPSS Coğrafya',
            url: 'https://kpsscografya.com.tr',
          },
        }}
      />

      {/* HERO */}
      <div className="bg-gray-900 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-8 text-gray-400">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">›</span>
            <Link href="/hazirlik" className="hover:text-white">Hazırlık</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{s.baslik}</span>
          </nav>

          <div className="text-5xl mb-6">{s.favicon}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {s.h1}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            {s.h2}
          </p>

          {/* Hızlı bilgi badge'leri */}
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              📝 {s.soruSayisi} Coğrafya Sorusu
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              ⏱️ {s.sinav_suresi}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              📅 {s.sinav_periyot}
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
              👤 {s.hedef_kitle}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* SORU DAĞILIM TABLOSU */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            {s.baslik} Coğrafya Soru Dağılımı
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-bold text-gray-700">Konu</th>
                  <th className="text-center p-4 font-bold text-gray-700">Soru Sayısı</th>
                  <th className="text-center p-4 font-bold text-gray-700">Öncelik</th>
                </tr>
              </thead>
              <tbody>
                {konuDagilim.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{row.konu}</td>
                    <td className="p-4 text-center font-bold text-gray-900">{row.soru}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${oncelikRenk[row.oncelik]}`}>
                        {row.oncelik}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="p-4 font-black text-gray-900">TOPLAM</td>
                  <td className="p-4 text-center font-black text-gray-900">{s.soruSayisi} soru</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* KONU KARTI IZGARASI */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Konuları Harita ile Öğren
          </h2>
          <p className="text-gray-600 mb-8">
            Her konu için harita destekli anlatım ve quiz.
            Tıkla, öğren, test et.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {konular.map((konu) => (
              <div key={konu.slug} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-400 transition-all">
                <div className="text-3xl mb-3">{konu.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{konu.baslik}</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Ortalama {konu.kpss_soru_sayisi_ort} soru
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/konu/${konu.slug}`}
                    className="flex-1 text-center bg-gray-50 text-gray-700 hover:bg-gray-100 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Konu Anlatımı
                  </Link>
                  <Link
                    href={`/harita/${konu.slug}`}
                    className="flex-1 text-center bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Harita
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HAZIRLIK STRATEJİSİ */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            {s.baslik} Coğrafya — 30 Günlük Hazırlık Planı
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-black text-gray-900 mb-2">1-10. Gün</h3>
              <p className="text-sm text-gray-600">
                Fiziki coğrafya + iklim. Her gün harita üzerinde tekrar.
                Dağ, ova, akarsu konumlarını ezberle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-black text-gray-900 mb-2">11-20. Gün</h3>
              <p className="text-sm text-gray-600">
                Nüfus, madenler, tarım. Her konudan 20 quiz sorusu çöz.
                Hatalı soruları tekrar et.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="font-black text-gray-900 mb-2">21-30. Gün</h3>
              <p className="text-sm text-gray-600">
                Sanayi, ulaşım, turizm + tam deneme. Zayıf konulara odaklan,
                harita üzerinde son tekrar.
              </p>
            </div>
          </div>
        </section>

        {/* QUIZ CTA */}
        <section className="mb-16">
          <div className="bg-orange-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-black mb-3">
              {s.baslik} Sınavına Hazır mısın?
            </h2>
            <p className="text-orange-100 mb-6">
              18 soruluk hızlı test ile hazırlık düzeyini ölç.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="bg-white text-orange-600 font-black px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Quiz Başlat →
              </Link>
              <Link
                href="/harita/yer-sekilleri"
                className="bg-orange-600 text-white font-black px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors border border-orange-400"
              >
                Haritada Çalış →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {s.faqlar.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-black text-gray-900 mb-3">{faq.soru}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.cevap}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DİĞER SEVİYELER */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Diğer KPSS Seviyeleri
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {seviyeler
              .filter((sv) => sv.slug !== s.slug)
              .map((sv) => (
                <Link
                  key={sv.slug}
                  href={`/hazirlik/${sv.slug}`}
                  className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-sm transition-all"
                >
                  <span className="text-3xl">{sv.favicon}</span>
                  <div>
                    <div className="font-black text-gray-900">{sv.baslik}</div>
                    <div className="text-sm text-gray-500">{sv.aciklama}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

      </div>
    </div>
  );
}
```

---

## BÖLÜM 2: MAKALE İÇERİKLERİ

### 2.1 getMakaleData.ts Dosyasını Güncelle

`src/lib/getMakaleData.ts` dosyasındaki `getAllMakaleler()` fonksiyonunu aşağıdaki makaleleri kapsayacak şekilde güncelle:

```typescript
export function getAllMakaleler(): Makale[] {
  return [
    {
      slug: 'kpss-cografya-calisma-taktikleri',
      baslik: 'KPSS Coğrafya Çalışma Taktikleri',
      aciklama: 'KPSS coğrafyada nasıl full yapılır? Akılda kalıcı taktikler.',
      guncelleme: '2025-01-10T00:00:00.000Z',
    },
    {
      slug: 'kpss-lisans-cografya-konulari-2026',
      baslik: 'KPSS Lisans Coğrafya Konuları 2026 — Soru Dağılımı ve Çalışma Planı',
      aciklama: 'KPSS lisans sınavındaki 18 coğrafya sorusu için güncel konu listesi, soru dağılımı tablosu ve 30 günlük hazırlık planı.',
      guncelleme: new Date().toISOString(),
    },
    {
      slug: 'kpss-onlisans-cografya-konulari-2026',
      baslik: 'KPSS Önlisans Coğrafya Konuları 2026 — Konu Listesi ve Hazırlık',
      aciklama: 'KPSS önlisans coğrafya konu dağılımı, en çok çıkan konular ve harita üzerinde etkili çalışma yöntemleri.',
      guncelleme: new Date().toISOString(),
    },
    {
      slug: 'kpss-ortaogretim-cografya-konulari-2026',
      baslik: 'KPSS Ortaöğretim Coğrafya Konuları 2026 — Lise Hazırlık Rehberi',
      aciklama: 'KPSS ortaöğretim (lise) coğrafya konuları, soru dağılımı ve harita destekli hazırlık stratejisi.',
      guncelleme: new Date().toISOString(),
    },
  ];
}
```

---

### 2.2 Makale İçerikleri

`getMakale()` fonksiyonunu genişlet. Her makale için `icerik` alanı ekle. Markdown destekli HTML string olabilir ya da makale sayfası doğrudan JSON'dan render edebilir.

**Makale: `kpss-lisans-cografya-konulari-2026`**

Makale içeriği (600-800 kelime, makale sayfasında render edilecek):

```
KPSS Lisans Coğrafya Konuları 2026

KPSS lisans sınavında Genel Kültür bölümünde 18 coğrafya sorusu çıkmaktadır.
Bu sorular Türkiye coğrafyasını merkeze alır ve doğru hazırlıkla tamamı
çözülebilir seviyededir.

2026 KPSS Lisans Coğrafya Konu Listesi:
- Türkiye'nin Coğrafi Konumu (2 soru)
- Yer Şekilleri: Dağlar, Platolar, Ovalar (3 soru)
- Akarsular ve Göller (2 soru)
- İklim ve Bitki Örtüsü (2 soru)
- Nüfus ve Yerleşme (3 soru)
- Madenler ve Enerji Kaynakları (2 soru)
- Tarım ve Hayvancılık (1 soru)
- Sanayi, Ulaşım, Turizm (3 soru)

En Kritik Konular:
Fiziki coğrafya (dağlar, akarsular) ve nüfus soruları toplam 18 sorunun
yarısından fazlasını oluşturmaktadır. Harita üzerinde çalışmak bu konularda
%40 daha fazla doğru yapılmasını sağlamaktadır.

Hazırlık Önerisi:
Harita üzerinde görsel çalışma yapın. Her il için temel bilgileri
(ana tarım ürünü, madeni, nüfus yoğunluğu) ezberleyin.
Günde 10-15 quiz sorusu çözün, hatalı olanları tekrar edin.

[Harita üzerinde çalışmaya başla →] [Quiz çöz →] [Konu anlatımı →]
```

**Makale: `kpss-onlisans-cografya-konulari-2026`**

```
KPSS Önlisans Coğrafya Konuları 2026

KPSS önlisans sınavı iki yılda bir, çift yıllarda yapılmaktadır.
Genel Kültür bölümündeki 18 coğrafya sorusu için doğru hazırlık şarttır.

Önlisans adaylarına özel not: Soru zorluk düzeyi lisans sınavıyla
benzerdir. Aynı kaynaklarla, aynı yoğunlukta çalışılmalıdır.

2026 KPSS Önlisans Coğrafya Konuları:
[Lisansla aynı liste + önlisans özelinde çıkmış soru analizi]

Harita Üzerinde Çalışmanın Önemi:
Önlisans sınavında son yıllarda harita tabanlı sorular artış göstermiştir.
Özellikle iklim bölgeleri, maden yatakları ve tarım ürünlerinin
dağılışını harita üzerinde bilmek kritiktir.

[Hazırlık rehberine git →] [Quiz →] [Harita →]
```

**Makale: `kpss-ortaogretim-cografya-konulari-2026`**

```
KPSS Ortaöğretim Coğrafya Konuları 2026

KPSS ortaöğretim (lise) sınavı, ortaöğretim ve ön lisans mezunlarının
birlikte girdiği bir sınavdır. Coğrafyadan 18 soru çıkmakta olup
hazırlık süreci lisansla aynı kapsamı gerektirmektedir.

Kimler Girebilir?
- Lise (ortaöğretim) mezunları
- Açık lise mezunları
- Üniversite mezunları da bu sınava girebilmektedir

Konu Listesi ve Soru Dağılımı:
[Konu tablosu]

Lise Mezunları için Strateji:
Coğrafya konuları lise müfredatının büyük kısmıyla örtüşür.
Ancak KPSS'de Türkiye coğrafyası çok daha ağırlıklıdır.
Harita üzerinde il bazlı çalışma yapılması önerilir.

[Hazırlık rehberine git →] [Quiz →] [Haritada göster →]
```

---

## BÖLÜM 3: SİTEMAP GÜNCELLEMESİ

`src/app/sitemap.ts` dosyasına şu URL'leri ekle:

```typescript
// Hazırlık hub
{ url: `${baseUrl}/hazirlik`, priority: 0.8, changeFrequency: 'monthly' },

// Seviye landing page'leri
{ url: `${baseUrl}/hazirlik/lisans`, priority: 0.9, changeFrequency: 'monthly' },
{ url: `${baseUrl}/hazirlik/onlisans`, priority: 0.9, changeFrequency: 'monthly' },
{ url: `${baseUrl}/hazirlik/ortaogretim`, priority: 0.9, changeFrequency: 'monthly' },

// Yeni makaleler
{ url: `${baseUrl}/makale/kpss-lisans-cografya-konulari-2026`, priority: 0.8, changeFrequency: 'monthly' },
{ url: `${baseUrl}/makale/kpss-onlisans-cografya-konulari-2026`, priority: 0.8, changeFrequency: 'monthly' },
{ url: `${baseUrl}/makale/kpss-ortaogretim-cografya-konulari-2026`, priority: 0.8, changeFrequency: 'monthly' },
```

---

## BÖLÜM 4: NAVİGASYON

Ana navigasyona "Hazırlık" linki ekle. Mevcut nav bileşenini bul
(`src/components/Header.tsx` veya `Navbar.tsx` gibi) ve şu linki ekle:

```tsx
<Link href="/hazirlik">Hazırlık</Link>
```

Dropdown olarak da yapılabilir:
```
Hazırlık ▾
  ├── Lisans
  ├── Önlisans
  └── Ortaöğretim
```

---

## BÖLÜM 5: DEPLOYMENT

```bash
# Çalıştır ve test et
npm run build

# Hata yoksa push et
git add .
git commit -m "feat: Add seviye landing pages (/hazirlik/[seviye]) and 3 articles for lisans/onlisans/ortaogretim SEO"
git push origin main
```

---

## BEKLENEN SONUÇ

Tamamlandığında şu URL'ler çalışmalı:
- ✓ `/hazirlik` — Hub sayfası (3 seviye seçimi)
- ✓ `/hazirlik/lisans` — Lisans landing
- ✓ `/hazirlik/onlisans` — Önlisans landing
- ✓ `/hazirlik/ortaogretim` — Ortaöğretim landing
- ✓ `/makale/kpss-lisans-cografya-konulari-2026`
- ✓ `/makale/kpss-onlisans-cografya-konulari-2026`
- ✓ `/makale/kpss-ortaogretim-cografya-konulari-2026`
- ✓ Sitemap'te 7 yeni URL
- ✓ Navigasyonda "Hazırlık" linki

## TARGET KEYWORD'LER (Rank Beklentisi)

| Keyword | Rank Beklentisi | Süre |
|---------|----------------|------|
| KPSS önlisans coğrafya konuları | Top 5 | 2-4 hafta |
| KPSS ortaöğretim coğrafya konuları | Top 5 | 2-4 hafta |
| KPSS lisans coğrafya konuları 2026 | Top 10 | 3-6 hafta |
| KPSS önlisans coğrafya harita | Top 3 | 1-2 hafta |
| KPSS coğrafya 18 soru nasıl çözülür | Featured Snippet | 2-4 hafta |
