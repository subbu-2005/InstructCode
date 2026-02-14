import axios from "../lib/axios";

/**
 * Bookmark API
 */

// Get all bookmarks
export const getBookmarks = async () => {
    const response = await axios.get("/bookmarks");
    return response.data;
};

// Check if problem is bookmarked
export const checkBookmark = async (problemId) => {
    const response = await axios.get(`/bookmarks/check/${problemId}`);
    return response.data;
};

// Add bookmark
export const addBookmark = async (problemId, data = {}) => {
    const response = await axios.post(`/bookmarks/${problemId}`, data);
    return response.data;
};

// Update bookmark
export const updateBookmark = async (problemId, data) => {
    const response = await axios.put(`/bookmarks/${problemId}`, data);
    return response.data;
};

// Remove bookmark
export const removeBookmark = async (problemId) => {
    const response = await axios.delete(`/bookmarks/${problemId}`);
    return response.data;
};
