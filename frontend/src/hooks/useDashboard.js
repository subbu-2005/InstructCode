import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getLeaderboard } from "../api/dashboard";

/**
 * Dashboard Hooks
 */

// Get dashboard stats
export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStats,
    });
}

// Get leaderboard
export function useLeaderboard(timeframe = "all") {
    return useQuery({
        queryKey: ["leaderboard", timeframe],
        queryFn: () => getLeaderboard(timeframe),
    });
}
