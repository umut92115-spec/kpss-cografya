const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = "AIzaSyBROIQec5-VgxQ3eRbYfC4aC-2yHgbpBSA";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
listModels();
