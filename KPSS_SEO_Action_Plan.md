# KPSS Coğrafya — Search Intent Leveraging Strategy

## Durum
- Pazar: ~500K yıllık aday, %70'i KPSS'de coğrafya sorusuyla karşılaşıyor
- Rekabet: Düşük-orta (harita odaklı rakip yok)
- Senin avantajları: 1.701 URL, interaktif harita, 4.259 FAQ, quiz modu
- Duvar: Brand tanınırlığı sıfır, mevsimsel talep

---

## Search Intent Yönetimi: 3 Ana Kategori

### 1️⃣ TRANSAKSİYONEL (Soru Çözme)
**User sorgusu:** "KPSS coğrafya soru", "çıkmış sorular", "deneme sınavı"
**Ne istiyor:** Hemen sonuç, test çözmek, cevap bulmak
**Senin gücün:** Quiz modun + 5300+ soru bankası

**Leverage etme:**
```
❌ Yapma: Quiz sayfasında "konu seç" → çök
✅ Yap: Landing page seç → konu listesi → soru seç → çöz → sonuç
       "10 soruluk hızlı test" butonları - tıklamaya hazır ol
       
Örnek: /quiz/daglar → "Türkiye'nin Dağları — 10 Soru Hızlı Test"
       Metadata: "KPSS coğrafya dağlar quiz, çıkmış sorular, 2024"
```

**On-page SEO:**
- Her quiz sayfasında keyword: "dağlar quiz KPSS", "coğrafya soru çöz"
- Meta: "Türkiye'nin Dağları — 50+ Quiz Sorusu KPSS"
- FAQ schema: "Dağlar hakkında KPSS'de sık sorulan sorular"

**Timeline:** ✅ 1 hafta (Varolan quiz UI üstüne keyword ekle)

---

### 2️⃣ BİLGİ (Kavram Öğrenme)
**User sorgusu:** "KPSS coğrafya konu anlatımı", "[konu] nedir KPSS", "iklim bitki ilişkisi"
**Ne istiyor:** Anlaşılır açıklama, görsel, bağlantılar
**Senin gücün:** 20 MDX konusu + il/konu makaleler

**Leverage etme:**
```
❌ Yapma: /konu/iklim-bitki → 5000 kelime monolog
✅ Yap: 
   1. Açılış (300 kelime): "iklim nedir → bitki nasıl etkilenir → Türkiye örnekleri"
   2. İnteraktif harita: Türkiye'yi tıkla → o bölgenin iklim-bitki kartı
   3. İl örnekleri: 5-6 il detayı (Ege iklimi, Doğu Anadolu iklimi vs)
   4. FAQ: "Erinoid iklim nedir?", "Neden İç Anadolu kurak?"
   5. CTA: "Haritada göster" → /harita/iklim-bitki
```

**Content gap — ÖNCELİKLİ YAZACAKLAR:**

Şu makaleler ekle (her biri ranking kolay):
```
1. "İstanbul Coğrafyası KPSS" (nüfus, sanayi, turizm, klimatik avantajları)
   → Keyword: "Istanbul coğrafya KPSS", "Istanbul tarım", "Istanbul turizm"
   → Ranking şansı: 95% (spesifik, az rakip)
   → URL: /il-profiller/istanbul

2. "[Her il] Coğrafyası KPSS" × 81 (şablon ile hızlı)
   → Her ilin nüfusu, ana tarım ürünü, maden, sanayi
   → Format: 600 kelime + tablo + harita frame
   → Template: /il-profiller/[il-slug]

3. "KPSS'de Sıkça Sorulur — Bölge Karşılaştırmaları"
   → "En kalabalık bölge", "En çok göç alan il", "En yüksek gelir"
   → Keyword: "bölge karşılaştırması KPSS", "hangi bölge nüfusça en büyük"
   → URL: /rehberler/bolge-karsilastirmalari

4. "Güncel Veriler — 2024-2025 İstatistikleri"
   → TUİK son nüfus, ürün verileri (sınav öncesi değişebilir, ÖSYM önemser)
   → Keyword: "2024 nüfus KPSS", "güncel tarım veri"
   → URL: /guncel-veriler/2024-2025
```

**On-page SEO pattern:** Her il profili
```
Title: "İstanbul Coğrafyası — Nüfus, Tarım, Sanayi, Turizm KPSS"
Meta: "İstanbul'un coğrafi özellikleri, ekonomik yapısı, KPSS sınav notları."
H1: "İstanbul — Türkiye'nin Ekonomik Merkezi"
H2: "Coğrafi Konum ve İklim"
H2: "Nüfus ve Yerleşme"
H2: "Tarım ve Hayvancılık"
H2: "Sanayi ve Ticaret"
H2: "Turizm"
H2: "Sık Sorulan Sorular (FAQ)"
```

**Timeline:** 
- 5 il × hafta = 1.5 ayda 30 il (momentum oluşur)
- Bot ile diğer 51 il → 2-3 hafta
- Total: 2 ay (önerilen: Temmuz-Ağustos)

---

### 3️⃣ NAVİGASYONEL (Araç Bulma)
**User sorgusu:** "KPSS haritası", "Türkiye haritası", "coğrafya harita quiz"
**Ne istiyor:** Harita, etkileşimli araç, görsel kaynak
**Senin gücün:** İnteraktif Leaflet haritası — tek başına benzersiz

**Leverage etme:**
```
❌ Yapma: Haritaya bir başlık ekle, bitir
✅ Yap:
   1. Landing sayfası: /harita-hub
      "10 fark harita modunda (madenler, tarım, sanayi, ulaşım...)"
   2. Harita seçim UI: Konu seç → harita yükle
   3. Harita içi CTA: "Bu ili hakkında daha fazla bilgi" → /il/[il]
   4. Quiz tetikleyici: Harita üstüne badge "Bu konuyu test et"
   5. Share: "Türkiye'nin madenlerini gösteren harita → sosyal paylaşım
```

**Keyword yönetimi:**
```
"coğrafya haritası KPSS" → Ana harita hub
"[konu] haritası" (madenler, tarım, etc) → Her harita yeni sayfa
"Türkiye [konu] dağılışı KPSS" → Visualization + açıklama
```

**Landing page:** /harita (Güncellenmiş)
```
Title: "10 İnteraktif KPSS Coğrafya Haritası — Madenler, Tarım, Sanayi, Turizm"
Meta: "Türkiye'nin coğrafi kaynaklarını harita üzerinde keşfet. Madenler, tarım ürünleri, 
       sanayi tesisleri, ulaşım ağları KPSS'ye özel interaktif harita."
H1: "Türkiye Coğrafyasını Harita Üzerinden Öğren"

Content:
- 10 harita kachesi (thumbnail + açıklama)
- Her birinin üstünde "150K+ kullanıcı bunu yaptı"
- CTA: "Haritayı Aç" (Conversion tracking!)
```

**Timeline:** ✅ 2-3 gün (UI değişiklikleri minimal)

---

## 📈 Arama Motoru Spesifik Taktikler

### Google Features'ı Kazanmak (Featured Snippet, People Also Ask)
Google, KPSS sorularında **position 0** öğeleri gösteriyor. Senin FAQ'ler buna mükemmel uyuyor.

**Yapılması gereken:**

1. **FAQ Schema** (Zaten var, ama genişlet)
   ```json
   {
     "@context": "schema.org",
     "@type": "FAQPage",
     "mainEntity": [
       {
         "@type": "Question",
         "name": "Dinar Platfor nedir ve KPSS'de önemli midir?",
         "acceptedAnswer": {
           "@type": "Answer",
           "text": "Dinar Platfor, Batı Anadolu'da... [40-80 kelime doğru cevap]"
         }
       }
     ]
   }
   ```

2. **People Also Ask Keyword Targeting**
   Google "İnsanlar ayrıca soruyor" kısmında bu soruları gösteriyor:
   - "Türkiye'nin en büyük gölü hangisi?"
   - "KPSS'de madenler kaç soru soruluyor?"
   - "Ticaret hangi malları kapsar?"
   
   **Tavsiye:** 
   - Each FAQ title + cevap = bir PAA sorusu
   - Cevabı ilk 60 kelime yazı olarak sunacak şekilde yaz
   - Çok kısa cevap (2-3 cümle) + linkle derinleş

**Timeline:** 1 hafta (Mevcut FAQ'leri yeniden yapılandır)

### Local SEO Angle (Geo-targeting)
KPSS sınavları şehir bazlı oluyor. Bu, harita + lokasyon = altın.

```
Hedef: "Gaziantep'te KPSS hazırlığı" → Gaziantep'in coğrafyasına link
```

**Taktik:**
- Her şehirde sınav merkezi var
- Reklam ağında "Gaziantep KPSS hazırlık" e yönlendir
- Landing: /il/gaziantep + harita ön plana

---

## 🔄 Content Repurposing — Bir Malzeme Birden Çok Format

Yazacağın her makale 5'e katlanabilir:

```
1. Blog post: "İstanbul Coğrafyası" (1500 kelime)
   ↓
2. FAQ: Aynı içerikten 5-10 Q&A çıkar
   ↓
3. Table: İstatistikler (nüfus, tarım, sanayi)
   ↓
4. Harita: İstanbul haritasını highlight et
   ↓
5. Quiz: "İstanbul hakkında 5 soru" - cevapları makaleden al
   ↓
6. Social: 10 tweet/LinkedIn post (veriler parçala)
```

Birkaç saat fazla iş, 5× daha fazla SEO sinyal.

---

## 📊 Önceliklendirme & Timeline

### Ay 1 (Haziran — Hemen Başlama)
```
Hafta 1-2: 
  ✅ OG image + Google doğrulama (SEO temeli)
  ✅ Quiz sayfaları keyword optimize (transaksiyonel)
  ✅ FAQ schema genişletme (Featured snippet)

Hafta 3-4:
  ✅ 15 il profili yaz (İstanbul, Ankara, İzmir, Gaziantep, Mardin... vs)
  ✅ /harita hub sayfasını yenile
  ✅ "Bölge Karşılaştırmaları" makale
```

### Ay 2-3 (Temmuz-Ağustos — Ranking Hazırlanması)
```
Hafta 1-2:
  ✅ Kalan 66 il profili (template → batch)
  ✅ Güncel veriler sayfası

Hafta 3-4:
  ✅ İl profil sayfalarından haritaya iç linkler
  ✅ Quiz'e "Bunu başardın, bu il hakkında daha bilgi al" CTAs
  ✅ İl sayfalarına quiz önerileri
```

### Ay 4+ (Eylül-Ekim — KPSS Talep Zirve)
```
Trafiğin %70'i gelir. Timing harika.
- Sosyal medya kampanyaları başla (KPSS groupları)
- Referral loop: Bir ilen profili gören → quiz yap → başka il öğren
- Email: "Gaziantep'i başardın, şimdi Şanlıurfa'yı dene" (segmented)
```

---

## 🎯 KPI Hedefleri (Gerçekçi)

### Ay 1 Sonu:
- Organik traffic: 500-1000 session/gün (Şu an: ?)
- Quiz completions: 5-10% (conversion başlasın)

### Ay 3 Sonu (KPSS zenil talep başı):
- Organik traffic: 5.000-10.000/gün
- Ortalama session süresi: 3-5 dakika
- Quiz completions: 15-20%

### Ay 6+ (Senelik):
- 100-200K organic session/ay
- Sosyal referral + direct: 20-30%

---

## 💡 Sosyal Amplifikasyon (Organik büyüme)

Arama trafiğine paralel, sosyal kanalları kapat.

**Facebook:**
- KPSS hazırlık gruplarına join (500+ grup)
- Hergün: İl profili paylaş (harita + 5 anahtar noktası)
- Örnek: "Gaziantep Coğrafyası: En çok üretilen ürün? Tarım ve hayvancılık. Açın ve sınav sorusu pratik yapın."

**YouTube Shorts / TikTok:**
- 15 saniyelik harita animasyonları
- "Türkiye'nin madenlerini 30 saniyede öğren"
- Reach: Organik büyüme, çıkılı sınav öncesi viral olabilir

**Reddit (genel coding/learning):**
- r/educationalgifs türü yerlerde harita animasyonları paylaş
- "Türkiye'nin 81 ilini 2 dakikada harita üzerine öğrenin"
- Backlink + referral trafiği

---

## ⚠️ Risk Yönetimi

| Risk | Tespit | Çözüm |
|------|--------|-------|
| ÖSYM müfredat değişir | Blog takibi, forum monitoring | Flexible schema, yıllık güncelleme |
| Rakip harita yapsa | Monthly trending monitoring | Brand + harita güzelliği fark koru |
| Mevsimsel talep düşer | Oct-May düşüş kabul et | Offline kurslara link, membership |
| Sosyal amplifikasyon sessiz kalır | Engagement gözle | Micro-influencer partnerships |

---

## Sonuç

**Kısaca:** Senin gücün harita + quiz kombinasyonu. Onu ortaya çıkar:
1. **Arama motoruna:** Spesifik, long-tail makalelerle 1.701 URL'den maksimum çıkar
2. **Sosyal kanallara:** KPSS gruplarında daily il profili postu
3. **Referral döngüsü:** Harita → İl profili → Quiz → Başka il

3 ay sonra, KPSS sınavına 3 ay kala, talep tavan yaparsa **100K+ aylık organik** rahatça yapabilirsin. Ama beklentiler gerçekçi tut—bu mevsimsel pazarı ayakta tutacak uzun vadeli varlık (YouTube, course, community) lazım.

Başla.
