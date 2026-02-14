import User from "../models/User.js";
import Problem from "../models/Problem.js";

/**
 * Bookmark Controller
 * Handles bookmark operations for users
 */

/**
 * Add a problem to bookmarks
 * @route POST /api/bookmarks/:problemId
 */
export const addBookmark = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { notes = "", tags = [] } = req.body;
        const userId = req.user._id;

        // Check if problem exists
        const problem = await Problem.findOne({ id: problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        // Check if already bookmarked
        const user = await User.findById(userId);
        const existingBookmark = user.bookmarkedProblems.find(
            (b) => b.problemId === problemId
        );

        if (existingBookmark) {
            return res.status(400).json({
                success: false,
                message: "Problem already bookmarked",
            });
        }

        // Add bookmark
        user.bookmarkedProblems.push({
            problemId,
            notes,
            tags,
            createdAt: new Date(),
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: "Problem bookmarked successfully",
            data: user.bookmarkedProblems,
        });
    } catch (error) {
        console.error("❌ Error adding bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add bookmark",
            error: error.message,
        });
    }
};

/**
 * Remove a problem from bookmarks
 * @route DELETE /api/bookmarks/:problemId
 */
export const removeBookmark = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);

        user.bookmarkedProblems = user.bookmarkedProblems.filter(
            (b) => b.problemId !== problemId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully",
            data: user.bookmarkedProblems,
        });
    } catch (error) {
        console.error("❌ Error removing bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove bookmark",
            error: error.message,
        });
    }
};

/**
 * Get all bookmarked problems
 * @route GET /api/bookmarks
 */
export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        // Get full problem details for each bookmark
        const bookmarksWithDetails = await Promise.all(
            user.bookmarkedProblems.map(async (bookmark) => {
                const problem = await Problem.findOne({ id: bookmark.problemId });
                return {
                    ...bookmark.toObject(),
                    problem: problem || null,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: bookmarksWithDetails,
        });
    } catch (error) {
        console.error("❌ Error getting bookmarks:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get bookmarks",
            error: error.message,
        });
    }
};

/**
 * Update bookmark notes and tags
 * @route PUT /api/bookmarks/:problemId
 */
export const updateBookmark = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { notes, tags } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        const bookmark = user.bookmarkedProblems.find(
            (b) => b.problemId === problemId
        );

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found",
            });
        }

        if (notes !== undefined) bookmark.notes = notes;
        if (tags !== undefined) bookmark.tags = tags;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Bookmark updated successfully",
            data: bookmark,
        });
    } catch (error) {
        console.error("❌ Error updating bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update bookmark",
            error: error.message,
        });
    }
};

/**
 * Check if a problem is bookmarked
 * @route GET /api/bookmarks/check/:problemId
 */
export const checkBookmark = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);

        const isBookmarked = user.bookmarkedProblems.some(
            (b) => b.problemId === problemId
        );

        res.status(200).json({
            success: true,
            data: { isBookmarked },
        });
    } catch (error) {
        console.error("❌ Error checking bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check bookmark",
            error: error.message,
        });
    }
};
