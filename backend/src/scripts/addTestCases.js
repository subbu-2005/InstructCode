import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import { ENV } from "../lib/env.js";

/**
 * Add test cases to existing problems
 */

const testCasesData = {
    "two-sum": [
        {
            input: "[2,7,11,15]\n9",
            expectedOutput: "[0,1]",
            hidden: false
        },
        {
            input: "[3,2,4]\n6",
            expectedOutput: "[1,2]",
            hidden: false
        },
        {
            input: "[3,3]\n6",
            expectedOutput: "[0,1]",
            hidden: false
        },
        {
            input: "[1,5,3,7,8,9]\n12",
            expectedOutput: "[2,4]",
            hidden: true
        }
    ],
    "reverse-string": [
        {
            input: '["h","e","l","l","o"]',
            expectedOutput: '["o","l","l","e","h"]',
            hidden: false
        },
        {
            input: '["H","a","n","n","a","h"]',
            expectedOutput: '["h","a","n","n","a","H"]',
            hidden: false
        },
        {
            input: '["a"]',
            expectedOutput: '["a"]',
            hidden: true
        }
    ],
    "palindrome-number": [
        {
            input: "121",
            expectedOutput: "true",
            hidden: false
        },
        {
            input: "-121",
            expectedOutput: "false",
            hidden: false
        },
        {
            input: "10",
            expectedOutput: "false",
            hidden: false
        },
        {
            input: "12321",
            expectedOutput: "true",
            hidden: true
        }
    ]
};

async function addTestCases() {
    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(ENV.DB_URL);
        console.log("✅ Connected to MongoDB");

        for (const [problemId, testCases] of Object.entries(testCasesData)) {
            console.log(`\n📝 Adding test cases to: ${problemId}`);

            const result = await Problem.findOneAndUpdate(
                { id: problemId },
                {
                    $set: {
                        testCases,
                        timeLimit: 3000,
                        memoryLimit: 128000
                    }
                },
                { new: true }
            );

            if (result) {
                console.log(`✅ Added ${testCases.length} test cases to ${problemId}`);
            } else {
                console.log(`⚠️  Problem not found: ${problemId}`);
            }
        }

        console.log("\n🎉 Test cases added successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding test cases:", error);
        process.exit(1);
    }
}

addTestCases();
