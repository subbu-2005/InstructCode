import axios from "../lib/axios";

/**
 * AI API
 */

// Generate problem with AI (for admin)
export const generateProblemWithAI = async (prompt) => {
    const response = await axios.post("/admin/ai/generate-problem", { prompt });
    return response.data;
};

// Generate test cases with AI (for admin)
export const generateTestCasesWithAI = async (problemTitle, problemDescription, count = 5) => {
    const response = await axios.post("/admin/ai/generate-testcases", {
        problemTitle,
        problemDescription,
        count,
    });
    return response.data;
};

// Get hint for a problem
export const getHint = async (problemId, code, hintLevel = 1) => {
    const response = await axios.post("/ai/hint", { problemId, code, hintLevel });
    return response.data;
};

// Get code review
export const getCodeReview = async (problemId, code, language) => {
    const response = await axios.post("/ai/review", { problemId, code, language });
    return response.data;
};

// Get complexity analysis
export const getComplexityAnalysis = async (code, language) => {
    const response = await axios.post("/ai/complexity", { code, language });
    return response.data;
};
