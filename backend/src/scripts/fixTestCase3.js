import { connectDB } from "../lib/db.js";
import Problem from "../models/Problem.js";

/**
 * Fix Neon Path Traversal Test Case 3
 * The expected output for [[1,2,3],[4,5,6],[7,8,9]], k=1 should be 0, not 2
 */

async function fixTestCase3() {
    try {
        console.log("🔧 Fixing Neon Path Traversal test case 3...");

        await connectDB();

        const problem = await Problem.findOne({ id: "neon-path-traversal" });

        if (!problem) {
            console.log("❌ Problem not found");
            process.exit(1);
        }

        console.log(`✅ Found problem: ${problem.title}`);
        console.log(`Current test cases: ${problem.testCases.length}`);

        // Update test case 3 (index 2) with correct expected output
        if (problem.testCases[2]) {
            console.log(`\n📝 Test Case 3 (before):`);
            console.log(`   Input: ${problem.testCases[2].input}`);
            console.log(`   Expected: ${problem.testCases[2].expectedOutput}`);

            // The correct answer is 0, not 2
            problem.testCases[2].expectedOutput = "0";

            console.log(`\n✅ Test Case 3 (after):`);
            console.log(`   Input: ${problem.testCases[2].input}`);
            console.log(`   Expected: ${problem.testCases[2].expectedOutput}`);
        }

        await problem.save();

        console.log("\n✅ Test case fixed successfully!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

fixTestCase3();
