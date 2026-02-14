import { requireAuth, clerkClient } from "@clerk/express";
import { ENV } from "../lib/env.js";

/**
 * Admin Authentication Middleware
 * Ensures only the designated admin email can access admin routes
 * 
 * Usage: Apply to all /api/admin/* routes
 * Example: router.get('/admin/stats', adminAuth, getStats);
 */
export const adminAuth = [
    // First, ensure user is authenticated via Clerk
    requireAuth(),

    // Then, verify user is the admin
    async (req, res, next) => {
        try {
            // Get the authenticated user from Clerk
            const clerkUser = await clerkClient.users.getUser(req.auth.userId);

            // Extract primary email address
            const userEmail = clerkUser.emailAddresses.find(
                (email) => email.id === clerkUser.primaryEmailAddressId
            )?.emailAddress;

            // Check if user email matches admin email
            if (!userEmail || userEmail !== ENV.ADMIN_EMAIL) {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required.",
                    error: "FORBIDDEN"
                });
            }

            // User is admin, proceed to next middleware/controller
            next();
        } catch (error) {
            console.error("❌ Admin auth error:", error);
            res.status(500).json({
                message: "Internal server error during authentication",
                error: "INTERNAL_ERROR"
            });
        }
    },
];

