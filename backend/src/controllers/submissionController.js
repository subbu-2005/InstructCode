import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import { runAllTests, calculatePoints } from "../services/testRunner.js";
import { updateUserStats } from "../services/statsService.js";

/**
 * Submission Controller
 * Handles code submissions and test validation
 */

/**
 * Submit code for a problem
 * @route POST /api/problems/:id/submit
 */
export const submitCode = async (req, res) => {
    try {
        const { id: problemId } = req.params;
        const { code, language } = req.body;
        const userId = req.user._id;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required",
            });
        }

        // Get problem with test cases
        const problem = await Problem.findOne({ id: problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        // Check if problem has test cases
        if (!problem.testCases || problem.testCases.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No test cases available for this problem",
            });
        }

        console.log(`🧪 Running tests for problem: ${problem.title}`);

        // Run all tests
        const testResults = await runAllTests(
            language,
            code,
            problem.testCases,
            problem.timeLimit
        );

        // Calculate points if accepted
        let pointsEarned = 0;
        if (testResults.status === "Accepted") {
            // Get average runtime for this problem (simplified - using 1000ms as baseline)
            const avgRuntime = 1000;
            pointsEarned = calculatePoints(
                problem.difficulty,
                testResults.status,
                testResults.runtime,
                avgRuntime
            );

            // Update user points
            await User.findByIdAndUpdate(userId, {
                $inc: { points: pointsEarned },
            });

            // Update user stats (solved problems, streaks, etc.)
            await updateUserStats(userId, problemId, problem.difficulty);
        }

        // Create submission record
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: testResults.status,
            testResults: testResults.testResults,
            totalTests: testResults.totalTests,
            passedTests: testResults.passedTests,
            runtime: testResults.runtime,
            pointsEarned,
        });

        console.log(`✅ Submission complete: ${testResults.status} (${testResults.passedTests}/${testResults.totalTests} tests passed)`);

        res.status(200).json({
            success: true,
            message: "Code submitted successfully",
            data: {
                submissionId: submission._id,
                status: testResults.status,
                testResults: testResults.testResults,
                totalTests: testResults.totalTests,
                passedTests: testResults.passedTests,
                runtime: testResults.runtime,
                pointsEarned,
            },
        });
    } catch (error) {
        console.error("❌ Error submitting code:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit code",
            error: error.message,
        });
    }
};

/**
 * Get user's submissions for a problem
 * @route GET /api/problems/:id/submissions
 */
export const getUserSubmissions = async (req, res) => {
    try {
        const { id: problemId } = req.params;
        const userId = req.user._id;

        const submissions = await Submission.find({ userId, problemId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("-code"); // Don't return code in list

        res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error("❌ Error getting submissions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get submissions",
            error: error.message,
        });
    }
};

/**
 * Get a specific submission
 * @route GET /api/submissions/:id
 */
export const getSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const submission = await Submission.findOne({ _id: id, userId });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        res.status(200).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        console.error("❌ Error getting submission:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get submission",
            error: error.message,
        });
    }
};
