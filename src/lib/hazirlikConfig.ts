export interface SeviyeConfig {
  slug: string;
  baslik: string;
  aciklama: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  h2: string;
  soruSayisi: number;
  bankaSoruSayisi: number;
  sinav_suresi: string;
  sinav_periyot: string;
  hedef_kitle: string;
  favicon: string;
  renk: string;
  faqlar: { soru: string; cevap: string }[];
  makale: string;
  konuDagilim: { konu: string; soru: string; oncelik: string }[];
}

export const seviyeler: SeviyeConfig[] = [
  {
    slug: 'lisans',
    baslik: 'KPSS Lisans',
    aciklama: '4 yıllık lisans mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Lisans Coğrafya Konuları 2026 — Konu Anlatımı, Quiz ve Harita',
    seoDescription:
      'KPSS lisans coğrafya konuları ve soru dağılımı 2026. 500+ soru bankası and harita destekli konu anlatımı ile 18 soruyu tam yapın.',
    h1: 'KPSS Lisans Coğrafya',
    h2: '500+ Soru Bankası — 18 Soruda Tam Net Hedefi',
    soruSayisi: 18,
    bankaSoruSayisi: 500,
    sinav_suresi: '130 dakika',
    sinav_periyot: 'Her yıl',
    hedef_kitle: '4 yıllık üniversite mezunları',
    favicon: '🎓',
    renk: 'blue',
    konuDagilim: [
      { konu: "Türkiye'nin Coğrafi Konumu", soru: '1-2', oncelik: 'Normal' },
      { konu: "Türkiye'nin Yer Şekilleri ve Özellikleri", soru: '2-3', oncelik: 'Kritik' },
      { konu: "Türkiye'nin İklimi ve Bitki Örtüsü", soru: '2-3', oncelik: 'Önemli' },
      { konu: "Türkiye'de Nüfus ve Yerleşme", soru: '1-2', oncelik: 'Önemli' },
      { konu: "Türkiye'nin Ekonomik Faaliyetleri", soru: '4-5', oncelik: 'Kritik' },
      { konu: "Türkiye'nin Beşeri ve Bölgesel Coğrafyası", soru: '2-3', oncelik: 'Önemli' },
      { konu: "Çevre ve Doğal Afetler", soru: '1-2', oncelik: 'Normal' },
    ],
    faqlar: [
      {
        soru: 'KPSS lisans sınavında coğrafya kaç soru?',
        cevap:
          'KPSS lisans sınavının Genel Kültür bölümünde 18 coğrafya sorusu yer almaktadır. Sitemizdeki 500+ özgün soru ile bu 18 soruyu tam yapmanız hedeflenir.',
      },
      {
        soru: 'KPSS lisans coğrafya konuları nelerdir?',
        cevap:
          'Türkiye\'nin fiziki coğrafyası (dağlar, ovalar, akarsular, göller), iklim ve bitki örtüsü, nüfus and yerleşme, madenler and energy kaynakları, tarım, sanayi, ulaşım and turizm.',
      },
      {
        soru: 'KPSS lisans coğrafyasında en çok hangi konudan soru çıkıyor?',
        cevap:
          'Fiziki coğrafya (dağlar, platolar, akarsular) 5-6 soru ile en ağırlıklı konudur. Nüfus and yerleşme 3-4 soru, madenler and enerji 2-3 soru ile ikinci sıradadır.',
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
    makale: `
KPSS Lisans Coğrafya sınavı, Genel Kültür testinin en stratejik bölümlerinden biridir. 18 sorudan oluşan bu bölüm, doğru bir çalışma yöntemiyle adaylara ciddi bir puan avantajı sağlar. Peki, KPSS lisans coğrafyasında nasıl başarılı olunur? İşte adım adım başarı rehberi.

### 1. Fiziki Coğrafyayı Temel Taşı Yapın
KPSS coğrafya sorularının yaklaşık %30-35'i Türkiye'nin fiziki özelliklerinden gelir. Dağlar, platolar, ovalar ve özellikle akarsular-göller konusu her yıl mutlaka karşımıza çıkar. Bu konuları sadece ezberlemek yerine, oluşum mantığını (orojenez, epirojenez, volkanizma gibi) kavramak soruları daha hızlı çözmenizi sağlar. Fiziki coğrafyada başarılı olmanın anahtarı ise harita kullanmaktır. Sitemizdeki interaktif haritalar üzerinden dağların uzanış yönlerini ve akarsu havzalarını görselleştirerek çalışmak, sınavda zihninizde bir harita belirmesini sağlayacaktır.

### 2. Beşeri ve Ekonomik Coğrafyada Güncel Veri Takibi
Nüfus, tarım, hayvancılık, madenler ve sanayi konuları coğrafyanın "canlı" tarafıdır. Bu bölümlerde TÜİK tarafından açıklanan en güncel veriler (nüfus artış hızı, en çok üretilen tarım ürünü, en çok çıkarılan maden vb.) hayati önem taşır. KPSS Lisans sınavında ÖSYM, genellikle bir önceki yılın son verilerini temel alır. Sitemizde yer alan 500+ soru bankası, bu güncel veriler ışığında sürekli güncellenmektedir. Tarım ürünlerinin yoğunlaştığı illeri ve sanayi tesislerinin konum nedenlerini bilmek sizi rakiplerinizin önüne geçirir.

### 3. Harita Okuryazarlığı: Olmazsa Olmaz
ÖSYM son yıllarda "haritada işaretli yerlerden hangisinde..." şeklinde başlayan soru tiplerini artırmıştır. Bu soruları çözebilmek için Türkiye'nin bölgelerini, bölümlerini ve bu bölümlerin karakteristik özelliklerini harita üzerinde ayırt edebilmeniz gerekir. Örneğin, Menteşe Yöresi'nin dağlık olduğunu, Ergene Havzası'nin yer şekillerinin sade olduğunu harita üzerinde görmeden anlamak zordur. Harita üzerinde çalışma yapmak, coğrafyayı bir ezber dersi olmaktan çıkarıp bir gözlem dersi haline getirir.

### 4. Quiz ve Soru Bankası Pratiği
Teorik bilgiyi soru üzerinde uygulamadığınız sürece kalıcılık sağlanamaz. KPSS hazırlığında her konu bitiminde en az 50-60 soru çözmek idealdir. Bizim platformumuzda yer alan 500'den fazla soru, tam da bu ihtiyaca yönelik tasarlanmıştır. Çözdüğünüz sorularda yaptığınız hataları analiz etmek, konunun hangi detayını kaçırdığınızı gösterir. Özellikle madenler ve enerji kaynakları gibi "bilgi" odaklı konularda bol soru çözmek, seçenek eleme yeteneğinizi geliştirir.

### 5. Sınav Stratejisi ve Zaman Yönetimi
Coğrafya soruları genellikle Genel Kültür testinin sonunda (veya tarih ve vatandaşlık arasında) yer alır. Sorular net bilgiye dayalı olduğu için genellikle hızlı çözülür. Ancak dikkat gerektiren öncüllü sorular (I, II, III şeklinde) zamanınızı alabilir. Deneme çözerken coğrafyaya ayırdığınız süreyi optimize etmek, tarih gibi daha uzun yorum gerektiren bölümlere vakit kalmasını sağlar.

Sonuç olarak, KPSS Lisans Coğrafya sınavı na 18'de 18 yapmak imkansız değildir. Fiziki coğrafyayı harita ile desteklemek, ekonomik verileri güncel takip etmek and 500+ soruluk bankamızla düzenli pratik yapmak başarının kapısını aralayacaktır. Unutmayın, coğrafya bir Türkiye haritası üzerinde yaşama sanatıdır!
    `,
  },
  {
    slug: 'onlisans',
    baslik: 'KPSS Önlisans',
    aciklama: '2 yıllık önlisans mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Önlisans Coğrafya Konuları 2026 — 500+ Soru Bankası, Harita, Quiz',
    seoDescription:
      'KPSS önlisans coğrafya konuları 2026. 500+ soru bankası, harita destekli konu anlatımı and çıkmış sorular ile sınava tam hazırlanın.',
    h1: 'KPSS Önlisans Coğrafya',
    h2: '500+ Özgün Soru ile 18 Soruluk Sınava Hazırlan',
    soruSayisi: 18,
    bankaSoruSayisi: 500,
    sinav_suresi: '130 dakika',
    sinav_periyot: 'Çift yıllarda (2024, 2026...)',
    hedef_kitle: '2 yıllık önlisans mezunları',
    favicon: '📋',
    renk: 'green',
    konuDagilim: [
      { konu: "Türkiye'nin Coğrafi Konumu ve Özellikleri", soru: '3-4', oncelik: 'Kritik' },
      { konu: "Türkiye'nin Fiziki Özellikleri", soru: '3-4', oncelik: 'Kritik' },
      { konu: "Türkiye'de Nüfus ve Yerleşme", soru: '2-3', oncelik: 'Önemli' },
      { konu: "Tarım ve Hayvancılık", soru: '2', oncelik: 'Normal' },
      { konu: "Madenler ve Enerji Kaynakları", soru: '1-2', oncelik: 'Normal' },
      { konu: "Ulaşım ve Ticaret", soru: '1-2', oncelik: 'Normal' },
    ],
    faqlar: [
      {
        soru: 'KPSS önlisans sınavında coğrafya kaç soru?',
        cevap:
          'KPSS önlisans Genel Kültür testinde 18 coğrafya sorusu bulunmaktadır. Toplam 120 soruluk sınavda coğrafya önemli bir yer tutar.',
      },
      {
        soru: 'KPSS önlisans coğrafya konuları lisansla aynı mı?',
        cevap:
          'Büyük ölçüde aynıdır. Her iki sınavda da Türkiye\'nin fiziki coğrafyası, iklim, nüfus, madenler, tarım, sanayi and ulaşım konuları yer almaktadır.',
      },
      {
        soru: 'KPSS önlisans sınavı kaç yılda bir yapılıyor?',
        cevap:
          'KPSS önlisans sınavı iki yılda bir, çift yıllarda (2024, 2026...) ÖSYM tarafından yapılmaktadır.',
      },
      {
        soru: 'Önlisans KPSS coğrafyasında harita soruları çıkıyor mu?',
        cevap:
          'Evet, konum and bölge bilgisini ölçen harita tabanlı sorular çıkmaktadır. Harita üzerinde çalışmak bu soruları çözmede büyük avantaj sağlar.',
      },
      {
        soru: 'KPSS önlisans coğrafya için ne kadar süre çalışmalıyım?',
        cevap:
          'Günde 1 saat, 3-4 haftalık düzenli çalışma ile 18 sorudan 14-16 net yapılabilir. Sitemizdeki 500+ soru ile pratik yapmak bu süreyi kısaltır.',
      },
    ],
    makale: `
KPSS Önlisans sınavı, her iki yılda bir yapılan ve milyonlarca adayın memuriyet hayalini gerçekleştirmek için ter döktüğü kritik bir sınavdır. Bu sınavın Genel Kültür testinde yer alan 18 coğrafya sorusu, genellikle adayların "full" yapmaya en yakın olduğu bölümdür. Peki, önlisans coğrafya hazırlığında nelere dikkat edilmelidir?

### Önlisans ve Lisans Arasındaki Fark Nedir?
Pek çok aday, önlisans coğrafya sorularının lisans sınavına göre çok daha kolay olacağını düşünür. Ancak son yıllardaki sınav analizleri göstermektedir ki, konu kapsamı and soru tarzı bakımından önlisans and lisans sınavları birbirine oldukça yakındır. ÖSYM, önlisans düzeyinde de harita bilgisini, güncel ekonomik verileri and Türkiye'nin bölgesel özelliklerini detaylı bir şekilde sormaktadır. Bu nedenle hazırlık sürecinde "basit" kaynaklar yerine, kapsamlı and harita destekli materyaller tercih edilmelidir.

### Fiziki Coğrafyada "Neden-Sonuç" İlişkisi
Önlisans sınavında yer şekilleri, iklim and bitki örtüsü gibi konular temel puan kaynağıdır. Ancak sadece "en yüksek dağ Ağrı'dır" gibi tekil bilgileri ezberlemek yeterli olmayabilir. Sorular artık daha çok mantık yürütmeye dayalıdır. "Neden Doğu Karadeniz'de falez çoktur?" veya "Neden Ege'de kıyı ile iç kesim arası ulaşım kolaydır?" gibi soruların cevabını bilmek, fiziki coğrafyanın temelini kavramak anlamına gelir. Sitemizdeki konu anlatımları, bu mantık zincirini kurmanıza yardımcı olacak şekilde yapılandırılmıştır.

### Ekonomik Coğrafya ve Soru Bankasının Gücü
Önlisans adayları için tarım, hayvancılık, madenler and enerji kaynakları konuları bazen kafa karıştırıcı olabilir. Hangi maden nerede çıkarılır, hangi ürün nerede birinci sıradadır gibi bilgileri akılda tutmanın en iyi yolu **bol soru çözmektir**. Platformumuzda yer alan **500'den fazla özgün soru**, önlisans müfredatındaki her bir detayı tarayarak bilginizi taze tutmanızı sağlar. Özellikle madenler konusunda hata yaptıkça, doğrusunu öğrenmek kalıcı hafıza oluşturur.

### Harita Bilgisi ve Görsel Öğrenme
Coğrafya dersinde harita, adeta bir sınav kağıdı gibidir. Harita üzerinde Türkiye'nin göllerini, akarsularını, iklim tiplerini and nüfusun yoğunlaştığı yerleri görebilen bir aday, soruların %80'ini kolaylıkla çözer. Önlisans sınavında sıklıkla karşımıza çıkan "Hangi merkezde tarımsal nüfus yoğunluğu fazladır?" tarzı sorular, doğrudan Türkiye'nin yer şekilleri haritasını gözünde canlandırabilme yeteneği ile ilgilidir. Sitemizdeki interaktif haritalar bu yeteneği geliştirmek için tasarlanmıştır.

### Hazırlık Planı ve İstikrar
KPSS Önlisans sınavına hazırlanan adaylar genellikle çalışan veya okuluna devam eden kişilerden oluşur. Bu yoğun tempoda coğrafyaya günde 45-60 dakika ayırmak yeterlidir. İlk haftalarda fiziki coğrafya temeli atılmalı, sonrasında ise beşeri and ekonomik konulara geçilmelidir. Her konu sonrası mutlaka 20 soruluk bir quiz çözülmelidir. 500+ soruluk bankamız, hazırlık sürecinizin her aşamasında yanınızda olacak şekilde kategorize edilmiştir.

Özetle, KPSS Önlisans Coğrafya sınavı, doğru strateji ile 18 soruda 18 net yapılabilecek bir alandır. Harita bilgisini ön planda tutan, güncel verileri (TÜİK) takip eden and sitemizdeki 500+ soru bankası ile antrenman yapan adaylar, sınav günü büyük bir özgüvenle soruları çözecektir. Başarı, düzenli çalışma and doğru kaynak kullanımında gizlidir!
    `,
  },
  {
    slug: 'ortaogretim',
    baslik: 'KPSS Ortaöğretim',
    aciklama: 'Lise ve ortaöğretim mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Ortaöğretim Coğrafya Konuları 2026 — 500+ Soru, Konu Anlatımı',
    seoDescription:
      'KPSS ortaöğretim coğrafya konuları 2026. 500+ soru bankası, harita destekli anlatım and lise mezunları için özel hazırlık rehberi.',
    h1: 'KPSS Ortaöğretim Coğrafya',
    h2: 'Lise Mezunları için 500+ Soru ile Tam Hazırlık',
    soruSayisi: 18,
    bankaSoruSayisi: 500,
    sinav_suresi: '130 dakika',
    sinav_periyot: 'Çift yıllarda (2024, 2026...)',
    hedef_kitle: 'Lise ve ortaöğretim mezunları',
    favicon: '📚',
    renk: 'amber',
    konuDagilim: [
      { konu: "Türkiye'nin Coğrafi Konumu", soru: '1', oncelik: 'Normal' },
      { konu: "Türkiye'nin İklimi ve Bitki Örtüsü", soru: '2', oncelik: 'Önemli' },
      { konu: "Türkiye'nin Fiziki Özellikleri", soru: '4', oncelik: 'Kritik' },
      { konu: "Türkiye'nin Beşeri Özellikleri", soru: '3', oncelik: 'Kritik' },
      { konu: "Türkiye'nin Ekonomik Özellikleri", soru: '8', oncelik: 'Kritik' },
    ],
    faqlar: [
      {
        soru: 'KPSS ortaöğretim sınavında coğrafya kaç soru çıkıyor?',
        cevap:
          'KPSS ortaöğretim Genel Kültür bölümünde 18 coğrafya sorusu yer almaktadır. Sitemizdeki 500+ soru bankası tüm müfredatı kapsamaktadır.',
      },
      {
        soru: 'KPSS lise coğrafya konuları nelerdir?',
        cevap:
          'Türkiye\'nin fiziki coğrafyası, iklim and bitki örtüsü, nüfus and yerleşme, madenler and enerji, tarım and hayvancılık, sanayi, ulaşım and turizm.',
      },
      {
        soru: 'KPSS ortaöğretim sınavına üniversite mezunları da girebilir mi?',
        cevap:
          'Evet. Üniversite mezunları da KPSS ortaöğretim sınavına girebilmektedir. Bazı adaylar puan avantajı için bu sınavı tercih edebilir.',
      },
      {
        soru: 'KPSS ortaöğretim coğrafyasında harita soruları var mı?',
        cevap:
          'Evet, özellikle yer şekilleri, iklim bölgeleri and ürün dağılışını gösteren harita soruları sıklıkla çıkmaktadır.',
      },
      {
        soru: 'KPSS ortaöğretim ile lisans coğrafya soruları farklı mı?',
        cevap:
          'Konu dağılımı büyük ölçüde aynıdır. Her iki sınavda da Türkiye coğrafyası ağırlıklı olarak sorulmaktadır. Soru zorluk düzeyi benzerdir.',
      },
    ],
    makale: `
Lise mezunları ve liseden mezun olabilecek durumda olan adaylar için düzenlenen KPSS Ortaöğretim sınavı, kamu personeli olma yolundaki en önemli kapılardan biridir. Bu sınavın 60 soruluk Genel Kültür testinde yer alan 18 coğrafya sorusu, adayların puanlarını en çok yükselten and doğru çalışıldığında hata payı en düşük olan bölümdür. Peki, lise mezunları KPSS coğrafyaya nasıl çalışmalı?

### Müfredat Kapsamı ve Soru Dağılımı
KPSS Ortaöğretim coğrafya müfredatı, aslında lise yıllarından aşina olduğunuz Türkiye Coğrafyası konularını kapsar. Ancak sınavda sorular daha çok "bilgi" and "uygulama" düzeyinde gelir. Türkiye'nin konumu, yer şekilleri, iklimi, nüfusu and ekonomik faaliyetleri (tarım, hayvancılık, madencilik, sanayi, ulaşım, turizm) ana başlıkları oluşturur. Özellikle Türkiye'nin yer şekilleri and nüfus özellikleri her yıl en az 3-4 sorunun geldiği kritik alanlardır.

### Ezberden Kaçın, Mantığı Anla
Coğrafya dersi genellikle "ezber dersi" olarak görülür. Oysa Türkiye'nin fiziki yapısını anlayan bir aday, beşeri and ekonomik olayları da otomatik olarak çözer. Örneğin; bir yerin dağlık olması, orada ulaşımın zor, nüfusun az, tarım alanlarının dar and hayvancılığın (genellikle büyükbaş veya arıcılık) ön planda olacağı anlamına gelir. Bu mantığı kurduğunuzda, sınavda karşınıza çıkan "X yöresinde neden nüfus seyrektir?" sorusunun cevabını ezberlemeden, yer şekilleri bilgisiyle bulabilirsiniz. Sitemizdeki konu özetleri, bu bağlantıları kurmanız için özel olarak hazırlanmıştır.

### Harita Çalışması Başarının Yarısıdır
KPSS Ortaöğretim sınavında ÖSYM mutlaka harita üzerinden soru sorar. Haritada taranmış bölgelerin hangi iklim tipine sahip olduğunu, hangi madenin orada yoğunlaştığını bilmek hayati önemdedir. Sitemizde yer alan interaktif harita araçlarını kullanarak Türkiye'nin dağlarını, ovalarını and sanayi merkezlerini görselleştirebilirsiniz. Unutmayın, bir kere harita üzerinde gördüğünüz bir bilgiyi unutmanız, kitaptan okuduğunuz bir bilgiyi unutmanızdan çok daha zordur.

### 500+ Soru Bankası ile Pratik Yapın
Konuyu öğrenmek kadar, o konudan ne tür sorular gelebileceğini görmek de önemlidir. Platformumuzda ortaöğretim adayları için özel olarak seçilmiş and hazırlanmış **500'den fazla soru** bulunmaktadır. Bu soruları çözerken sadece doğru cevaba odaklanmak yerine, yanlış seçeneklerin neden yanlış olduğunu da anlamaya çalışmak sizi geliştirecektir. Özellikle madenler and tarım ürünleri gibi çok fazla detayın olduğu konularda bol soru çözmek, bilgilerin zihninize "çivilenmesini" sağlar.

### Güncel Bilgilere Dikkat!
KPSS Ortaöğretim sınavında her yıl 1-2 soru güncel verilerden gelir. Türkiye'nin en büyük gölü mü değişti (Van Gölü vs. barajlar), en son açılan tünel hangisi, hangi tarım ürününde dünya birincisiyiz? Bu gibi sorular için sitemizdeki "Kpss Notu" kutucuklarını and güncellenen içeriklerimizi takip etmeniz yeterlidir. TÜİK verilerini sizin yerinize süzüp en sade haliyle sunuyoruz.

Sonuç olarak; KPSS Ortaöğretim Coğrafya dersi, lise mezunları için büyük bir fırsat alanıdır. Harita destekli çalışarak, konunun mantığını kavrayarak and 500+ soruluk bankamızla düzenli test çözerek bu 18 soruyu fire vermeden çözebilirsiniz. Unutmayın, düzenli çalışan and doğru kaynağı kullanan aday her zaman bir adım öndedir. Başarılar dileriz!
    `,
  },
  {
    slug: 'tyt',
    baslik: 'YKS TYT Coğrafya',
    aciklama: 'Tüm YKS adayları için temel coğrafya konuları ve harita bilgisi',
    seoTitle: 'TYT Coğrafya Konuları 2026 — Konu Özetleri, PDF ve Soru Bankası',
    seoDescription:
      'TYT coğrafya konuları ve soru dağılımı 2026. 300+ soru bankası, harita becerileri ve temel kavramlar ile 5 soruda 5 net yapın.',
    h1: 'YKS TYT Coğrafya Hazırlık',
    h2: 'Temel Bilgi ve Yorum Gücüyle 5\'te 5 Hedefi',
    soruSayisi: 5,
    bankaSoruSayisi: 300,
    sinav_suresi: '165 dakika',
    sinav_periyot: 'Her yıl (Haziran)',
    hedef_kitle: 'Tüm üniversite adayları',
    favicon: '🗺️',
    renk: 'indigo',
    konuDagilim: [
      { konu: 'Doğa ve İnsan / Coğrafya Bilimi', soru: '1', oncelik: 'Normal' },
      { konu: 'Harita Bilgisi ve Uygulamaları', soru: '1', oncelik: 'Kritik' },
      { konu: 'İklim Bilgisi (Sıcaklık, Basınç, Nem)', soru: '1', oncelik: 'Kritik' },
      { konu: 'Yer Şekilleri (İç ve Dış Kuvvetler)', soru: '1', oncelik: 'Önemli' },
      { konu: 'Nüfus, Yerleşme ve Göç', soru: '1', oncelik: 'Kritik' },
      { konu: 'Bölgeler ve Doğal Afetler', soru: '1', oncelik: 'Önemli' },
    ],
    faqlar: [
      {
        soru: 'TYT coğrafya sınavda kaç soru?',
        cevap: 'TYT sınavında Sosyal Bilimler testi içerisinde 5 adet coğrafya sorusu yer almaktadır.',
      },
      {
        soru: 'TYT coğrafya için harita bilgisi ne kadar önemli?',
        cevap: 'Çok önemli. Soruların neredeyse tamamı harita okuma veya dünya üzerindeki yerleri tanıma becerisi gerektirir.',
      },
      {
        soru: 'TYT coğrafya konuları zor mu?',
        cevap: 'Daha çok temel kavramlar ve yorumlama üzerine kuruludur. Mantığını kavradığınızda 5\'te 5 yapmak oldukça kolaydır.',
      },
    ],
    makale: `
TYT Coğrafya, üniversiteye giriş sınavının ilk aşamasında karşımıza çıkan 5 soruluk kritik bir bölümdür. Her puanın altın değerinde olduğu YKS'de, coğrafya netleri rakiplerinizin önüne geçmenizi sağlar.

### TYT Coğrafya'nın Şifresi: Harita ve Yorum
TYT coğrafya soruları sadece bilgi ölçmez, aynı zamanda harita okuma becerinizi test eder. Dünya üzerindeki iklim bölgelerini, yoğun nüfuslu alanları ve fay hatlarını harita üzerinde tanımak, soruların yarısını çözmek demektir. Platformumuzdaki harita araçları tam da bu beceriyi kazandırmak için hazırlandı.

### En Çok Çıkan Konular
İstatistikler gösteriyor ki; **İklim Bilgisi**, **Nüfus ve Yerleşme** ve **Harita Bilgisi** TYT'nin vazgeçilmezleridir. Özellikle iklim grafiklerini yorumlayabilmek ve nüfus piramitlerinden sonuç çıkarabilmek size doğrudan net kazandırır.

### Nasıl Çalışılmalı?
TYT coğrafya için saatlerce ezber yapmanıza gerek yok. Konunun mantığını anlayıp bol bol interaktif harita çalışması yapmalısınız. Sitemizde yer alan 300'den fazla TYT odaklı soru ile kendinizi test edebilir, eksiklerinizi anında görebilirsiniz.
    `,
  },
  {
    slug: 'ayt',
    baslik: 'YKS AYT Coğrafya',
    aciklama: 'Sözel ve Eşit Ağırlık adayları için derinlemesine coğrafya hazırlık',
    seoTitle: 'AYT Coğrafya Konuları 2026 — Detaylı Konu Anlatımı ve Soru Bankası',
    seoDescription:
      'AYT coğrafya konuları ve soru dağılımı 2026. 400+ soru bankası, Türkiye ekonomisi ve küresel ortam konularında tam uzmanlık.',
    h1: 'YKS AYT Coğrafya Hazırlık',
    h2: 'Bilgi Odaklı Sorularda 17 Netlik Başarı Rehberi',
    soruSayisi: 17,
    bankaSoruSayisi: 400,
    sinav_suresi: '180 dakika',
    sinav_periyot: 'Her yıl (Haziran)',
    hedef_kitle: 'Sözel ve Eşit Ağırlık öğrencileri',
    favicon: '🌍',
    renk: 'rose',
    konuDagilim: [
      { konu: 'Ekosistem ve Madde Döngüleri', soru: '2-3', oncelik: 'Önemli' },
      { konu: 'Türkiye Ekonomisi (Tarım, Sanayi, Enerji)', soru: '4-5', oncelik: 'Kritik' },
      { konu: 'Bölgesel Kalkınma Projeleri', soru: '1-2', oncelik: 'Kritik' },
      { konu: 'Küresel Ortam: Ülkeler ve Şehirler', soru: '2-3', oncelik: 'Önemli' },
      { konu: 'Uluslararası Örgütler ve Çatışma Alanları', soru: '1-2', oncelik: 'Normal' },
      { konu: 'Çevre ve Toplum: Sürdürülebilirlik', soru: '2-3', oncelik: 'Önemli' },
    ],
    faqlar: [
      {
        soru: 'AYT coğrafya kaç sorudan oluşur?',
        cevap: 'AYT\'de Sosyal-1 testinde 6, Sosyal-2 testinde 11 soru olmak üzere toplam 17 coğrafya sorusu vardır.',
      },
      {
        soru: 'AYT coğrafya KPSS ile benzer mi?',
        cevap: 'Özellikle Türkiye Ekonomisi ve Beşeri Coğrafya kısımları KPSS ile %90 oranında benzerlik gösterir.',
      },
    ],
    makale: `
AYT Coğrafya, bilgi birikiminin ve derinlemesine analiz yeteneğinin ölçüldüğü bir alandır. Sözel ve Eşit Ağırlık öğrencileri için sınavın en belirleyici derslerinden biridir.

### Bilgi Her Şeydir
TYT'nin aksine AYT'de doğrudan bilgi sorularıyla karşılaşırsınız. Madde döngüleri, biyomlar, Türkiye'deki kalkınma projeleri ve küresel örgütler gibi konuları detaylıca bilmeniz gerekir.

### Türkiye'nin Ekonomik Gücü
AYT coğrafya sorularının büyük bir kısmı Türkiye'nin ekonomik faaliyetlerine odaklanır. Tarım ürünleri, maden yatakları ve sanayi kollarının dağılımı her yıl mutlaka sorulur. Bu kısımlar sitemizdeki KPSS modülleriyle de büyük ölçüde örtüşmektedir.

### Başarı İçin İpucu
Konuları öğrendikten sonra mutlaka branş denemeleri ve konu bazlı quizler çözmelisiniz. 400+ AYT soruluk bankamız, sınav formatındaki sorularla sizi en zorlu başlıklara bile hazırlar.
    `,
  },
];

export function getSeviye(slug: string): SeviyeConfig | undefined {
  return seviyeler.find((s) => s.slug === slug);
}
