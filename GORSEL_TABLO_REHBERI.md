# KPSS Coğrafya — Tüm Konu Sayfalarına Görsel & Tablo Iyileştirmesi Rehberi

## 📋 Projenin Mevcut Durumu
- **Repo**: umut92115-spec/kpss-cografya (TypeScript/Next.js + MDX)
- **Toplam Konu Sayısı**: **20 konu** (beseri coğrafya, fiziki coğrafya, ekonomik coğrafya)
- **Sayfa Yapısı**: `/konu/[slug]` sayfalarında MDX içerik renderlanıyor
- **Mevcut Sorun**: Metinsel içerik ağırlıklı, görsel hiyerarşi zayıf, tablolar sade
- **Hedef**: Her konu sayfasında akademik, profesyonel, "slop" olmayan görseller ve renkli tablolar

---

## 🎯 Tasarım İlkeleri

1. **Akademik Profesyonellik**: Görseller bir üniversite ders kitabı veya resmi coğrafya enstitüsü web sitesi gibi görünmeli
2. **Görsel Hiyerarşi**: Başlıklar → Temel kavramlar tablosu → Detaylı açıklamalar → İnfografik/Harita → Durum özeti
3. **Renk Palet**: 
   - Birincil: Matlaşmış mavi (#4B7BA7)
   - Beslenme: Turuncu (#E8823C), Yeşil (#2D8659)
   - Nötr: Gri tonları (#F5F5F5, #333333)
4. **Tipografi**: Başlıklarda serif, gövnede sans-serif (kütüphaneler gibi)

---

## 📑 Her Konu İçin Standart Yapı

### ✅ BÖLÜM 1: Genel Bakış (Üst Görsel)
**Mevcut**: Başlık + Kısa metin + PNG harita
**Yapılacak**: 
- **Harita/İnfografik**: Konunun coğrafik dağılımını gösteren, harita üzerinde ana bölgeleri vurgulayan bir görsel
- Alt yazı: Tarih ve kaynak bilgisi ile
- **Stil**: Coğrafya atlası kalitesi, net ve okunaklı

---

### ✅ BÖLÜM 2: Temel Kavramlar
**Mevcut**: Madde işaretli liste
**Yapılacak**: Tablo + Mini İkon

| Kavram | Tanım | Örnek | Ikon |
| --- | --- | --- | --- |
| **Örnek 1** | Tanım | Örnek | 🔍 |
| **Örnek 2** | Tanım | Örnek | 📊 |

---

### ✅ BÖLÜM 3: Ana Tablo (Kategori/Özellik/Veri)
**Mevcut**: Basit tablo
**Yapılacak**: Renkli başlıklar, satır arkaplan renkleri, ikon + metin kombinasyonu

**Tasarım**:
- Başlık satırı: Gradyan (turuncu → sarı) veya katı renk (matlaşmış mavi)
- Her satırın sol kenarında 3-4px renkli şerit
- Sütunlar: İkon + metin | Kategori | Detay | Önem/KPSS
- Hover: Satır hafif gri arka plan (interaktif hisse)

---

### ✅ BÖLÜM 4: Ayrıntılı Anlatım Bölümleri (H2/H3)
**Mevcut**: Sadece metin + liste
**Yapılacak**: Her başlık altında bağlam görseli veya harita

---

### ✅ BÖLÜM 5: İstatistikler / Veriler
**Mevcut**: Basit tablo
**Yapılacak**: Kartlar + Tekil Tablo

**Tasarım**: 4-5 önemli istatistik kartla gösterilir, gerisi tablo ile

---

### ✅ BÖLÜM 6: KPSS Soru Odakları
**Mevcut**: Madde işaretli liste
**Yapılacak**: Renk kodlu kutular (highlight boxes)

**Renk Kodu**:
- ⚠️ DİKKAT / YANLIŞ: Kırmızı arka (#FFE5E5), kırmızı sol şerit
- 💡 İPUÇU / MNEMONIC: Turuncu arka (#FFF3E5), turuncu sol şerit
- ✅ ÖNEMLİ: Yeşil arka (#E5F5E5), yeşil sol şerit
- 📌 HATIRLATMA: Mavi arka (#E5F0FF), mavi sol şerit

---

### ✅ BÖLÜM 7: Sık Sorulan Sorular (FAQ)
**Mevcut**: Basit **Soru** / **Cevap** formatı
**Yapılacak**: Kartlar ile sorular — her kart başında ❓ ikonu

---

## 🎨 Genel Görsel Tasarım Kuralları

### Renkler
- **Matlaşmış Mavi** (#4B7BA7): Harita, temel bilgi, başlıklar
- **Turuncu** (#E8823C): İpuçları, kodlamalar, vurgular
- **Yeşil** (#2D8659): Önemli notlar, başarı bilgileri
- **Kırmızı** (#C84C42): Uyarılar, yanılgılar
- **Gri** (#F5F5F5, #CCCCCC): Arka planlar, ayırıcılar
- **Koyu** (#2C2C2C): Metin, başlıklar

### İkonlar
- 🗺️ Harita / Coğrafya
- 🏔️ Dağlar / Yükseklik
- 💧 Su / Akarsular
- 🌾 Tarım / Ekili Arazi
- ⛏️ Madenler / Enerji
- 📊 İstatistik / Veri
- ⭐ Önem / Vurgu
- ❓ Soru / FAQ
- ⚠️ Uyarı / Dikkat
- 💡 İpucu / Mnemonic
- ✅ Önemli / Doğru

---

## 📐 Her Konuya Özel Görseller (Detaylı Tasvirler)

### 1️⃣ **COĞRAFI KONUM** (`cografi-konum.mdx`)
**Görseller**: 
- **Görsel 1**: Türkiye'nin Dünya haritasında konumu — konumsuz harita, Türkiye kırmızı işaretli
- **Görsel 2**: Türkiye'nin Avrupa'daki konumu — yakın ölçek
- **Tablo**: Koordinat bilgileri, sınır ülkeleri, denizleri, stratejik önemi

---

### 2️⃣ **DAĞLAR** (`daglar.mdx`)
**Görseller**:
- **Görsel 1**: Jeoloji Kesiti Diyagramı — kıvrım dağların oluşum mekanizması
- **Görsel 2**: Türkiye Dağ Oluşum Haritası — turuncu (kıvrım), kırmızı (kırık), sarı (volkanik)
- **Tablo 1**: Oluşum Türlerine Göre Dağlar — başlıkta 3 renk şerit
- **Tablo 2**: İstatistikler — En Yüksek Zirve, Akdeniz En Yüksek, vb. (kartlar)
- **Highlight Boxes**: Nur Dağları (kırıklı!), Uludağ (İç Püskürtük!), Menteşe Dağları (paralel!)

---

### 3️⃣ **YER ŞEKİLLERİ** (`yer-sekilleri.mdx`)
**Görseller**:
- **Görsel 1**: Türkiye Topografya Haritası — yükseklik tonlaması (mavi, yeşil, sarı, turuncu, kahverengi)
- **Görsel 2**: İç ve Dış Kuvvetlerin Etkileri Diyagramı — volkanizm, depremsellık, erozyon
- **Tablo 1**: Yer Şekilleri Türleri — Ovalar, Platolar, Vb. Detayları
- **Tablo 2**: Bölgesel Yer Şekilleri Dağılımı

---

### 4️⃣ **İKLİM VE BİTKİ ÖRTÜSÜ** (`iklim-bitki.mdx`)
**Görseller**:
- **Görsel 1**: İklim Bölgeleri Haritası — Akdeniz (kırmızı), Karadeniz (yeşil), Step (sarı), Sert Karasal (mavi)
- **Görsel 2**: Basınç Merkezleri ve Rüzgarlar Haritası — İzlanda, Sibirya, Azor, Basra + ok ile rüzgar yönleri
- **Görsel 3**: Bitki Örtüsü Dağılışı Haritası — Ormanlar (koyu yeşil), Maki (açık yeşil), Bozkır (sarı), Çayır (açık sarı)
- **Tablo 1**: Rüzgarlar Tablosu (KAYIP SAKAL) — her satırın sol kenarı rüzgar rengine göre şerit
- **Tablo 2**: İklim Tipleri ve Bitki Örtüsü Özellikleri

---

### 5️⃣ **AKARSULAR** (`akarsular.mdx`)
**Görseller**:
- **Görsel 1**: Türkiye Havzaları Haritası — 6 havza renkli şekilde ayrılmış
- **Görsel 2**: Barajlar ve Hidroelektrik Santralları Haritası — barajlar kırmızı noktalar
- **Tablo 1**: Başlıca Akarsuları — Kızılırmak, Euphrates, Tigris, vb. detayları
- **Tablo 2**: Barajlar ve Enerji Üretimi

---

### 6️⃣ **GÖLLER** (`goller.mdx`)
**Görseller**:
- **Görsel 1**: Türkiye'deki Göller Haritası — büyüklüğe göre işaretli, renkli göller
- **Görsel 2**: Göl Türleri Diyagramı — Tatlı, Alkali, Sodalı göl özellikleri
- **Tablo 1**: En Büyük Göller — Van, Beyşehir, Iznik, vb. ile İstatistikler
- **Tablo 2**: Bölgesel Göl Özellikleri

---

### 7️⃣ **TARIH VE JEOLOJI** (`jeolojik-yapi.mdx`)
**Görseller**:
- **Görsel 1**: Jeolojik Zaman Skalaı — Dünya'nın oluşumundan günümüze
- **Görsel 2**: Türkiye'deki Jeolojik Dönem Formasyon Haritası
- **Tablo 1**: Jeolojik Dönemler — Era, Periyod, Özellikleri
- **Tablo 2**: Türkiye'deki Esas Rock Grupları

---

### 8️⃣ **TOPRAK VE ÇEVRE** (`toprak-cevre.mdx`)
**Görseller**:
- **Görsel 1**: Toprak Profili Kesiti — A, B, C ufkuları
- **Görsel 2**: Türkiye Toprak Tipleri Haritası — Kırmızı, Kahverengi, Step, Vertisol, vb.
- **Tablo 1**: Toprak Tipleri Özellikleri — Rengi, Oluşumu, Dağılımı, Verimliliği
- **Tablo 2**: Toprak Sorunları ve Çözümleri

---

### 9️⃣ **KIYILARI TIPLERI** (`kiyi-tipleri.mdx`)
**Görseller**:
- **Görsel 1**: Kıyı Tipleri Profil Diyagramları — Çatlaklı (Ege), Düz (Akit), Uzun (Akdeniz)
- **Görsel 2**: Türkiye Kıyıları Haritası — Renk kodlu kıyı tipleri
- **Tablo 1**: Kıyı Tipleri Özellikleri ve Örnekleri
- **Tablo 2**: Bölgesel Kıyı Farklılıkları

---

### 🔟 **NÜFUS VE POLİTİKALAR** (`nufus-politikalari.mdx`)
**Görseller**:
- **Görsel 1**: Türkiye Nüfus Haritası — Yoğunluğa göre renk kodlu (açık = az, koyu = çok)
- **Görsel 2**: Nüfus Piramidi Grafik — Yaş gruplarına göre cinsiyet dağılımı
- **Görsel 3**: Nüfus Hareketleri Trend Grafiği — Doğum oranı, ölüm oranı, göç
- **Tablo 1**: Nüfus Politikaları Özeti — Türkiye'nin çeşitli dönemlerindeki politikaları
- **Tablo 2**: Nüfussal Göstergeler İstatistikleri

---

### 1️⃣1️⃣ **BESERI COĞRAFYA** (`beseri-cografya.mdx`)
**Görseller**:
- **Görsel 1**: Yerleşim Tipleri Diyagramı — Dispersed, Clustered, Linear
- **Görsel 2**: Türkiye Şehirler ve Yerleşme Haritası — Nüfusa göre şehir simgeleri
- **Tablo 1**: Şehir Kategorileri — Mega, Büyük, Orta, Küçük Şehirler
- **Tablo 2**: Türkiye'nin En Büyük Şehirleri — Nüfus Sıralaması

---

### 1️⃣2️⃣ **TARRIM** (`tarim.mdx`)
**Görseller**:
- **Görsel 1**: Ürün Dağılımı Haritası — Her ürün için renk + simge (🌾 buğday, 🍅 domates, 🫒 zeytin, vb.)
- **Görsel 2**: Tarım Bölgeleri Haritası — Bölgesel uzmanlaşmış tarım ürünleri
- **Görsel 3**: Tarım Alanları vs. Ürün Verimi Grafiği — İstatistik
- **Tablo 1**: Başlıca Tarım Ürünleri — Üretim Miktarı, Bölgeler, İhracat
- **Tablo 2**: Bölgesel Tarım Özellikleri

---

### 1️⃣3️⃣ **SANAYİ** (`sanayi.mdx`)
**Görseller**:
- **Görsel 1**: Sanayi Bölgeleri Haritası — Hizmet Sanayi (mavi), Hafif Sanayi (yeşil), Ağır Sanayi (kırmızı)
- **Görsel 2**: Sanayi Üretim Trendi Grafiği — Yıllar ve Sektör Dağılımı
- **Tablo 1**: Sanayi Tipleri ve Dağılımı — Tekstil, Demir-Çelik, Otomotiv, vb.
- **Tablo 2**: Sanayi Merkezleri ve Kullanılan Kaynaklar

---

### 1️⃣4️⃣ **MADENLERvENERJİ** (`madenler-enerji.mdx`)
**Görseller**:
- **Görsel 1**: Maden Kaynakları Haritası — Demir (kırmızı), Bakır (turuncu), Krom (yeşil), Bor (mavi), Linyit (gri), Petrol (siyah)
- **Görsel 2**: Enerji Kaynakları Pie Chart — Hidroelektrik (%), Termik (%), Rüzgar (%), Güneş (%), Jeotermal (%)
- **Tablo 1**: Maden Kaynakları Detay — Yatağı, Miktar, Kullanım, Ticaret
- **Tablo 2**: Enerji Kaynakları ve Santral Kapasiteleri

---

### 1️⃣5️⃣ **TICARET** (`ticaret.mdx`)
**Görseller**:
- **Görsel 1**: Ticaret Yolları Haritası — Deniz (mavi oklar), Kara (kırmızı hatlar), Hava (uçak simgeleri)
- **Görsel 2**: İthacat-İhracat Trendi Grafiği — Yıllara göre milyar dolar
- **Tablo 1**: Başlıca İhraç Ürünleri — Miktar, Hedef Ülkeler
- **Tablo 2**: Başlıca İthaç Ürünleri — Kaynak Ülkeler

---

### 1️⃣6️⃣ **ULAŞTIRMA** (`ulasim.mdx`)
**Görseller**:
- **Görsel 1**: Ulaştırma Ağları Haritası — Karayolları (kırmızı), Demiryolları (siyah), Havayolları (uçak), Deniz Limanları (çapa)
- **Görsel 2**: Ulaştırma Başsağlık Grafiği — Karayol, Demiryol, Deniz, Hava % oranları
- **Tablo 1**: Başlıca Limanlar — Kapasite, Ticaret Hacmi
- **Tablo 2**: Başlıca Havalimanları — Yolcu Trafiği, Kargo

---

### 1️⃣7️⃣ **TURİZM** (`turizm.mdx`)
**Görseller**:
- **Görsel 1**: Turizm Bölgeleri Haritası — Sahil Turizmi (mavi), Kültür Turizmi (turuncu), Doğa Turizmi (yeşil), Termal (kırmızı)
- **Görsel 2**: Turist Sayı Trendi Grafiği — Yıllara göre yerli ve yabancı turist sayıları
- **Görsel 3**: Bölgesel Turist Dağılımı Pie Chart
- **Tablo 1**: Başlıca Turizm Destinasyonları — Bölge, Çeşit, Turist Sayısı
- **Tablo 2**: Turizmin Ekonomik Katkısı

---

### 1️⃣8️⃣ **BÖLGE VE JEOPOLİTİK** (`bolge-jeopolitik.mdx`)
**Görseller**:
- **Görsel 1**: Türkiye'nin 7 Coğrafi Bölgesi Haritası — Her bölge farklı renk
- **Görsel 2**: Jeopolitik Önem Haritası — Boğazlar (turuncu), Sınır Hatları (kesikli), Stratejik Noktalar (yıldız)
- **Tablo 1**: 7 Bölgenin Özellikleri — Alan, Nüfus, Başkent
- **Tablo 2**: Geopolitik Stratejik Noktalar

---

### 1️⃣9️⃣ **KALKINMA PROJELERİ** (`kalkinma-projeleri.mdx`)
**Görseller**:
- **Görsel 1**: Kalkınma Projelerinin Haritası — GAP (yeşil), KOP (mavi), DAP (kırmızı), CAP (sarı), vb.
- **Görsel 2**: Bölgesel Kalkınma Endeksleri Haritası — Gelişmişlik Sırası (açık = geri, koyu = gelişmiş)
- **Tablo 1**: Başlıca Kalkınma Projeleri — Alanı, Hedefi, Bütçesi, Yapılan
- **Tablo 2**: Proje Sonuçları ve Etkileri

---

### 2️⃣0️⃣ **SINIR KAPILAR**I** (`sinir-kapilari.mdx`)
**Görseller**:
- **Görsel 1**: Türkiye Sınır Kapıları Haritası — Karasal (kırmızı), Deniz (mavi), Hava (yeşil)
- **Görsel 2**: Sınır Kapılarının Ticaret Hacmi Grafiği
- **Tablo 1**: Başlıca Sınır Kapıları — Komşu Ülke, Adı, Ticaret Hacmi, Stratejik Önemi
- **Tablo 2**: Boğazlar ve Deniz Kapıları Detay

---

### 2️⃣1️⃣ **SÖZLÜK** (`sozluk.mdx`)
**Not**: Bu sayfa zaten sözlük niteliğindedir. Gerekirse:
- **Görsel**: Terimlerle ilgili küçük infografikler (opsiyonel)
- **Tablo**: Alfabetik terimlerin yoğun listesi — yeterli

---

## 🔧 İmplementasyon Kuralları (Ajan için)

### 1. Görsel Format
- **PNG**: Infografikler, haritalar (72-96 DPI, web optimize)
- **SVG**: İkon, diyagram, kesit çizimleri (skallanabilir)
- **Boyutlar**: Tam genişlik görseller 800px × 400-500px

### 2. Tablo Tasarımı
```
Başlık satırı: Renkli gradyan ya da katı renk
Satırlar: Her satırın sol kenarında 3-4px renkli şerit
Sütunlar: İkon + metin, Kategori, Detay, Önem/KPSS
Hover: Hafif gri arka plan (#F9F9F9)
```

### 3. Yazı Tipi
- **Başlıklar**: Serif (Georgia, Garamond)
- **Metinler**: Sans-serif (Inter, Roboto)
- **Font boyutu**: Başlık 16-18px, metin 12-14px

### 4. Alt Yazı (Caption)
```
Her görselin altında:
"📸 [Görsel Açıklaması] — [Kaynak/Yıl]"
Örnek: "📸 Türkiye Maden Kaynakları Dağılımı — USGS 2024"
```

### 5. Erişilebilirlik
- Her görselde `alt` attribute tanımlı
- Tablo başlıkları: `<thead>` içinde, `scope="col"`
- Kolorblind dostu: Renk + sembol / metin çift kod

### 6. İçerik Yapısı (Her H2 başlığında)
```
H2 Başlık
↓
Açılış Paragrafı (2-3 cümle)
↓
**Görsel / İnfografik / Harita**
↓
Detaylı Açıklama Metni (3-5 paragraf)
↓
**Tablo / Kartlar** (istatistik veya detay)
↓
Özet Cümle
```

### 7. MDX Entegrasyonu
```
Görseller: ![alt text](/images/konu/konuadı-dosya.png)
Tablolar: Standard Markdown table syntax
Highlight boxes: Mevcut `KpssNotKutusu` bileşeni kullan
```

### 8. Performans
- Görselleri optimize et (ImageOptim, TinyPNG)
- Lazy loading: MDX'deki görsellerde `loading="lazy"`
- WebP formatı destekle (fallback PNG ile)

---

## 📊 Konulara Göre Tasarım Özeti Tablosu

| # | Konu | Görsel 1 | Görsel 2 | Görsel 3 | Tablo | Toplam |
|----|------|---------|---------|---------|-------|--------|
| 1 | Coğrafi Konum | Dünya Haritası | Avrupa Haritası | - | Detay | 3 |
| 2 | Dağlar | Jeoloji Kesiti | Oluşum Haritası | - | Tablo (4+3) | 5 |
| 3 | Yer Şekilleri | Topografi Haritası | Kuvvetler Diyagramı | - | Tablo (2) | 4 |
| 4 | İklim-Bitki | İklim Haritası | Rüzgarlar Haritası | Bitki Haritası | Tablo (2) | 6 |
| 5 | Akarsular | Havza Haritası | Baraj Haritası | - | Tablo (2) | 5 |
| 6 | Göller | Göl Haritası | Göl Türleri Diyagramı | - | Tablo (2) | 4 |
| 7 | Jeoloji | Zaman Skalaı | Jeoloji Haritası | - | Tablo (2) | 4 |
| 8 | Toprak-Çevre | Toprak Profili | Toprak Haritası | - | Tablo (2) | 4 |
| 9 | Kıyı Tipleri | Kıyı Profili | Kıyı Haritası | - | Tablo (2) | 4 |
| 10 | Nüfus Politikaları | Nüfus Haritası | Piramidi Grafiği | Nüfus Trendi | Tablo (2) | 6 |
| 11 | Beseri Coğrafya | Yerleşim Diyagramı | Şehirler Haritası | - | Tablo (2) | 4 |
| 12 | Tarım | Ürün Haritası | Bölge Haritası | Tarım Grafiği | Tablo (2) | 6 |
| 13 | Sanayi | Sanayi Bölgeleri | Üretim Grafiği | - | Tablo (2) | 4 |
| 14 | Madenler-Enerji | Maden Haritası | Enerji Pie Chart | - | Tablo (2) | 4 |
| 15 | Ticaret | Ticaret Yolları | İthaç-İhraç Grafiği | - | Tablo (2) | 4 |
| 16 | Ulaştırma | Ulaştırma Ağları | Ulaştırma Grafiği | - | Tablo (2) | 4 |
| 17 | Turizm | Turizm Bölgeleri | Turist Grafiği | Turist Pie Chart | Tablo (2) | 6 |
| 18 | Bölge-Jeopolitik | Bölgeler Haritası | Jeopolitik Haritası | - | Tablo (2) | 4 |
| 19 | Kalkınma Projeleri | Projeler Haritası | Gelişmişlik Haritası | - | Tablo (2) | 4 |
| 20 | Sınır Kapıları | Sınır Haritası | Kapıları Grafiği | - | Tablo (2) | 4 |
| 21 | Sözlük | - | - | - | Alfabetik Tablo | 1 |
| **TOPLAM** | | | | | | **~95 Görsel/Tablo** |

---

## ✨ Nihai Kontrol Listesi

- [ ] Her görsele profesyonel, akademik stil uygulandı
- [ ] Renk palet tutarlı ve coğrafya-uygun
- [ ] Her görsel açıklamalı (başlık + alt yazı)
- [ ] Tablolar renkli başlık ve satır kodlaması ile
- [ ] Kartlar vurgulu ve okunaklı
- [ ] İkonlar kullanımı uygun ve anlaşılır
- [ ] Haritalar Türkiye-centric, net sınırlar
- [ ] Tüm görseller web optimize (PNG/SVG)
- [ ] Alt textler tanımlı ve erişilebilir
- [ ] MDX yapısı değişmez, sadece görseller ve tablolar eklendi
- [ ] "AI Slop" yok, akademik kalite korunmuş
- [ ] Responsive tasarım (mobilde scroll yapabilen tablolar)

---

## 📞 Son Notlar

- **Temel Referans**: `/public/images/konu/` klasöründeki mevcut görseller
- **Veri Kaynağı**: `content/konu/*.mdx` dosyaları detaylı içerik için
- **Yapılandırma**: `tailwind.config.ts` mevcut renk definelarını kullan veya extend et
- **Hedef Kalite**: Resmi devlet enstitüsü / üniversite ders kitabı seviyesi — profesyonel, güvenilir, eğitici

---

Bunu ajanına verip görselleri ve tabloları bir bir hazırlatabilirsin. Başarılar! 🎯
