import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      console.log("🔐 Auth Middleware:");
      console.log("   req.auth exists:", !!req.auth);
      console.log("   req.auth.userId:", req.auth?.userId);

      const clerkId = req.auth?.userId;

      if (!clerkId) {
        console.log("❌ No clerkId found - Unauthorized");
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });
      console.log("   User found in DB:", user ? `✓ ${user.name}` : "✗ Not found");

      // Auto-create user if they don't exist
      if (!user) {
        try {
          console.log("🔄 Auto-creating user from Clerk...");

          // Fetch user details from Clerk
          const clerkUser = await clerkClient.users.getUser(clerkId);

          const userData = {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
            profileImage: clerkUser.imageUrl || "",
          };

          // Create user in MongoDB
          user = await User.create(userData);
          console.log("✅ User auto-created:", user.email);

          // Sync with Stream
          await upsertStreamUser({
            id: user.clerkId,
            name: user.name,
            image: user.profileImage,
          });
          console.log("✅ User synced with Stream");
        } catch (createError) {
          console.error("❌ Error auto-creating user:", createError);
          return res.status(500).json({ message: "Failed to create user profile" });
        }
      }

      // attach user to req
      req.user = user;
      console.log("✓ Auth successful for:", user.name);

      next();
    } catch (error) {
      console.error("❌ Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];