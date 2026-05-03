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
    faqlar: [
      {
        soru: 'KPSS lisans sınavında coğrafya kaç soru?',
        cevap:
          'KPSS lisans sınavının Genel Kültür bölümünde 18 coğrafya sorusu yer almaktadır. Sitemizdeki 500+ özgün soru ile bu 18 soruyu tam yapmanız hedeflenir.',
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
    makale: `
KPSS Lisans coğrafya, aslında birçoğumuzun "ya bunu zaten biliyorum" deyip geçtiği ama sınavda o 18 sorunun karşısına oturduğunda "bu dağ neredeydi ya?" diye kaldığı bir ders. Ama korkmana hiç gerek yok; doğru bir stratejiyle bu 18 soruyu cebe atmak, sandığından çok daha keyifli olabilir. Gel, bu süreci nasıl beraber atlatırız, bir bakalım.

### Önce Bir Haritayla Barışalım mı?
Coğrafya çalışmaya başladığında önüne bir Türkiye haritası al ve onunla biraz vakit geçir. Dağları sadece isim olarak ezberlemek yerine, nerede durduklarını, denize nasıl baktıklarını hayal et. Sitemizdeki interaktif haritaları tam da bunun için yaptık. Görsel hafıza, o sıkıcı görünen bilgileri kalıcı hale getirmenin en kestirme yolu. İnan bana, bir kere harita üzerinde o dağı "gördüğünde", sınavda gözlerini kapattığında o yer direkt aklına gelecek.

### Güncel Veriler: Coğrafyanın Magazini
Nüfus artmış mı, en çok hangi maden çıkmış, hangi tarım ürününde birinciyiz... Bunlar coğrafyanın "magazini" gibi aslında. TÜİK her yıl verileri güncelliyor ve ÖSYM bu güncellemeleri sormaya bayılıyor. "Geçen yıl şuydu, bu yıl bu olmuş" diyerek çalışmak işi daha ilginç kılıyor. Biz senin için tüm bu karmaşık tabloları süzüp, en taze haliyle sitemize ekledik. Yani veri peşinde koşmana gerek yok, biz senin için koştuk bile!

### Soru Çözmek: Kas Hafızası Gibidir
Teorik bilgiyi okuyup geçmek, yüzme kitabını okuyup denize girmeye benzer. Sitemizdeki **500'den fazla özgün soruyla** seni o denize sokuyoruz. Hata yapmaktan sakın korkma; burada yaptığın her yanlış, sınavda yapacağın bir doğrunun habercisidir. Özellikle madenler ve enerji gibi "bu nasıl akılda kalır?" dediğin konularda bol soru çözmek, bir süre sonra seçenekleri elerken "bu zaten olamaz" demeni sağlayacak o kas hafızasını oluşturacak.

### Son Söz: Sen Yaparsın!
Coğrafya sadece bir ders değil, üzerinde yaşadığımız toprakları tanıma hikayesi. Bu hikayeyi öğrenirken sıkılmak yerine, ülkendeki zenginlikleri keşfediyormuşsun gibi düşün. Biz buradayız, interaktif haritalarımız ve dev soru bankamızla her adımda yanındayız. Hadi, beraber o 18'de 18'i yapalım!
    `,
  },
  {
    slug: 'onlisans',
    baslik: 'KPSS Önlisans',
    aciklama: '2 yıllık önlisans mezunları için KPSS coğrafya hazırlık',
    seoTitle: 'KPSS Önlisans Coğrafya Konuları 2026 — 500+ Soru Bankası, Harita, Quiz',
    seoDescription:
      'KPSS önlisans coğrafya konuları 2026. 500+ soru bankası, harita destekli konu anlatımı ve çıkmış sorular ile sınava tam hazırlanın.',
    h1: 'KPSS Önlisans Coğrafya',
    h2: '500+ Özgün Soru ile 18 Soruluk Sınava Hazırlan',
    soruSayisi: 18,
    bankaSoruSayisi: 500,
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
          'Günde 1 saat, 3-4 haftalık düzenli çalışma ile 18 sorudan 14-16 net yapılabilir. Sitemizdeki 500+ soru ile pratik yapmak bu süreyi kısaltır.',
      },
    ],
    makale: `
Önlisans KPSS süreci bazen "iş mi, okul mu, sınav mı?" üçgeninde adayları biraz yorabiliyor. Farkındayız, vaktin kısıtlı ve bu kısıtlı vakitte en yüksek verimi alman gerekiyor. İşte tam da bu yüzden coğrafyayı senin için bir yük olmaktan çıkarıp, puan toplayacağın bir "altın madenine" dönüştürmek istiyoruz.

### "Lisans Daha Zordur" Efsanesini Unut
Hemen baştan söyleyelim: ÖSYM son yıllarda önlisans ve lisans sorularını neredeyse aynı kalitede hazırlıyor. Yani "önlisans nasılsa kolay olur" deyip konuyu üstünkörü geçmek büyük bir hata olur. Ama iyi haber şu; her iki sınavda da mantık aynı. Türkiye'nin iklimini, yer şekillerini bir kez kavradığında, karşına hangi seviyeden soru gelirse gelsin çözebileceksin. Bizim sitemizdeki içerikler, bu her iki seviyeyi de kapsayacak kadar derinlikli ama senin vaktini çalmayacak kadar da sade.

### Ezberlemek Yerine "Neden?" Diye Sor
Coğrafya sadece isimlerden ibaret değil. "Ege'de neden falez az?" veya "Neden Karadeniz'de orman çok?" gibi soruların mantığını bir kez anladığında, binlerce sayfayı ezberlemekten kurtulursun. Biz bu bağlantıları senin yerine kurduk ve harita üzerine işledik. Sitemizdeki **interaktif haritalara** bir bak, her şeyin nasıl birbirine bağlı olduğunu göreceksin. Mantığını anladığın şeyi bir daha asla unutmazsın.

### Pratik, Pratik ve Daha Fazla Pratik!
Zamanın kısıtlıysa en iyi çalışma yöntemi soru üzerinden gitmektir. Sitemizde senin için hazırladığımız **500'den fazla özgün soru**, aslında sana konuyu soru çözerken öğretecek şekilde tasarlandı. Her yanlış cevabında bir şeyler öğrenecek, her doğru cevabında özgüven kazanacaksın. Günlük rutininde, otobüste veya mola verdiğinde çözeceğin birkaç quiz, sınav günü o 18 soruyu tereyağından kıl çeker gibi çözmeni sağlayacak.

### Biz Senin Yanındayız
Memuriyet hayaline giden bu yolda, coğrafyayı en büyük destekçin yapmaya kararlıyız. Vaktini verimli kullanman için her şeyi senin adına süzdük, güncelledik ve hazırladık. Hadi, sitemizdeki kaynaklarla bu işi beraber bitirelim ve o 18 neti cebe atalım!
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
    hedef_kitle: 'Lise and ortaöğretim mezunları',
    favicon: '📚',
    renk: 'amber',
    faqlar: [
      {
        soru: 'KPSS ortaöğretim sınavında coğrafya kaç soru çıkıyor?',
        cevap:
          'KPSS ortaöğretim Genel Kültür bölümünde 18 coğrafya sorusu yer almaktadır. Sitemizdeki 500+ soru bankası tüm müfredatı kapsamaktadır.',
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
    makale: `
Merhaba dostum! Lise mezunları için düzenlenen KPSS Ortaöğretim sınavı, aslında hayallerine giden yolda harika bir başlangıç noktası. Coğrafya dersi ise bu sınavın en keyifli ve net artırması en kolay bölümlerinden biri. Eğer "nereden başlasam?" diye düşünüyorsan, doğru yerdesin. Gel, bu 18 soruyu beraber halledelim.

### Coğrafyayı Bir Keşif Yolculuğu Gibi Düşün
Lise kitaplarındaki o karmaşık tabloları unut! Coğrafya aslında üzerinde yaşadığın ülkeyi, gittiğin yerleri, yediğin meyvenin nerede yetiştiğini tanıma dersidir. Çalışırken "bunu ezberlemeliyim" demek yerine, "Aa, demek ki Erzurum'da bu yüzden kış bu kadar sert geçiyormuş" dersen, her şey kendiliğinden yerine oturur. Bizim sitemizdeki konu özetlerini tam da bu merakı uyandıracak, seni sıkmayacak şekilde hazırladık.

### Harita Senin En Yakın Arkadaşın Olsun
Coğrafya sorularının çoğu "nerede?" sorusunun cevabıdır. Bu cevabı bulmanın en iyi yolu da haritaya bakmaktır. Ama öyle kara kara düşünerek bakma! Sitemizdeki **interaktif haritalarla** oyna, şehirlerin yerlerini tahmin et, dağların nerede bittiğini gör. Harita üzerinde çalışmak bir süre sonra bir oyun gibi gelecek ve sınavda haritalı bir soru gördüğünde "tamam, bu bende!" diyeceksin.

### Soru Bankası: Senin Gizli Silahın
Konuyu okudun, haritaya baktın... Şimdi sıra antrenmanda! Sitemizde senin için hazırladığımız **500'den fazla soru**, lise mezunlarının en çok takıldığı yerleri baz alarak kurgulandı. Her gün çözeceğin küçük quizler, sınav günü o 18 soruyu sanki önceden görmüşsün gibi rahat çözmeni sağlayacak. Unutma, çok soru çözen değil, yanlışlarından öğrenen aday kazanır!

### Biz Her Zaman Buradayız
Sınav süreci bazen stresli olabilir ama yalnız değilsin. Sitemizdeki güncel bilgiler, haritalar ve dev soru bankasıyla her zaman senin yanındayız. Takıldığın yerde bize dön, kaynaklarımıza bak. Bu 18 soruyu fire vermeden beraber tamamlayacağız. Kendine güven, biz sana güveniyoruz!
    `,
  },
];

export function getSeviye(slug: string): SeviyeConfig | undefined {
  return seviyeler.find((s) => s.slug === slug);
}
