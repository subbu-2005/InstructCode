import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProblems } from "../../api/problems";
import { createProblem, updateProblem, deleteProblem } from "../../api/admin";
import toast from "react-hot-toast";

/**
 * Hook to fetch all problems (admin view)
 */
export const useAdminProblems = () => {
    return useQuery({
        queryKey: ["admin", "problems"],
        queryFn: getAllProblems,
    });
};

/**
 * Hook to create a new problem
 */
export const useCreateProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProblem,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "problems"]);
            queryClient.invalidateQueries(["problems"]);
            queryClient.invalidateQueries(["admin", "stats"]);
            toast.success("Problem created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create problem");
        },
    });
};

/**
 * Hook to update an existing problem
 */
export const useUpdateProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateProblem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "problems"]);
            queryClient.invalidateQueries(["problems"]);
            toast.success("Problem updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update problem");
        },
    });
};

/**
 * Hook to delete a problem
 */
export const useDeleteProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProblem,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "problems"]);
            queryClient.invalidateQueries(["problems"]);
            queryClient.invalidateQueries(["admin", "stats"]);
            toast.success("Problem deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete problem");
        },
    });
};
