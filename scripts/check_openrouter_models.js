const OpenAI = require("openai");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
});

async function listModels() {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  const data = await response.json();
  const freeModels = data.data.filter(m => m.id.includes("free"));
  console.log("FREE MODELS ON OPENROUTER:");
  freeModels.forEach(m => console.log(`- ${m.id}`));
}

listModels();
