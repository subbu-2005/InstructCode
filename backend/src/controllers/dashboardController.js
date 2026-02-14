import { getUserDashboardStats } from "../services/statsService.js";
import User from "../models/User.js";

/**
 * Dashboard Controller
 * Handles user dashboard and statistics
 */

/**
 * Get user dashboard stats
 * @route GET /api/dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const dashboardData = await getUserDashboardStats(userId);

        res.status(200).json({
            success: true,
            data: dashboardData,
        });
    } catch (error) {
        console.error("❌ Error getting dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get dashboard stats",
            error: error.message,
        });
    }
};

/**
 * Get leaderboard
 * @route GET /api/dashboard/leaderboard
 */
export const getLeaderboard = async (req, res) => {
    try {
        const { timeframe = "all" } = req.query; // all, daily, weekly, monthly

        let dateFilter = {};
        const now = new Date();

        if (timeframe === "daily") {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            dateFilter = { "stats.lastSolvedDate": { $gte: startOfDay } };
        } else if (timeframe === "weekly") {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);
            dateFilter = { "stats.lastSolvedDate": { $gte: startOfWeek } };
        } else if (timeframe === "monthly") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            dateFilter = { "stats.lastSolvedDate": { $gte: startOfMonth } };
        }

        const leaderboard = await User.find(dateFilter)
            .sort({ points: -1, "stats.totalSolved": -1 })
            .limit(100)
            .select("name profileImage points stats.totalSolved stats.currentStreak")
            .lean();

        // Add rank
        const leaderboardWithRank = leaderboard.map((user, index) => ({
            rank: index + 1,
            ...user,
        }));

        res.status(200).json({
            success: true,
            data: {
                timeframe,
                leaderboard: leaderboardWithRank,
            },
        });
    } catch (error) {
        console.error("❌ Error getting leaderboard:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get leaderboard",
            error: error.message,
        });
    }
};
