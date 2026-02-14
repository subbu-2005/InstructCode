import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env.js";

/**
 * Google Gemini AI Service
 * Handles AI-powered problem generation, hints, code review, and test case generation
 */

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
// Using gemini-2.0-flash-exp - the latest Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

/**
 * Generate a coding problem using AI
 * @param {string} prompt - User's prompt describing the problem
 * @returns {Promise<Object>} Generated problem data
 */
export async function generateProblem(prompt) {
    const systemPrompt = `You are an expert coding problem creator for a LeetCode-style platform. 
Generate a complete coding problem based on the user's request.

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations.

The JSON structure must be:
{
  "title": "Problem Title",
  "id": "url-friendly-slug",
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "Array • Hash Table • Two Pointers",
  "description": {
    "text": "Detailed problem description...",
    "notes": ["Additional note 1", "Additional note 2"]
  },
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9"
  ],
  "starterCode": {
    "javascript": "function problemName(params) {\\n  // Write your solution here\\n}",
    "python": "def problem_name(params):\\n    # Write your solution here\\n    pass",
    "java": "class Solution {\\n    public ReturnType problemName(ParamType params) {\\n        // Write your solution here\\n    }\\n}"
  },
  "testCases": [
    {
      "input": "[2,7,11,15], 9",
      "expectedOutput": "[0,1]",
      "explanation": "Basic test case",
      "isHidden": false
    }
  ],
  "timeLimit": 2000,
  "memoryLimit": 256
}

Make the problem interesting, well-structured, and appropriate for the difficulty level.
Include at least 3-5 test cases with both visible and hidden cases.`;

    try {
        const fullPrompt = `${systemPrompt}\\n\\nUser Request: ${prompt}\\n\\nGenerate the problem JSON:`;

        const result = await model.generateContent(fullPrompt);
        let responseText = result.response.text();

        // Clean up the response - remove markdown code blocks if present
        responseText = responseText.replace(/```json\\n?/g, "").replace(/```\\n?/g, "").trim();

        // Remove any leading/trailing whitespace
        responseText = responseText.trim();

        // Try to find JSON object in the response
        const jsonMatch = responseText.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
            responseText = jsonMatch[0];
        }

        console.log("🤖 AI Response received, parsing JSON...");

        const problemData = JSON.parse(responseText);

        // Validate required fields
        if (!problemData.title || !problemData.difficulty) {
            throw new Error("Generated problem missing required fields");
        }

        // Ensure id is URL-friendly
        if (!problemData.id) {
            problemData.id = problemData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        // Ensure testCases exist
        if (!problemData.testCases) {
            problemData.testCases = [];
        }

        // Ensure time and memory limits
        if (!problemData.timeLimit) problemData.timeLimit = 2000;
        if (!problemData.memoryLimit) problemData.memoryLimit = 256;

        console.log(`✅ Problem generated: ${problemData.title}`);

        return problemData;
    } catch (error) {
        console.error("❌ AI generation error:", error);
        throw new Error(`Failed to generate problem: ${error.message}`);
    }
}

/**
 * Generate test cases for a problem using AI
 * @param {string} problemTitle - Problem title
 * @param {string} problemDescription - Problem description
 * @param {number} count - Number of test cases to generate (default: 5)
 * @returns {Promise<Array>} Generated test cases
 */
export async function generateTestCases(problemTitle, problemDescription, count = 5) {
    try {
        const prompt = `
Generate ${count} comprehensive test cases for this coding problem:

Problem: ${problemTitle}
Description: ${problemDescription}

Return ONLY valid JSON array, no markdown formatting, no code blocks.

Format:
[
  {
    "input": "actual input value (e.g., [2,7,11,15], 9)",
    "expectedOutput": "expected output value (e.g., [0,1])",
    "explanation": "brief explanation of this test case",
    "isHidden": false
  }
]

Include:
- 2-3 basic test cases (isHidden: false)
- 2-3 edge cases (isHidden: true) - empty arrays, large numbers, negative numbers, etc.
- Make inputs realistic and test different scenarios
- Ensure outputs are correct

Return ONLY the JSON array, nothing else.
`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        // Clean up response
        responseText = responseText.replace(/```json\\n?/g, "").replace(/```\\n?/g, "").trim();

        // Try to find JSON array
        const jsonMatch = responseText.match(/\\[[\\s\\S]*\\]/);
        if (jsonMatch) {
            responseText = jsonMatch[0];
        }

        const testCases = JSON.parse(responseText);

        if (!Array.isArray(testCases)) {
            throw new Error("Generated test cases is not an array");
        }

        console.log(`✅ Generated ${testCases.length} test cases`);
        return testCases;
    } catch (error) {
        console.error("❌ AI test case generation error:", error);
        throw new Error(`Failed to generate test cases: ${error.message}`);
    }
}

// ... rest of the file remains the same (generateHint, reviewCode, analyzeComplexity, generateStarterCode)
