import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    // Bookmarked problems with notes and tags
    bookmarkedProblems: [
      {
        problemId: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          default: "",
        },
        tags: {
          type: [String],
          default: [],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // User statistics for dashboard
    stats: {
      totalSolved: {
        type: Number,
        default: 0,
      },
      easySolved: {
        type: Number,
        default: 0,
      },
      mediumSolved: {
        type: Number,
        default: 0,
      },
      hardSolved: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastSolvedDate: Date,
      solvedProblems: [
        {
          problemId: String,
          difficulty: String,
          solvedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    // Gamification - points earned from solving problems
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
