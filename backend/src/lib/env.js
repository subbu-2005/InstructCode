import dotenv from "dotenv";

const result = dotenv.config({ quiet: true });

if (result.error) {
  console.error("❌ Error loading .env file:", result.error);
}
export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL, // Admin email for dashboard access
  GEMINI_API_KEY: process.env.GEMINI_API_KEY, // Google Gemini AI API key
};

// Add these logs at the end of env.js
console.log("🔧 Environment variables loaded:");
console.log("PORT:", ENV.PORT);
console.log("CLIENT_URL:", ENV.CLIENT_URL);
console.log("DB_URL:", ENV.DB_URL ? "✓ Set" : "✗ Missing");
console.log("STREAM_API_KEY:", ENV.STREAM_API_KEY ? "✓ Set" : "✗ Missing");
console.log("STREAM_API_SECRET:", ENV.STREAM_API_SECRET ? "✓ Set" : "✗ Missing");
console.log("ADMIN_EMAIL:", ENV.ADMIN_EMAIL ? "✓ Set" : "✗ Missing");
console.log("NODE_ENV:", ENV.NODE_ENV);