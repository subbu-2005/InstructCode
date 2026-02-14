import User from "../models/User.js";

/**
 * Stats Service
 * Handles user statistics calculations
 */

/**
 * Update user stats after solving a problem
 */
export async function updateUserStats(userId, problemId, difficulty) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Check if problem already solved
        const alreadySolved = user.stats.solvedProblems.some(
            (p) => p.problemId === problemId
        );

        if (alreadySolved) {
            return user; // Don't update if already solved
        }

        // Add to solved problems
        user.stats.solvedProblems.push({
            problemId,
            difficulty,
            solvedAt: new Date(),
        });

        // Update difficulty counts
        user.stats.totalSolved += 1;
        if (difficulty === "Easy") user.stats.easySolved += 1;
        if (difficulty === "Medium") user.stats.mediumSolved += 1;
        if (difficulty === "Hard") user.stats.hardSolved += 1;

        // Update streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.stats.lastSolvedDate) {
            const lastSolved = new Date(user.stats.lastSolvedDate);
            lastSolved.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Same day, no change
            } else if (daysDiff === 1) {
                // Consecutive day
                user.stats.currentStreak += 1;
                user.stats.longestStreak = Math.max(
                    user.stats.longestStreak,
                    user.stats.currentStreak
                );
            } else {
                // Streak broken
                user.stats.currentStreak = 1;
            }
        } else {
            // First solve
            user.stats.currentStreak = 1;
            user.stats.longestStreak = 1;
        }

        user.stats.lastSolvedDate = new Date();

        // Update points
        const pointsMap = { Easy: 10, Medium: 25, Hard: 50 };
        user.points += pointsMap[difficulty] || 0;

        await user.save();
        console.log(`✅ Updated stats for user ${userId}`);
        return user;
    } catch (error) {
        console.error("❌ Error updating user stats:", error);
        throw error;
    }
}

/**
 * Get user dashboard stats
 */
export async function getUserDashboardStats(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Calculate topic mastery (example - you can expand this)
        const topicStats = {};
        // This would require problems to have topic tags

        // Get recent activity (last 365 days)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const recentActivity = user.stats.solvedProblems
            .filter((p) => new Date(p.solvedAt) >= oneYearAgo)
            .map((p) => ({
                date: p.solvedAt,
                count: 1,
            }));

        // Group by date
        const activityMap = {};
        recentActivity.forEach((activity) => {
            const dateKey = new Date(activity.date).toISOString().split("T")[0];
            activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
        });

        return {
            stats: user.stats,
            points: user.points,
            activityHeatmap: activityMap,
            topicMastery: topicStats,
        };
    } catch (error) {
        console.error("❌ Error getting dashboard stats:", error);
        throw error;
    }
}
