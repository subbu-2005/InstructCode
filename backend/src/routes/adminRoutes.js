import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
    createProblem,
    updateProblem,
    deleteProblem,
} from "../controllers/problemController.js";
import {
    getOverviewStats,
    getUserRegistrationStats,
    getSessionActivityStats,
    getActiveUsersStats,
    getProblemDistribution,
    getAllUsers,
    getUserDetails,
    deleteUser,
    getAllSessions,
    getActiveSessions,
    endSession,
} from "../controllers/adminController.js";
import { generateProblemWithAI, generateTestCasesWithAI } from "../controllers/aiController.js";

const router = express.Router();

/**
 * Admin Routes
 * All routes are protected with adminAuth middleware
 * Only users with ADMIN_EMAIL can access these endpoints
 */

// ============================================
// AI ROUTES
// ============================================

// Generate problem with AI
router.post("/ai/generate-problem", adminAuth, generateProblemWithAI);

// Generate test cases with AI
router.post("/ai/generate-testcases", adminAuth, generateTestCasesWithAI);

// ============================================
// PROBLEM MANAGEMENT ROUTES
// ============================================

// Create new problem
router.post("/problems", adminAuth, createProblem);

// Update existing problem
router.put("/problems/:id", adminAuth, updateProblem);

// Delete problem
router.delete("/problems/:id", adminAuth, deleteProblem);

// ============================================
// ANALYTICS/STATS ROUTES
// ============================================

// Get overview statistics
router.get("/stats", adminAuth, getOverviewStats);

// Get user registration stats over time
router.get("/stats/users", adminAuth, getUserRegistrationStats);

// Get session activity stats over time
router.get("/stats/sessions", adminAuth, getSessionActivityStats);

// Get active users stats (past 7 days)
router.get("/stats/active-users", adminAuth, getActiveUsersStats);

// Get problem distribution by difficulty
router.get("/stats/problems", adminAuth, getProblemDistribution);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// Get all users with pagination/search/filter
router.get("/users", adminAuth, getAllUsers);

// Get user details with session history
router.get("/users/:id", adminAuth, getUserDetails);

// Delete user
router.delete("/users/:id", adminAuth, deleteUser);

// ============================================
// SESSION MANAGEMENT ROUTES
// ============================================

// Get all sessions with filters
router.get("/sessions", adminAuth, getAllSessions);

// Get only active sessions (for real-time monitoring)
router.get("/sessions/active", adminAuth, getActiveSessions);

// Force end a session
router.post("/sessions/:id/end", adminAuth, endSession);

export default router;
