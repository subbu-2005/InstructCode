import axios from "../lib/axios";

/**
 * Public Problems API
 * Accessible to all authenticated users
 */

/**
 * Get all problems
 * @returns {Promise} Array of all problems
 */
export const getAllProblems = async () => {
    const response = await axios.get("/problems");
    return response.data;
};

/**
 * Get single problem by ID
 * @param {string} id - Problem ID (e.g., "two-sum")
 * @returns {Promise} Problem object
 */
export const getProblemById = async (id) => {
    const response = await axios.get(`/problems/${id}`);
    return response.data;
};
