# 🧭 KPSS Coğrafya Botu — Kurulum Rehberi

Bu rehber, Gemini AI destekli otomatik Telegram soru üretim sistemini nasıl aktif edeceğinizi adım adım açıklar.

## 🛠️ Hazırlık: Gerekli Anahtarlar

Sistemin çalışması için aşağıdaki 4 anahtara ihtiyacınız var:

1.  **Gemini API Key:** [Google AI Studio](https://aistudio.google.com/app/apikey) adresinden ücretsiz oluşturun.
2.  **Telegram Bot Token:** [@BotFather](https://t.me/botfather) üzerinden `/newbot` diyerek botunuzu oluşturun ve token'ı alın.
3.  **Telegram Chat ID:** Botu kanalınıza yönetici yapın. Bir mesajı [@getmyid_bot](https://t.me/getmyid_bot)'a ileterek `-100` ile başlayan kanal ID'sini öğrenin.
4.  **GitHub Token (PAT):** 
    - [GitHub Settings > Tokens](https://github.com/settings/tokens?type=beta) sayfasına gidin.
    - Bu repo için **"Contents: Read & Write"** izni olan bir token oluşturun.

---

## 🚀 1. Adım: Vercel Ayarları

Projeniz Vercel'e bağlıysa şu adımları izleyin:

1.  Vercel Panel > **Settings > Environment Variables** yoluna gidin.
2.  Aşağıdaki değişkenleri tek tek ekleyin:
    - `GEMINI_API_KEY`
    - `TELEGRAM_BOT_TOKEN`
    - `TELEGRAM_CHAT_ID`
    - `GITHUB_TOKEN`
    - `GITHUB_OWNER` (GitHub kullanıcı adınız)
    - `GITHUB_REPO` (Repo adınız, örn: `cografya`)
    - `CRON_SECRET` (Rastgele uzun bir şifre belirleyin)
    - `NEXT_PUBLIC_SITE_URL` (Sitenizin URL'i, örn: `https://kpsscografya.com.tr`)

---

## ⏰ 2. Adım: Zamanlayıcıyı (Cron) Aktif Etme

Sistem `vercel.json` içindeki şu ayar sayesinde her saat başı çalışacak şekilde hazırlandı:
```json
"crons": [{ "path": "/api/cron", "schedule": "0 * * * *" }]
```
Vercel projenizi **Redeploy** ettiğinizde "Cron Jobs" sekmesinde bu görevi görebilirsiniz.

---

## 🧪 3. Adım: İlk Test

Her şeyin doğru çalıştığını kontrol etmek için saati beklemenize gerek yok:

1.  Tarayıcınızda şu adresi açın (Değerleri kendinize göre değiştirin):
    `https://siteniz.vercel.app/api/cron`
2.  Sayfayı yenilediğinizde **401 Unauthorized** hatası almalısınız (Bu, güvenliğin çalıştığını gösterir).
3.  Tam test için şu komutu terminalinizde çalıştırın:
    ```bash
    curl -X GET "https://siteniz.vercel.app/api/cron" -H "Authorization: Bearer BELİRLEDİĞİNİZ_CRON_SECRET"
    ```
4.  Telegram kanalınıza mesaj gelmişse ve GitHub'da `data/quiz/` klasöründeki dosyalar güncellenmişse sistem **BAŞARILI** demektir.

---

## 📂 Dosya Yapısı ve Mantığı

- **Konu Kaynağı:** `content/konu/*.mdx` dosyalarındaki bilgiler taranır.
- **Görseller:** `data/image-map.json` üzerinden konuya uygun harita/diyagram seçilir.
- **Sıralama:** `data/rotation.json` dosyası hangi konunun sırada olduğunu hatırlar.
- **Kayıt:** Üretilen her soru `data/quiz/[konu].json` içine eklenir, böylece sitenizdeki soru bankası kendiliğinden büyür.

---

## 💡 İpuçları

- **Görsel Ekleme:** Yeni bir harita eklerseniz `public/images/konu/` içine atın ve `data/image-map.json` dosyasına ismini kaydedin.
- **Soru Tarzı:** Soruların tonunu değiştirmek isterseniz `src/lib/gemini.ts` içindeki "Prompt" kısmını düzenleyebilirsiniz.
