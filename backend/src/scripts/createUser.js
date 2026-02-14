import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

// User details from Clerk dashboard
const userData = {
    clerkId: "user_39dj0pKnWlubLcK1VJDYnzOKHRI",
    email: "ashwathprabhu880@gmail.com",
    name: "Ashwath Prabhu",
    profileImage: "",
};

async function createUser() {
    try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ clerkId: userData.clerkId });

        if (existingUser) {
            console.log("✅ User already exists:", existingUser);
            process.exit(0);
        }

        // Create user in MongoDB
        const user = await User.create(userData);
        console.log("✅ User created in MongoDB:", user);

        // Sync with Stream
        await upsertStreamUser({
            id: user.clerkId,
            name: user.name,
            image: user.profileImage,
        });
        console.log("✅ User synced with Stream");

        console.log("\n🎉 User creation complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating user:", error);
        process.exit(1);
    }
}

createUser();
