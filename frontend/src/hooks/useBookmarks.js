import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBookmarks,
    checkBookmark,
    addBookmark,
    updateBookmark,
    removeBookmark,
} from "../api/bookmarks";
import toast from "react-hot-toast";

/**
 * Hook to get all bookmarks
 */
export const useBookmarks = () => {
    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: getBookmarks,
    });
};

/**
 * Hook to check if a problem is bookmarked
 */
export const useCheckBookmark = (problemId) => {
    return useQuery({
        queryKey: ["bookmark", problemId],
        queryFn: () => checkBookmark(problemId),
        enabled: !!problemId,
    });
};

/**
 * Hook to add a bookmark
 */
export const useAddBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ problemId, data }) => addBookmark(problemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["bookmark"] });
            toast.success("Problem bookmarked!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to bookmark problem");
        },
    });
};

/**
 * Hook to update a bookmark
 */
export const useUpdateBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ problemId, data }) => updateBookmark(problemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            toast.success("Bookmark updated!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update bookmark");
        },
    });
};

/**
 * Hook to remove a bookmark
 */
export const useRemoveBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (problemId) => removeBookmark(problemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["bookmark"] });
            toast.success("Bookmark removed!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to remove bookmark");
        },
    });
};
