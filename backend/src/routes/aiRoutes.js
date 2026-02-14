import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getHint, getCodeReview, getComplexityAnalysis } from "../controllers/aiController.js";

const router = express.Router();

/**
 * AI Routes (for users)
 * All routes require authentication
 */

// Get hint for a problem
router.post("/hint", protectRoute, getHint);

// Get code review
router.post("/review", protectRoute, getCodeReview);

// Get complexity analysis
router.post("/complexity", protectRoute, getComplexityAnalysis);

export default router;
