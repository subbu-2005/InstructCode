import { useQuery } from "@tanstack/react-query";
import { getAllProblems, getProblemById } from "../api/problems";

/**
 * Hook to fetch all problems
 * Public hook for regular users
 */
export const useProblems = () => {
    return useQuery({
        queryKey: ["problems"],
        queryFn: getAllProblems,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook to fetch single problem by ID
 * @param {string} id - Problem ID
 */
export const useProblem = (id) => {
    return useQuery({
        queryKey: ["problem", id],
        queryFn: () => getProblemById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
