export interface Makale {
  slug: string;
  baslik: string;
  aciklama: string;
  guncelleme: string;
  icerik?: string;
}

export function getAllMakaleler(): Makale[] {
  return [
    {
      slug: 'kpss-cografya-calisma-taktikleri',
      baslik: 'KPSS Coğrafya Çalışma Taktikleri',
      aciklama: 'KPSS coğrafyada nasıl full yapılır? Akılda kalıcı taktikler.',
      guncelleme: '2025-01-10T00:00:00.000Z',
      icerik: `
      KPSS coğrafya dersi, 18 soruluk hacmiyle Genel Kültür testinin belirleyici alanlarından biridir.
      Full yapmak için şu taktikleri uygulayabilirsiniz:
      1. Görsel Hafızayı Kullanın: Harita üzerinde çalışmak, teorik bilgiyi mekansal veriyle birleştirir.
      2. Kavram Haritaları Çıkarın: Konular arası bağlantıları kurmak (örneğin iklim-bitki örtüsü-toprak tipi) ezberi azaltır.
      3. Güncel Verileri Takip Edin: TÜİK nüfus ve tarım verileri her yıl güncellenir.
      4. Quiz Pratiği Yapın: Konu bitiminde en az 2 test çözerek bilgiyi pekiştirin.
      `
    },
    {
      slug: 'kpss-lisans-cografya-konulari-2026',
      baslik: 'KPSS Lisans Coğrafya Konuları 2026 — Soru Dağılımı ve Çalışma Planı',
      aciklama: 'KPSS lisans sınavındaki 18 coğrafya sorusu için güncel konu listesi, soru dağılımı tablosu ve 500+ soruluk hazırlık planı.',
      guncelleme: new Date().toISOString(),
      icerik: `
### KPSS Lisans Coğrafya Konuları 2026

KPSS lisans sınavında Genel Kültür bölümünde 18 coğrafya sorusu çıkmaktadır. Bu sorular Türkiye coğrafyasını merkeze alır ve doğru hazırlıkla tamamı çözülebilir seviyededir. Sitemizdeki **500+ özgün soru** ile tüm bu konuları en detaylı şekilde test edebilirsiniz.

#### 2026 KPSS Lisans Coğrafya Konu Listesi:
- **Türkiye'nin Coğrafi Konumu:** (2 soru)
- **Yer Şekilleri:** Dağlar, Platolar, Ovalar (3 soru)
- **Akarsular ve Göller:** (2 soru)
- **İklim ve Bitki Örtüsü:** (2 soru)
- **Nüfus ve Yerleşme:** (3 soru)
- **Madenler ve Enerji Kaynakları:** (2 soru)
- **Tarım ve Hayvancılık:** (1 soru)
- **Sanayi, Ulaşım, Turizm:** (3 soru)

#### En Kritik Konular:
Fiziki coğrafya (dağlar, akarsular) ve nüfus soruları toplam 18 sorunun yarısından fazlasını oluşturmaktadır. Harita üzerinde çalışmak bu konularda %40 daha fazla doğru yapılmasını sağlamaktadır.

#### Hazırlık Önerisi:
Harita üzerinde görsel çalışma yapın. Her il için temel bilgileri (ana tarım ürünü, madeni, nüfus yoğunluğu) ezberleyin. Sitemizdeki **500+ soruluk dev bankayı** kullanarak her gün 15-20 soru çözün, hatalı olanları tekrar edin.
      `
    },
    {
      slug: 'kpss-onlisans-cografya-konulari-2026',
      baslik: 'KPSS Önlisans Coğrafya Konuları 2026 — Konu Listesi ve Hazırlık',
      aciklama: 'KPSS önlisans coğrafya konu dağılımı, en çok çıkan konular ve 500+ soru ile etkili çalışma yöntemleri.',
      guncelleme: new Date().toISOString(),
      icerik: `
### KPSS Önlisans Coğrafya Konuları 2026

KPSS önlisans sınavı iki yılda bir, çift yıllarda yapılmaktadır. Genel Kültür bölümündeki 18 coğrafya sorusu için doğru hazırlık şarttır. Sitemizde yer alan **500'den fazla coğrafya sorusu**, önlisans adaylarının tüm ihtiyacını karşılayacak seviyededir.

**Önlisans adaylarına özel not:** Soru zorluk düzeyi lisans sınavıyla benzerdir. Aynı kaynaklarla, aynı yoğunlukta çalışılmalıdır.

#### 2026 KPSS Önlisans Coğrafya Konuları:
Lisans müfredatı ile paralel bir dağılım izlenmektedir. Türkiye'nin fiziki yapısı, iklimi ve beşeri ekonomik özellikleri ana başlıklardır.

#### Harita Üzerinde Çalışmanın Önemi:
Önlisans sınavında son yıllarda harita tabanlı sorular artış göstermiştir. Sitemizdeki haritalı quizler ve **500+ soruluk banka** ile özellikle iklim bölgeleri, maden yatakları ve tarım ürünlerinin dağılışını görsel olarak öğrenebilirsiniz.
      `
    },
    {
      slug: 'kpss-ortaogretim-cografya-konulari-2026',
      baslik: 'KPSS Ortaöğretim Coğrafya Konuları 2026 — Lise Hazırlık Rehberi',
      aciklama: 'KPSS ortaöğretim (lise) coğrafya konuları, soru dağılımı ve 500+ soruluk soru bankası desteği.',
      guncelleme: new Date().toISOString(),
      icerik: `
### KPSS Ortaöğretim Coğrafya Konuları 2026

KPSS ortaöğretim (lise) sınavı, ortaöğretim ve ön lisans mezunlarının birlikte girdiği bir sınavdır. Coğrafyadan 18 soru çıkmakta olup hazırlık süreci lisansla aynı kapsamı gerektirmektedir. Sitemizdeki **500+ soru**, lise mezunları için en güncel ve kapsamlı kaynaktır.

#### Kimler Girebilir?
- Lise (ortaöğretim) mezunları
- Açık lise mezunları
- Üniversite mezunları da bu sınava girebilmektedir

#### Konu Listesi ve Soru Dağılımı:
Türkiye'nin fiziki, beşeri ve ekonomik coğrafyası dengeli bir şekilde dağılmaktadır. Tüm bu konulara ait **500+ soru bankamız** aktiftir.

#### Lise Mezunları için Strateji:
Coğrafya konuları lise müfredatının büyük kısmıyla örtüşür. Ancak KPSS'de Türkiye coğrafyası çok daha ağırlıklıdır. Harita üzerinde il bazlı çalışma yapılması ve sitemizdeki **500+ soru ile bol pratik yapılması** önerilir.
      `
    },
  ];
}

export function getMakale(slug: string): Makale | undefined {
  return getAllMakaleler().find((m) => m.slug === slug);
}
