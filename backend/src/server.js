import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import problemRoutes from "./routes/problemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import User from "./models/User.js"; // ← ADD THIS IMPORT
import { upsertStreamUser } from "./lib/stream.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

// Add logging for routes
console.log("📍 Registering routes...");
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
console.log("✓ Routes registered");

// Sync user endpoint - ADD BEFORE OTHER ROUTES
app.get("/api/sync-user", async (req, res) => {
  try {
    console.log("🔄 Syncing user...");
    console.log("req.auth:", req.auth);

    const clerkId = req.auth?.userId;
    console.log("Clerk ID:", clerkId);

    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId });
    if (user) {
      return res.json({ message: "User already exists", user });
    }

    // Log session claims to see what data we have
    console.log("Session claims:", req.auth.sessionClaims);

    const sessionClaims = req.auth.sessionClaims;

    // Extract user data with fallbacks
    const email = sessionClaims?.email || sessionClaims?.primary_email_address?.email_address || 'noemail@example.com';
    const firstName = sessionClaims?.first_name || sessionClaims?.firstName || '';
    const lastName = sessionClaims?.last_name || sessionClaims?.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || email.split('@')[0] || 'User';
    const profileImage = sessionClaims?.image_url || sessionClaims?.profile_image_url || sessionClaims?.imageUrl || '';

    console.log("Creating user with data:", { clerkId, email, name, profileImage });

    user = await User.create({
      clerkId: clerkId,
      email: email,
      name: name,
      profileImage: profileImage,
    });

    await upsertStreamUser({
      id: user.clerkId,
      name: user.name,
      image: user.profileImage,
    });

    console.log("✅ User created successfully:", user);
    res.json({ message: "User created!", user });
  } catch (error) {
    console.error("❌ Sync user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    env: {
      nodeEnv: ENV.NODE_ENV,
      port: ENV.PORT,
      clientUrl: ENV.CLIENT_URL,
      hasStreamKey: !!ENV.STREAM_API_KEY,
      hasDBUrl: !!ENV.DB_URL,
    },
    clerkAuth: req.auth ? "Clerk middleware active" : "No Clerk auth"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("=".repeat(50));
      console.log(`✓ Server is running on port: ${ENV.PORT}`);
      console.log(`✓ API available at: http://localhost:${ENV.PORT}/api`);
      console.log(`✓ Health check: http://localhost:${ENV.PORT}/health`);
      console.log(`✓ Test endpoint: http://localhost:${ENV.PORT}/api/test`);
      console.log(`✓ Sync user: http://localhost:${ENV.PORT}/api/sync-user`);
      console.log("=".repeat(50));
    });
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();