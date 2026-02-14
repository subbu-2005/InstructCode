import express from "express";
import { getDashboardStats, getLeaderboard } from "../controllers/dashboardController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Dashboard stats
router.get("/stats", getDashboardStats);

// Leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;
