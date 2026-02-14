import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllSessions, getActiveSessions, endSession } from "../../api/admin";
import toast from "react-hot-toast";

/**
 * Hook to fetch all sessions with filters
 * @param {Object} params - Query parameters (page, limit, status, difficulty, search, sortBy, sortOrder)
 */
export const useSessions = (params = {}) => {
    return useQuery({
        queryKey: ["admin", "sessions", params],
        queryFn: () => getAllSessions(params),
        keepPreviousData: true,
    });
};

/**
 * Hook to fetch active sessions (for real-time monitoring)
 * Auto-refreshes every 5 seconds
 */
export const useActiveSessions = () => {
    return useQuery({
        queryKey: ["admin", "sessions", "active"],
        queryFn: getActiveSessions,
        refetchInterval: 5000, // Refresh every 5 seconds
    });
};

/**
 * Hook to end a session
 */
export const useEndSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: endSession,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "sessions"]);
            queryClient.invalidateQueries(["admin", "stats"]);
            toast.success("Session ended successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to end session");
        },
    });
};
