const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBJ_1WbbPjsWrQZ477rMbHwE4_qXX8siH4";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testKey() {
    console.log("🔍 Yeni anahtar test ediliyor...");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    
    try {
        const result = await model.generateContent("Merhaba, çalışıyor musun?");
        const response = await result.response;
        console.log(`   ✅ BAŞARILI: "${response.text().substring(0, 30)}..."`);
    } catch (error) {
        console.log(`   ❌ BAŞARISIZ: ${error.message}`);
    }
}

testKey();
