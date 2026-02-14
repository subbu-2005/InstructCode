import mongoose from "mongoose";

/**
 * Problem Schema
 * Stores coding problems with multi-language support
 */
const problemSchema = new mongoose.Schema(
    {
        // Unique identifier (URL-friendly slug, e.g., "two-sum")
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        // Problem title
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // Difficulty level
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },
        // Category/tags (e.g., "Array • Hash Table")
        category: {
            type: String,
            default: "",
            trim: true,
        },
        // Problem description
        description: {
            text: {
                type: String,
                required: true,
            },
            notes: {
                type: [String],
                default: [],
            },
        },
        // Example test cases
        examples: {
            type: [
                {
                    input: {
                        type: String,
                        required: false,
                        default: "",
                    },
                    output: {
                        type: String,
                        required: false,
                        default: "",
                    },
                    explanation: {
                        type: String,
                        required: false,
                        default: "",
                    },
                },
            ],
            required: false,
            default: [],
        },
        // Problem constraints
        constraints: {
            type: [String],
            required: false,
            default: [],
        },
        // Starter code for each language
        starterCode: {
            javascript: {
                type: String,
                default: "",
            },
            python: {
                type: String,
                default: "",
            },
            java: {
                type: String,
                default: "",
            },
        },
        // Expected output for test cases
        expectedOutput: {
            javascript: {
                type: String,
                default: "",
            },
            python: {
                type: String,
                default: "",
            },
            java: {
                type: String,
                default: "",
            },
        },
        // Test cases for validation (some hidden from users)
        testCases: {
            type: [
                {
                    input: String,
                    expectedOutput: String,
                    hidden: {
                        type: Boolean,
                        default: false, // false = visible, true = hidden
                    },
                },
            ],
            default: [],
        },
        // Performance limits
        timeLimit: {
            type: Number,
            default: 3000, // 3 seconds in ms
        },
        memoryLimit: {
            type: Number,
            default: 128000, // 128 MB in KB
        },
    },
    { timestamps: true } // createdAt, updatedAt
);

// Index for faster queries
problemSchema.index({ difficulty: 1 });
problemSchema.index({ id: 1 });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
