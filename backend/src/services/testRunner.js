import { executeCode } from "../lib/piston.js";

/**
 * Test Runner Service
 * Runs code against test cases and validates output
 */

/**
 * Normalize output for comparison
 * Removes extra whitespace and standardizes format
 */
const normalizeOutput = (output) => {
    if (!output) return "";

    return output
        .toString()
        .trim()
        .split("\n")
        .map((line) =>
            line
                .trim()
                .replace(/\s+/g, " ")
                .replace(/\s*,\s*/g, ",")
        )
        .filter((line) => line.length > 0)
        .join("\n");
};

/**
 * Compare actual output with expected output
 */
const compareOutputs = (actual, expected) => {
    const normalizedActual = normalizeOutput(actual);
    const normalizedExpected = normalizeOutput(expected);
    return normalizedActual === normalizedExpected;
};

/**
 * Run code against a single test case
 */
export const runTestCase = async (language, code, testCase, timeLimit = 3000) => {
    const startTime = Date.now();

    try {
        // Execute code with test input
        const result = await executeCode(language, code, testCase.input);
        const runtime = Date.now() - startTime;

        // Check if execution was successful
        if (!result.success) {
            return {
                passed: false,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.error || "Execution failed",
                runtime,
                error: result.error,
            };
        }

        // Check time limit
        if (runtime > timeLimit) {
            return {
                passed: false,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.output,
                runtime,
                error: "Time Limit Exceeded",
            };
        }

        // Compare outputs
        const passed = compareOutputs(result.output, testCase.expectedOutput);

        return {
            passed,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: result.output,
            runtime,
            error: passed ? null : "Wrong Answer",
        };
    } catch (error) {
        return {
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: "",
            runtime: Date.now() - startTime,
            error: error.message,
        };
    }
};

/**
 * Run code against all test cases
 */
export const runAllTests = async (language, code, testCases, timeLimit = 3000) => {
    const results = [];
    let passedCount = 0;
    let totalRuntime = 0;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const result = await runTestCase(language, code, testCase, timeLimit);

        results.push({
            testNumber: i + 1,
            ...result,
        });

        if (result.passed) passedCount++;
        totalRuntime += result.runtime;
    }

    // Determine overall status
    let status;
    if (passedCount === testCases.length) {
        status = "Accepted";
    } else {
        // Check if any test had runtime error
        const hasRuntimeError = results.some((r) => r.error && r.error !== "Wrong Answer" && r.error !== "Time Limit Exceeded");
        const hasTimeLimit = results.some((r) => r.error === "Time Limit Exceeded");

        if (hasRuntimeError) {
            status = "Runtime Error";
        } else if (hasTimeLimit) {
            status = "Time Limit Exceeded";
        } else {
            status = "Wrong Answer";
        }
    }

    return {
        status,
        testResults: results,
        totalTests: testCases.length,
        passedTests: passedCount,
        runtime: Math.round(totalRuntime / testCases.length), // average runtime
    };
};

/**
 * Calculate points based on difficulty and performance
 */
export const calculatePoints = (difficulty, status, runtime, avgRuntime) => {
    if (status !== "Accepted") return 0;

    const basePoints = {
        Easy: 10,
        Medium: 25,
        Hard: 50,
    };

    let points = basePoints[difficulty] || 0;

    // Bonus for fast solutions (within 50% of average)
    if (runtime < avgRuntime * 0.5) {
        points += Math.round(points * 0.2); // 20% bonus
    }

    return points;
};
