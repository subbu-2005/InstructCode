import { connectDB } from "../lib/db.js";
import Problem from "../models/Problem.js";

/**
 * Fix Neon Path Traversal Problem
 * Adds proper test cases to the problem
 */

async function fixNeonPathTraversal() {
    try {
        console.log("🔧 Fixing Neon Path Traversal problem...");

        await connectDB();

        // Find the problem
        const problem = await Problem.findOne({ id: "neon-path-traversal" });

        if (!problem) {
            console.log("❌ Problem 'neon-path-traversal' not found");
            process.exit(1);
        }

        console.log(`✅ Found problem: ${problem.title}`);

        // Update with correct test cases
        problem.testCases = [
            {
                input: "[[3,4,6],[2,3,5]], 2",
                expectedOutput: "3",
                hidden: false,
            },
            {
                input: "[[1,10],[10,1]], 5",
                expectedOutput: "0",
                hidden: false,
            },
            {
                input: "[[1,2,3],[4,5,6],[7,8,9]], 1",
                expectedOutput: "2",
                hidden: true,
            },
            {
                input: "[[5]], 0",
                expectedOutput: "1",
                hidden: true,
            },
        ];

        // Clear the incorrect expectedOutput fields
        problem.expectedOutput = {
            javascript: "",
            python: "",
            java: "",
        };

        await problem.save();

        console.log("✅ Problem updated successfully!");
        console.log(`   - Added ${problem.testCases.length} test cases`);
        console.log(`   - ${problem.testCases.filter(tc => !tc.hidden).length} visible test cases`);
        console.log(`   - ${problem.testCases.filter(tc => tc.hidden).length} hidden test cases`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing problem:", error);
        process.exit(1);
    }
}

fixNeonPathTraversal();
