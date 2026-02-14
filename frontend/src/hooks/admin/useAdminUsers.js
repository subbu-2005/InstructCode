import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getUserDetails, deleteUser } from "../../api/admin";
import toast from "react-hot-toast";

/**
 * Hook to fetch all users with pagination/search/filter
 * @param {Object} params - Query parameters (page, limit, search, sortBy, sortOrder)
 */
export const useUsers = (params = {}) => {
    return useQuery({
        queryKey: ["admin", "users", params],
        queryFn: () => getAllUsers(params),
        keepPreviousData: true,
    });
};

/**
 * Hook to fetch user details with session history
 * @param {string} id - User ID
 */
export const useUserDetails = (id) => {
    return useQuery({
        queryKey: ["admin", "user", id],
        queryFn: () => getUserDetails(id),
        enabled: !!id,
    });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "users"]);
            queryClient.invalidateQueries(["admin", "stats"]);
            toast.success("User deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });
};
