import { generateProblem, generateHint, reviewCode, analyzeComplexity, generateTestCases } from "../lib/gemini.js";
import Problem from "../models/Problem.js";

/**
 * AI Controller
 * Handles AI-powered features
 */

/**
 * Generate a coding problem using AI
 * @route POST /api/admin/ai/generate-problem
 */
export const generateProblemWithAI = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        console.log(`🤖 AI Generation Request: "${prompt}"`);

        // Generate problem using Gemini AI
        const problemData = await generateProblem(prompt);

        res.status(200).json({
            success: true,
            message: "Problem generated successfully",
            data: problemData,
        });
    } catch (error) {
        console.error("❌ Error generating problem with AI:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate problem with AI",
            error: error.message,
        });
    }
};

/**
 * Generate test cases for a problem using AI
 * @route POST /api/admin/ai/generate-testcases
 */
export const generateTestCasesWithAI = async (req, res) => {
    try {
        const { problemTitle, problemDescription, count = 5 } = req.body;

        if (!problemTitle || !problemDescription) {
            return res.status(400).json({
                success: false,
                message: "Problem title and description are required",
            });
        }

        console.log(`🧪 Generating ${count} test cases for: ${problemTitle}`);

        const testCases = await generateTestCases(problemTitle, problemDescription, count);

        res.status(200).json({
            success: true,
            message: "Test cases generated successfully",
            data: testCases,
        });
    } catch (error) {
        console.error("❌ Error generating test cases:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate test cases",
            error: error.message,
        });
    }
};

/**
 * Get a hint for a problem
 * @route POST /api/ai/hint
 */
export const getHint = async (req, res) => {
    try {
        const { problemId, code, hintLevel = 1 } = req.body;

        if (!problemId) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required",
            });
        }

        // Get problem details
        const problem = await Problem.findOne({ id: problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        console.log(`💡 Generating hint (level ${hintLevel}) for: ${problem.title}`);

        const hint = await generateHint(
            problem.title,
            problem.description.text,
            code || "",
            hintLevel
        );

        res.status(200).json({
            success: true,
            data: { hint, hintLevel },
        });
    } catch (error) {
        console.error("❌ Error generating hint:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate hint",
            error: error.message,
        });
    }
};

/**
 * Review user's code
 * @route POST /api/ai/review
 */
export const getCodeReview = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;

        if (!problemId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "Problem ID, code, and language are required",
            });
        }

        // Get problem details
        const problem = await Problem.findOne({ id: problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        console.log(`🔍 Reviewing code for: ${problem.title}`);

        const review = await reviewCode(
            problem.title,
            problem.description.text,
            code,
            language
        );

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        console.error("❌ Error reviewing code:", error);
        res.status(500).json({
            success: false,
            message: "Failed to review code",
            error: error.message,
        });
    }
};

/**
 * Analyze code complexity
 * @route POST /api/ai/complexity
 */
export const getComplexityAnalysis = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required",
            });
        }

        console.log(`📊 Analyzing complexity for ${language} code`);

        const analysis = await analyzeComplexity(code, language);

        res.status(200).json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        console.error("❌ Error analyzing complexity:", error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze complexity",
            error: error.message,
        });
    }
};

