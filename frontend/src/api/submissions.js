import axios from "../lib/axios";

/**
 * Submission API
 */

// Submit code for a problem
export const submitCode = async (problemId, data) => {
    const response = await axios.post(`/problems/${problemId}/submit`, data);
    return response.data;
};

// Get user's submissions for a problem
export const getUserSubmissions = async (problemId) => {
    const response = await axios.get(`/problems/${problemId}/submissions`);
    return response.data;
};
