import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// Add logging middleware for all session routes
router.use((req, res, next) => {
  console.log(`📥 Session Route Hit: ${req.method} ${req.path}`);
  console.log("   Headers:", {
    authorization: req.headers.authorization ? "✓ Present" : "✗ Missing",
    origin: req.headers.origin,
  });
  next();
});

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

export default router;