# KPSS Coğrafya Soru Üretim Protokolü (SÜP-v1.0)

> Bu belge, KPSS Coğrafya soru bankasına eklenecek her sorunun **zorunlu** olarak geçmesi gereken üretim standardını tanımlar. Hiçbir soru bu protokol dışında üretilemez.

---

## 📋 AŞAMA 0 — Ön Okuma ve Veri Yükleme (ZORUNLU)

Agent çalışmaya başlamadan önce aşağıdaki dosyaları **mutlaka okuyacak**:

| Dosya | Amaç |
|-------|-------|
| `data/iller.json` | Geçerli il slug listesi — `harita_il` alanı buradan doğrulanır |
| `data/leaflet/turkiye_cografya.json` | Dağ/göl/akarsu koordinatları ve yükseklikleri |
| `SORU_URETIM_PROTOKOLU.md` | Bu protokol (mevcut dosya) |

**Bu dosyaları okumadan soru üretmek yasaktır.** Koordinat veya il slug bilgisi yalnızca bu dosyalardan alınır; arka plan bilgisine güvenilmez.

---

## 📐 AŞAMA 1 — Konu Analizi ve Soru Planlaması

### 1.1 Alt Konu Dağılımı
Her chunk için görevlendirme metninde belirtilen alt konular **eşit dağılımda** işlenecek:
- Chunk başına düşen alt konu sayısı hesaplanır
- Her alt konudan en az 3, en fazla 8 soru üretilir
- Aynı bilgiyi ölçen iki soru **kesinlikle** üretilemez

### 1.2 Zorluk Dengesi (Her chunk için)
| Zorluk | Oran | Tanım |
|--------|------|-------|
| `kolay` | %20 | Tek bilgi gerektiren, doğrudan sorgulama |
| `orta`  | %50 | İki veya daha fazla bilgiyi ilişkilendirme |
| `zor`   | %30 | Çapraz konu, tuzak çeldirici, analitik karşılaştırma |

### 1.3 Harita Entegrasyon Oranı
- Chunk başına **en az %40** soru `harita_il` alanı dolu olacak
- Haritalı soru çeşitleri:
  - Belirli bir ilde gerçekleşen olay / oluşum
  - Komşu iller arasında karşılaştırma
  - Bir bölge dahilindeki iller sorgusu
- `harita_il` değeri **mutlaka** `data/iller.json`'daki `slug` alanıyla birebir eşleşecek

---

## 🏗️ AŞAMA 2 — Soru Kökü ve Format Tasarımı

### 2.1 ÖSYM Soru Uzunluk Standardı

ÖSYM soruları **kısa ve net öncüllüdür.** Gereksiz uzun cümle yasaktır.

| Format | Öncül Uzunluğu | Örnek |
|--------|---------------|-------|
| Doğrudan Soru | 1 cümle | "Türkiye'nin en yüksek volkanik dağı hangisidir?" |
| Koşul-Sonuç | 2-3 cümle | "Bir dağın doğu yamaçları batı yamaçlarına göre daha az yağış alır. Bu dağın uzanış doğrultusu..." |
| Senaryo | 2-4 cümle | "Araştırmacı X bölgesinde Y gözlemlemiştir. Buna göre..." |
| I-II-III | Gövde + 3 önerme | Aşağıda detaylı |

**Soru kökü maksimum 4 cümle olacak. 5 cümleyi geçmek yasaktır.**

### 2.2 ÖSYM Kalıpları (6 Format)

**Kalıp A — Doğrudan Sorgulama:**
```
Türkiye'de kıvrım dağlarının uzandığı bölgede aşağıdaki illerden hangisi yer alır?
```

**Kalıp B — Neden-Sonuç:**
```
Türkiye'de Karadeniz kıyısındaki dağların doğu-batı doğrultusunda uzanması
aşağıdaki sonuçlardan hangisine yol açar?
```

**Kalıp C — Özellik Karşılaştırma:**
```
Uludağ ile Ağrı Dağı karşılaştırıldığında, aşağıdakilerden hangisi
yalnızca Ağrı Dağı için söylenebilir?
```

**Kalıp D — Senaryo:**
```
Türkiye'의 batısından doğusuna doğru gidildikçe dağların yüksekliği
giderek artmaktadır. Bu durum aşağıdakilerden hangisinin sonucudur?
```

**Kalıp E — Hariç Tutma:**
```
Aşağıdaki dağlardan hangisi oluş bakımından diğerlerinden farklıdır?
```

**Kalıp F — I, II, III Hangisi Doğrudur ⭐ (ÖSYM'nin en sık kullandığı format!):**
```
Türkiye'deki volkanik dağlarla ilgili,
I. Ağrı Dağı, aynı zamanda Türkiye'nin en yüksek noktasıdır.
II. Erciyes Dağı, İç Anadolu Bölgesi'nde yer alır.
III. Süphan Dağı, tektonik kökenli bir dağdır.
yargılarından hangileri doğrudur?
```
→ Şıklar: `A) Yalnız I` `B) Yalnız III` `C) I ve II` `D) II ve III` `E) I, II ve III`

**Kalıp G — Tablolu/Listeleme:**
```
Aşağıda verilen dağ-bölge eşleşmelerinden hangisi yanlıştır?
```
→ Her şık bir eşleşme içerir: `A) Ağrı Dağı — Doğu Anadolu`

### 2.3 Kalıp F Üretim Kuralları (I-II-III)

- Her chunk'ta **en az 5 adet** Kalıp F sorusu zorunludur
- I, II, III önermelerinden **tam olarak 2 tanesi doğru** ya da **tam olarak 1 tanesi doğru** ya da **tamamı doğru** şeklinde kurgu yapılacak
- Her önerme **bağımsız bir bilgi** içerecek (önerme A'yı bilmek önerme B'yi çözmeye yardımcı olmayacak)
- Şık kombinasyonları: `Yalnız I` / `Yalnız II` / `Yalnız III` / `I ve II` / `I ve III` / `II ve III` / `I, II ve III`
- Doğru cevap kombinasyonu chunk içinde çeşitlendirilecek (hepsi "I ve II" olamaz)

### 2.4 Akademik Terminoloji Ölçüsü

ÖSYM terminolojiyi **doğal akış içinde** kullanır, her cümlede değil.

✅ **DOĞRU kullanım (ÖSYM tarzı):**
> "Ege Bölgesi'nde dağların kıyıya dik (kuzey-güney) uzanması, iç bölgelere Akdeniz etkisinin girmesini kolaylaştırmaktadır."

❌ **YANLIŞ kullanım (aşırı akademik):**
> "Ege Bölgesi'nde kıyıya dik yönde uzanan horst tipolojisindeki tektonik kökenli orografik engellerin kontinentalite-maritimite dengesine olan epistemik etkisi..."

**Kural:** Bir cümlede **en fazla 2 teknik terim.** Doğal akışta kullanılmayan terim atılacak.

### 2.5 Yasaklı Söylemler
❌ 5 cümleyi geçen öncül  
❌ Her cümlede farklı akademik terim yığma  
❌ "Doğrudur/Yanlıştır" soruları (Kalıp F dışında)  
❌ Günlük konuşma dili  
❌ "Son yıllarda", "yakın zamanda" gibi belirsiz zaman ifadeleri  

---

## ✅ AŞAMA 3 — Çeldirici (Distractor) Tasarımı

### 3.1 Her Şık İçin Kural
- **Doğru şık:** Kesin, ölçülebilir, tartışmasız doğru
- **Yakın yanlış (2 adet):** Doğruya çok yakın ama kritik bir farkla yanlış
- **Uzak yanlış (1 adet):** Konuyla ilgili ama kolayca elenebilir
- **Tuzak şık (1 adet):** Doğru gibi görünen ama mantık hatası içeren

### 3.2 ÖSYM'nin Kullandığı Standart Tuzaklar
| Tuzak Türü | Açıklama |
|------------|---------|
| Enlem-Yükselti Karıştırma | Batı→Doğu sıcaklık değişimi (yükselti) ile Güney→Kuzey değişimini (enlem) birbirine karıştırma |
| Jeolojik Zaman Hatalı Eşleştirme | Linyit → 3. Zaman, Taşkömürü → 1. Zaman ilişkisini karıştırma |
| Masif-Kıvrım Karıştırma | Masif arazileri kıvrım dağı sistemiyle aynıymış gibi sunma |
| KOP-DOKAP-GAP il karıştırma | Kalkınma projesinin kapsamı dışındaki ili içindeymiş gibi sunma |
| Mikroklima-Makroklima Karıştırma | Iğdır, Artvin Çoruh gibi mikroklimaları genel iklim kuralıymış gibi sunma |

---

## 🖼️ AŞAMA 4 — Görsel Soru Protokolü (Opsiyonel, %25 hedef)

Her 4 soruda bir görsel soru üretilecek. Görsel soru üretimi için:

### 4.1 gorsel Alanı Format Kuralı
```
"gorsel": "<konu_slug>/<soru_id>.svg"
```
Örnek: `"gorsel": "daglar/daglar-003.svg"`

### 4.2 gorsel_veri Alanı Kuralı
```json
"gorsel_veri": {
  "I": "<il_slug>",
  "II": "<il_slug>",
  "III": "<il_slug>",
  "IV": "<il_slug>",
  "V": "<il_slug>"
}
```
- Romen rakamları **I, II, III, IV, V** şeklinde (büyük harf)
- İl slug değerleri `data/iller.json`'dan alınacak
- Minimum 3, maksimum 5 bölge işaretlenecek

### 4.3 Görsel Soru Kökü Kalıpları
```
"Yukarıdaki Türkiye haritasında I, II, III, IV ve V numaralı alanlar gösterilmiştir.
Bu alanların hangisinde [özellik] bulunmaktadır?"
```
```
"Haritada işaretlenen alanların tamamı için ortak olan özellik aşağıdakilerden hangisidir?"
```

---

## 📝 AŞAMA 5 — Açıklama (aciklama) Yazım Standartı

Her açıklama aşağıdaki 3 bölümden oluşacak:

**Bölüm 1 — Doğru Cevabın Gerekçesi** (2-3 cümle)
> "C şıkkı doğrudur çünkü..."

**Bölüm 2 — Yanlış Şıkların Analizi** (her şık için 1 cümle)
> "A şıkkı yanlıştır zira...; B şıkkı yanlıştır zira...; D şıkkı..."

**Bölüm 3 — Kural/İlke Özeti** (1 cümle, opsiyonel)
> "Genel kural olarak..."

**Minimum açıklama uzunluğu:** 80 kelime  
**Maksimum açıklama uzunluğu:** 250 kelime  

---

## 🔍 AŞAMA 6 — Öz-Doğrulama Kontrol Listesi

Soru üretildikten sonra agent **her soru için** şu kontrolleri yapacak:

```
[ ] ID benzersiz ve doğru formatta (örn: daglar-001)
[ ] 5 şık mevcut (A, B, C, D, E)
[ ] dogru alanı siklar listesindeki bir değerle birebir eşleşiyor
[ ] harita_il değeri iller.json'daki slug ile eşleşiyor (veya null)
[ ] gorsel varsa gorsel_veri de mevcut
[ ] gorsel_veri'deki tüm slug'lar iller.json'dan
[ ] aciklama 80 kelimeden uzun
[ ] Soru kökünde akademik terminoloji kullanılmış
[ ] Çeldirici tuzak içeriyor (zorluk "zor" ise zorunlu)
[ ] Bilgi turkiye_cografya.json ile çelişmiyor
```

---

## 📦 AŞAMA 7 — Çıktı Formatı (Kesin Şema)

```json
[
  {
    "id": "daglar-001",
    "soru": "Soru metni. Birden fazla paragraf içeriyorsa \\n\\n ile ayrılır.",
    "siklar": [
      "A) Seçenek metni",
      "B) Seçenek metni",
      "C) Seçenek metni",
      "D) Seçenek metni",
      "E) Seçenek metni"
    ],
    "dogru": "C) Seçenek metni",
    "aciklama": "Minimum 80 kelimelik akademik açıklama. Doğru şık gerekçesi + yanlış şıkların analizi.",
    "harita_il": "kayseri",
    "zorluk": "orta",
    "gorsel": "daglar/daglar-001.svg",
    "gorsel_veri": {
      "I": "agri",
      "II": "kayseri",
      "III": "erzurum",
      "IV": "van",
      "V": "bitlis"
    }
  }
]
```

**Görsel olmayan sorularda:**
```json
"gorsel": null,
"gorsel_veri": null
```

---

## ⚠️ KESİN YASAKLAR

1. **Koordinat uydurmak yasaktır.** Tüm koordinatlar `turkiye_cografya.json`'dan alınacak.
2. **Sahte il slug üretmek yasaktır.** Yalnızca `iller.json`'daki slug değerleri kullanılacak.
3. **Cevap anahtarı belirsizliği yasaktır.** `dogru` alanı `siklar` listesindeki bir değerle kelimesi kelimesine eşleşecek.
4. **Tek bir doğru cevap zorunludur.** İki şık da doğru olabilecek sorular üretilemez.
5. **ID çakışması yasaktır.** Her soru benzersiz bir ID taşıyacak.
6. **Eksik alan yasaktır.** `gorsel_veri` olmadan `gorsel` alanı doldurulamaz.
