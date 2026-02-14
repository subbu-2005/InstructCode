import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    addBookmark,
    removeBookmark,
    getBookmarks,
    updateBookmark,
    checkBookmark,
} from "../controllers/bookmarkController.js";

const router = express.Router();

/**
 * Bookmark Routes
 * All routes require authentication
 */

// Get all bookmarks
router.get("/", protectRoute, getBookmarks);

// Check if problem is bookmarked
router.get("/check/:problemId", protectRoute, checkBookmark);

// Add bookmark
router.post("/:problemId", protectRoute, addBookmark);

// Update bookmark (notes/tags)
router.put("/:problemId", protectRoute, updateBookmark);

// Remove bookmark
router.delete("/:problemId", protectRoute, removeBookmark);

export default router;
