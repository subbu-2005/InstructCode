import { useMutation } from "@tanstack/react-query";
import { getHint, getCodeReview, getComplexityAnalysis } from "../api/ai";
import toast from "react-hot-toast";

/**
 * Hook to get hint for a problem
 */
export const useGetHint = () => {
    return useMutation({
        mutationFn: ({ problemId, code, hintLevel }) => getHint(problemId, code, hintLevel),
        onSuccess: () => {
            // Success handled in component
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to get hint");
        },
    });
};

/**
 * Hook to get code review
 */
export const useGetCodeReview = () => {
    return useMutation({
        mutationFn: ({ problemId, code, language }) => getCodeReview(problemId, code, language),
        onSuccess: () => {
            toast.success("Code review generated!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to review code");
        },
    });
};

/**
 * Hook to get complexity analysis
 */
export const useGetComplexityAnalysis = () => {
    return useMutation({
        mutationFn: ({ code, language }) => getComplexityAnalysis(code, language),
        onSuccess: () => {
            toast.success("Complexity analysis generated!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to analyze complexity");
        },
    });
};
