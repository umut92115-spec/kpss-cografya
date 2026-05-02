const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBROIQec5-VgxQ3eRbYfC4aC-2yHgbpBSA";
const genAI = new GoogleGenerativeAI(API_KEY);

const candidateModels = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-pro-latest"
];

async function testModel(modelName) {
    console.log(`\n🔍 Deneniyor: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    try {
        const result = await model.generateContent("Merhaba, kısa bir test cevabı ver.");
        const response = await result.response;
        console.log(`   ✅ BAŞARILI: "${response.text().substring(0, 30)}..."`);
        return true;
    } catch (error) {
        console.log(`   ❌ BAŞARISIZ: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log("🚀 GEMINI MODEL KOTA TESTLERİ BAŞLADI\n");
    for (const name of candidateModels) {
        await testModel(name);
    }
}

runTests();
