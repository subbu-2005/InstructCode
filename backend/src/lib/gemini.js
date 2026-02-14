import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env.js";

/**
 * Google Gemini AI Service
 * Handles AI-powered problem generation, hints, and code review
 */

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
// Using gemini-3-flash-preview - the latest Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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
  }
}

Make the problem interesting, well-structured, and appropriate for the difficulty level.`;

  try {
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}\n\nGenerate the problem JSON:`;

    const result = await model.generateContent(fullPrompt);
    let responseText = result.response.text();

    // Clean up the response - remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Remove any leading/trailing whitespace
    responseText = responseText.trim();

    // Try to find JSON object in the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
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

    console.log(`✅ Problem generated: ${problemData.title}`);

    return problemData;
  } catch (error) {
    console.error("❌ AI generation error:", error);
    throw new Error(`Failed to generate problem: ${error.message}`);
  }
}

/**
 * Generate a progressive hint for a problem
 * @param {string} problemTitle - The problem title
 * @param {string} problemDescription - The problem description
 * @param {string} userCode - User's current code (optional)
 * @param {number} hintLevel - Hint level (1=subtle, 2=moderate, 3=detailed)
 * @returns {Promise<string>} - The hint
 */
export async function generateHint(problemTitle, problemDescription, userCode = "", hintLevel = 1) {
  try {
    const hintPrompts = {
      1: "Give a very subtle hint that guides thinking without revealing the solution. Focus on the approach or data structure to consider.",
      2: "Give a moderate hint that suggests a specific algorithm or technique, but don't provide code.",
      3: "Give a detailed hint that outlines the step-by-step approach, but still let the user implement it."
    };

    const prompt = `
Problem: ${problemTitle}
Description: ${problemDescription}

${userCode ? `User's current code:\n${userCode}\n` : ""}

${hintPrompts[hintLevel] || hintPrompts[1]}

Provide a helpful, encouraging hint in 2-3 sentences.
`;

    const result = await model.generateContent(prompt);
    const hint = result.response.text().trim();

    console.log(`💡 Hint generated (level ${hintLevel})`);
    return hint;
  } catch (error) {
    console.error("❌ AI hint generation error:", error);
    throw new Error(`Failed to generate hint: ${error.message}`);
  }
}

/**
 * Review user's code and provide feedback
 * @param {string} problemTitle - The problem title
 * @param {string} problemDescription - The problem description
 * @param {string} code - User's code
 * @param {string} language - Programming language
 * @returns {Promise<Object>} - Code review with suggestions
 */
export async function reviewCode(problemTitle, problemDescription, code, language) {
  try {
    const prompt = `
You are an expert code reviewer. Review this solution for the following problem:

Problem: ${problemTitle}
Description: ${problemDescription}

Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Provide a code review in JSON format with the following structure:
{
  "correctness": "Assessment of correctness (1-2 sentences)",
  "timeComplexity": "Time complexity (e.g., O(n), O(n²))",
  "spaceComplexity": "Space complexity (e.g., O(1), O(n))",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "bugs": ["bug 1", "bug 2"] or [],
  "overallScore": 7 (out of 10)
}

Be constructive and encouraging. Focus on helping the user learn.
Return ONLY the JSON, no markdown formatting.
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Clean up the response
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const review = JSON.parse(responseText);
    console.log("🔍 Code review generated");
    return review;
  } catch (error) {
    console.error("❌ AI code review error:", error);
    throw new Error(`Failed to review code: ${error.message}`);
  }
}

/**
 * Analyze code complexity
 * @param {string} code - User's code
 * @param {string} language - Programming language
 * @returns {Promise<Object>} - Complexity analysis
 */
export async function analyzeComplexity(code, language) {
  try {
    const prompt = `
Analyze the time and space complexity of this code:

Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Provide analysis in JSON format:
{
  "timeComplexity": "O(...)",
  "timeExplanation": "Brief explanation of time complexity",
  "spaceComplexity": "O(...)",
  "spaceExplanation": "Brief explanation of space complexity",
  "canOptimize": true/false,
  "optimizationHint": "Hint for optimization if applicable"
}

Return ONLY the JSON, no markdown formatting.
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Clean up the response
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const analysis = JSON.parse(responseText);
    console.log("📊 Complexity analysis generated");
    return analysis;
  } catch (error) {
    console.error("❌ AI complexity analysis error:", error);
    throw new Error(`Failed to analyze complexity: ${error.message}`);
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
