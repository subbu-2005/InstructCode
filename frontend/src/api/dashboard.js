import axios from "../lib/axios";

/**
 * Dashboard API Service
 */

// Get user dashboard stats
export const getDashboardStats = async () => {
    const response = await axios.get("/dashboard/stats");
    return response.data;
};

// Get leaderboard
export const getLeaderboard = async (timeframe = "all") => {
    const response = await axios.get(`/dashboard/leaderboard?timeframe=${timeframe}`);
    return response.data;
};
