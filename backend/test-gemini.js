import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("🔑 API Key:", API_KEY ? "✓ Set" : "✗ Missing");

const genAI = new GoogleGenerativeAI(API_KEY);

// Test different model names
const modelsToTest = [
    "gemini-3-flash-preview",  // Latest model from documentation
    "gemini-2.0-flash-exp",
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} works! Response:`, text.substring(0, 50));
        return true;
    } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
        return false;
    }
}

async function main() {
    console.log("\n🚀 Testing Gemini API models...\n");

    for (const modelName of modelsToTest) {
        const works = await testModel(modelName);
        if (works) {
            console.log(`\n✅ WORKING MODEL FOUND: ${modelName}`);
            break;
        }
    }
}

main();
