const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

async function main() {
  const prompt = `
Sen Türkiye'nin en iyi KPSS Coğrafya öğretmenlerinden birisin. Hedefimiz adaylara nokta atışı hap bilgiler vermek, asla genel geçer ansiklopedik veya "bölge ile benzerlik gösterir" gibi içi boş ifadeler kullanmamak.

Hedef İl: Antalya
Hedef Konu: Ticaret

Lütfen bu il ve konu kombinasyonu için YALNIZCA geçerli bir JSON objesi döndür. Markdown KULLANMA. JSON yapısı:

{
  "detay": "Antalya için Ticaret verileri yakında eklenecektir.",
  "kpss_notu": "Antalya ticaretinde turizm ve tarımsal üretimin (özellikle seracılık) ihracattaki büyük payına dikkat etmelisin. Liman ticareti de çok önemlidir.",
  "faqs": [], 
  "super_detay": {
    "title": "Antalya Ticaret — KPSS Coğrafya | kpsscografya.com.tr",
    "meta": "Antalya ticaret özellikleri, ihracat-ithalat yapısı ve liman ticareti. KPSS Coğrafya 2026 müfredatı için özel bilgiler.",
    "h1": "Antalya'da Ticaret: KPSS İçin Bilinmesi Gerekenler",
    "snippet": "Antalya ticareti, büyük ölçüde tarımsal üretime (yaş sebze meyve, turunçgil) ve seracılık ürünlerinin ihracatına dayanır. Turizm sektörünün canlandırdığı iç ticaret kapasitesi ve Antalya Limanı'nın lojistik önemi kentin ticari yapısının temelini oluşturur. Bu bilgiler 2026 KPSS Coğrafya müfredatına göre hazırlanmıştır.",
    "sections": [
      {
        "h2": "Antalya'da İhracat ve Tarımsal Ticaret",
        "content": "Buraya Antalya'nın ticareti ve ihracatı üzerine çok spesifik, gerçek coğrafi bilgi içeren bir paragraf yaz. Genel geçiş ifadelerinden kaçın.",
        "type": "text",
        "data": null
      },
      {
        "h2": "Serbest Bölge ve Liman Ticareti",
        "content": "Antalya Limanı'nın ve Serbest Bölge'nin ticaret üzerindeki etkisini anlatan, KPSS bağlamında gerçek bilgi veren bir paragraf yaz.",
        "type": "text",
        "data": null
      },
      {
        "h2": "Turizmin İç Ticarete Etkisi",
        "content": "Turizm faktörünün Antalya'daki iç ticareti nasıl şekillendirdiğini net bir şekilde açıkla.",
        "type": "text",
        "data": null
      }
    ],
    "faqs": [
      // EN AZ 5 TANE SIK SORULAN SORU. KPSS'de çıkabilecek veya konuyu öğretecek nitelikte özgün coğrafya soruları olsun.
      { "q": "Antalya ihracatında en büyük pay hangi sektöre aittir?", "a": "Antalya ihracatında en büyük payı tarım sektörü, özellikle yaş sebze, meyve ve örtü altı tarım (seracılık) ürünleri alır." },
      // Kalan 4 soruyu sen doldur
    ],
    "last_updated": "Mayıs 2026"
  },
  "onemli_not": "Son güncelleme: Mayıs 2026 | 2026 KPSS Coğrafya müfredatına göre hazırlanmıştır."
}

Yukarıdaki yapıya sadık kalarak, Antalya ve Ticaret ekseninde GERÇEKÇİ, DETAYLI ve NOKTA ATIŞI KPSS bilgilerinden oluşan bir JSON üret. Asla jenerik (her ile uyabilecek) kalıp cümleler kullanma.
`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (e) {
    console.error(e);
  }
}

main();
