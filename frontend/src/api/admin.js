import axios from "../lib/axios";

/**
 * Admin API Service
 * All endpoints require admin authentication
 */

// ============================================
// PROBLEM MANAGEMENT
// ============================================

export const createProblem = async (problemData) => {
    const response = await axios.post("/admin/problems", problemData);
    return response.data;
};

export const updateProblem = async (id, problemData) => {
    const response = await axios.put(`/admin/problems/${id}`, problemData);
    return response.data;
};

export const deleteProblem = async (id) => {
    const response = await axios.delete(`/admin/problems/${id}`);
    return response.data;
};

// ============================================
// ANALYTICS/STATS
// ============================================

export const getOverviewStats = async () => {
    const response = await axios.get("/admin/stats");
    return response.data;
};

export const getUserRegistrationStats = async (period = "week") => {
    const response = await axios.get("/admin/stats/users", {
        params: { period },
    });
    return response.data;
};

export const getSessionActivityStats = async (period = "week") => {
    const response = await axios.get("/admin/stats/sessions", {
        params: { period },
    });
    return response.data;
};

export const getActiveUsersStats = async () => {
    const response = await axios.get("/admin/stats/active-users");
    return response.data;
};

export const getProblemDistribution = async () => {
    const response = await axios.get("/admin/stats/problems");
    return response.data;
};

// ============================================
// USER MANAGEMENT
// ============================================

export const getAllUsers = async (params = {}) => {
    const response = await axios.get("/admin/users", { params });
    return response.data;
};

export const getUserDetails = async (id) => {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`/admin/users/${id}`);
    return response.data;
};

// ============================================
// SESSION MANAGEMENT
// ============================================

export const getAllSessions = async (params = {}) => {
    const response = await axios.get("/admin/sessions", { params });
    return response.data;
};

export const getActiveSessions = async () => {
    const response = await axios.get("/admin/sessions/active");
    return response.data;
};

export const endSession = async (id) => {
    const response = await axios.post(`/admin/sessions/${id}/end`);
    return response.data;
};
