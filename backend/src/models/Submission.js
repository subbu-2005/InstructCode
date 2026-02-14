import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        problemId: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
            enum: ["javascript", "python", "java"],
        },
        status: {
            type: String,
            required: true,
            enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", "Compilation Error"],
        },
        testResults: [
            {
                testNumber: Number,
                passed: Boolean,
                input: String,
                expectedOutput: String,
                actualOutput: String,
                runtime: Number, // in milliseconds
                error: String,
            },
        ],
        totalTests: {
            type: Number,
            required: true,
        },
        passedTests: {
            type: Number,
            required: true,
        },
        runtime: Number, // average runtime in ms
        memory: Number, // in KB
        pointsEarned: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Index for faster queries
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ userId: 1, status: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
