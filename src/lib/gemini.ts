import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateKpssQuestion(content: string, topic: string, availableImages: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Sen bir KPSS Coğrafya uzmanısın. Aşağıdaki konu içeriğine dayanarak ÖZGÜN bir soru üret.

KONU İÇERİĞİ:
${content}

KURALLAR:
1. Soru kökü net ve KPSS tarzında olmalı.
2. 4 şık (A, B, C, D) olmalı.
3. Sadece KONU İÇERİĞİNDEKİ bilgileri kullan, dışarıdan bilgi ekleme.
4. Telegram Anket kısıtları:
   - Soru (question) max 300 karakter.
   - Şıklar (options) max 100 karakter.
   - Açıklama (explanation) max 200 karakter.
5. Eğer konu bir görselle (infografik) desteklenebilecekse, aşağıdakilerden EN UYGUNUNU seç:
   Mevcut Görseller: ${availableImages.join(", ")}
   Uygun görsel yoksa "null" döndür.

JSON FORMATINDA CEVAP VER:
{
  "question": "Soru metni...",
  "options": ["A", "B", "C", "D"],
  "correct_index": 0, // 0-3 arası
  "explanation": "Doğru cevap neden bu? Kısa ve öz...",
  "difficulty": "easy | medium | hard",
  "suggested_image": "image-name.png veya null",
  "category": "${topic}"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // JSON temizleme (bazı modeller markdown blockları ekleyebiliyor)
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
}
