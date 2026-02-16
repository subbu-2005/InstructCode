import User from "../models/User.js";
import Session from "../models/Session.js";
import Problem from "../models/Problem.js";

/**
 * Admin Controller
 * Handles admin dashboard analytics and management operations
 */

/**
 * Get overview statistics
 * @route GET /api/admin/stats
 */
export const getOverviewStats = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalSessions = await Session.countDocuments();
        const activeSessions = await Session.countDocuments({ status: "active" });
        const totalProblems = await Problem.countDocuments();

        // Get active users today (users who created/joined sessions today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const activeUsersToday = await Session.distinct("host", {
            createdAt: { $gte: startOfDay },
        });

        // Get problem distribution by difficulty
        const problemsByDifficulty = await Problem.aggregate([
            {
                $group: {
                    _id: "$difficulty",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Calculate growth percentages (compare with last month)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const usersLastMonth = await User.countDocuments({
            createdAt: { $lt: lastMonth },
        });
        const userGrowth = usersLastMonth > 0
            ? ((totalUsers - usersLastMonth) / usersLastMonth) * 100
            : 0;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalSessions,
                activeSessions,
                totalProblems,
                activeUsersToday: activeUsersToday.length,
                userGrowth: Math.round(userGrowth * 10) / 10, // Round to 1 decimal
                problemsByDifficulty: problemsByDifficulty.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        console.error("❌ Error fetching overview stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch overview statistics",
            error: error.message,
        });
    }
};

/**
 * Get user registration statistics over time
 * @route GET /api/admin/stats/users
 */
export const getUserRegistrationStats = async (req, res) => {
    try {
        const { period = "week" } = req.query; // week, month, year

        let groupBy;
        let startDate = new Date();

        switch (period) {
            case "month":
                startDate.setMonth(startDate.getMonth() - 1);
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                };
                break;
            case "year":
                startDate.setFullYear(startDate.getFullYear() - 1);
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                };
                break;
            default: // week
                startDate.setDate(startDate.getDate() - 7);
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                };
        }

        const stats = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("❌ Error fetching user registration stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user registration statistics",
            error: error.message,
        });
    }
};

/**
 * Get session activity statistics over time
 * @route GET /api/admin/stats/sessions
 */
export const getSessionActivityStats = async (req, res) => {
    try {
        const { period = "week" } = req.query;

        let groupBy;
        let startDate = new Date();

        switch (period) {
            case "month":
                startDate.setMonth(startDate.getMonth() - 1);
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                };
                break;
            case "year":
                startDate.setFullYear(startDate.getFullYear() - 1);
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                };
                break;
            default: // week
                startDate.setDate(startDate.getDate() - 7);
                groupBy = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                };
        }

        const stats = await Session.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("❌ Error fetching session activity stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch session activity statistics",
            error: error.message,
        });
    }
};

/**
 * Get active users for the past 7 days
 * @route GET /api/admin/stats/active-users
 */
export const getActiveUsersStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await Session.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    users: { $addToSet: "$host" },
                },
            },
            {
                $project: {
                    _id: 1,
                    count: { $size: "$users" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("❌ Error fetching active users stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch active users statistics",
            error: error.message,
        });
    }
};

/**
 * Get problem distribution by difficulty
 * @route GET /api/admin/stats/problems
 */
export const getProblemDistribution = async (req, res) => {
    try {
        const distribution = await Problem.aggregate([
            {
                $group: {
                    _id: "$difficulty",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: distribution,
        });
    } catch (error) {
        console.error("❌ Error fetching problem distribution:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch problem distribution",
            error: error.message,
        });
    }
};

/**
 * Get all users with pagination, search, and filters
 * @route GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
    console.log("\n" + "🔵".repeat(40));
    console.log("📋 GET ALL USERS - Admin Endpoint");
    console.log("🔵".repeat(40));

    try {
        const {
            page = 1,
            limit = 20,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        console.log("📊 Query Parameters:", { page, limit, search, sortBy, sortOrder });

        // Build search query
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get users with pagination
        const users = await User.find(query)
            .select("-__v")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await User.countDocuments(query);

        // Get session counts for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const sessionCount = await Session.countDocuments({
                    $or: [{ host: user._id }, { participant: user._id }],
                });

                const lastSession = await Session.findOne({
                    $or: [{ host: user._id }, { participant: user._id }],
                })
                    .sort({ createdAt: -1 })
                    .select("createdAt");

                return {
                    ...user.toObject(),
                    sessionCount,
                    lastActive: lastSession?.createdAt || user.createdAt,
                };
            })
        );

        console.log(`✅ Successfully fetched ${usersWithStats.length} users (Total: ${total})`);
        console.log("🔵".repeat(40) + "\n");

        res.status(200).json({
            success: true,
            data: usersWithStats,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

/**
 * Get user details with session history
 * @route GET /api/admin/users/:id
 */
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get user's session history
        const sessions = await Session.find({
            $or: [{ host: user._id }, { participant: user._id }],
        })
            .populate("host", "name email profileImage")
            .populate("participant", "name email profileImage")
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: {
                user,
                sessions,
                stats: {
                    totalSessions: sessions.length,
                    activeSessions: sessions.filter((s) => s.status === "active").length,
                    completedSessions: sessions.filter((s) => s.status === "completed")
                        .length,
                },
            },
        });
    } catch (error) {
        console.error("❌ Error fetching user details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
            error: error.message,
        });
    }
};

/**
 * Delete user and their sessions
 * @route DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete all sessions where user is host or participant
        await Session.deleteMany({
            $or: [{ host: user._id }, { participant: user._id }],
        });

        // Delete user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User and associated sessions deleted successfully",
        });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
};

/**
 * Get all sessions with filters
 * @route GET /api/admin/sessions
 */
export const getAllSessions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status = "",
            difficulty = "",
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build filter query
        const query = {};
        if (status) query.status = status;
        if (difficulty) query.difficulty = difficulty;
        if (search) query.problem = { $regex: search, $options: "i" };

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get sessions with pagination
        const sessions = await Session.find(query)
            .populate("host", "name email profileImage")
            .populate("participant", "name email profileImage")
            .select("-__v")
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Session.countDocuments(query);

        res.status(200).json({
            success: true,
            data: sessions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("❌ Error fetching sessions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions",
            error: error.message,
        });
    }
};

/**
 * Get only active sessions (for real-time monitoring)
 * @route GET /api/admin/sessions/active
 */
export const getActiveSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ status: "active" })
            .populate("host", "name email profileImage")
            .populate("participant", "name email profileImage")
            .select("-__v")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions,
        });
    } catch (error) {
        console.error("❌ Error fetching active sessions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch active sessions",
            error: error.message,
        });
    }
};

/**
 * Force end a session
 * @route POST /api/admin/sessions/:id/end
 */
export const endSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Session is already completed",
            });
        }

        session.status = "completed";
        await session.save();

        res.status(200).json({
            success: true,
            message: "Session ended successfully",
            data: session,
        });
    } catch (error) {
        console.error("❌ Error ending session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to end session",
            error: error.message,
        });
    }
};
