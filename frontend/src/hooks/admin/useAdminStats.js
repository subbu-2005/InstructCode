import { useQuery } from "@tanstack/react-query";
import {
    getOverviewStats,
    getUserRegistrationStats,
    getSessionActivityStats,
    getActiveUsersStats,
    getProblemDistribution,
} from "../../api/admin";

/**
 * Hook to fetch overview statistics
 */
export const useOverviewStats = () => {
    return useQuery({
        queryKey: ["admin", "stats", "overview"],
        queryFn: getOverviewStats,
        refetchInterval: 30000, // Refetch every 30 seconds
    });
};

/**
 * Hook to fetch user registration stats
 * @param {string} period - "week", "month", or "year"
 */
export const useUserRegistrationStats = (period = "week") => {
    return useQuery({
        queryKey: ["admin", "stats", "users", period],
        queryFn: () => getUserRegistrationStats(period),
    });
};

/**
 * Hook to fetch session activity stats
 * @param {string} period - "week", "month", or "year"
 */
export const useSessionActivityStats = (period = "week") => {
    return useQuery({
        queryKey: ["admin", "stats", "sessions", period],
        queryFn: () => getSessionActivityStats(period),
    });
};

/**
 * Hook to fetch active users stats (past 7 days)
 */
export const useActiveUsersStats = () => {
    return useQuery({
        queryKey: ["admin", "stats", "active-users"],
        queryFn: getActiveUsersStats,
    });
};

/**
 * Hook to fetch problem distribution by difficulty
 */
export const useProblemDistribution = () => {
    return useQuery({
        queryKey: ["admin", "stats", "problems"],
        queryFn: getProblemDistribution,
    });
};
