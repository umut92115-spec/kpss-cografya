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
          'Türkiye\'nin fiziki coğrafyası (dağlar, ovalar, akarsular, göller), iklim ve bitki örtüsü, nüfus ve yerleşme, madenler ve energy kaynakları, tarım, sanayi, ulaşım ve turizm.',
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
