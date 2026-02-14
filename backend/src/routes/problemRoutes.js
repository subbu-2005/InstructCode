import express from "express";
import {
    getAllProblems,
    getProblemById,
} from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { submitCode, getUserSubmissions } from "../controllers/submissionController.js";

const router = express.Router();

/**
 * Public Problem Routes
 * These endpoints are accessible to all authenticated users
 */

// Get all problems
router.get("/", getAllProblems);

// Get single problem by ID
router.get("/:id", getProblemById);

// Submit code for a problem (protected)
router.post("/:id/submit", protectRoute, submitCode);

// Get user's submissions for a problem (protected)
router.get("/:id/submissions", protectRoute, getUserSubmissions);

export default router;
