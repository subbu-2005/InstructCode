import Problem from "../models/Problem.js";

/**
 * Problem Controller
 * Handles CRUD operations for coding problems
 */

/**
 * Get all problems (public endpoint)
 * @route GET /api/problems
 */
export const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find()
            .select("-__v")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: problems.length,
            data: problems,
        });
    } catch (error) {
        console.error("❌ Error fetching problems:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch problems",
            error: error.message,
        });
    }
};

/**
 * Get single problem by ID (public endpoint)
 * @route GET /api/problems/:id
 */
export const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOne({ id }).select("-__v");

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        res.status(200).json({
            success: true,
            data: problem,
        });
    } catch (error) {
        console.error("❌ Error fetching problem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch problem",
            error: error.message,
        });
    }
};

/**
 * Create new problem (admin only)
 * @route POST /api/admin/problems
 */
export const createProblem = async (req, res) => {
    try {
        const problemData = req.body;

        // Check if problem with this ID already exists
        const existingProblem = await Problem.findOne({ id: problemData.id });
        if (existingProblem) {
            return res.status(400).json({
                success: false,
                message: "Problem with this ID already exists",
            });
        }

        const problem = await Problem.create(problemData);

        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            data: problem,
        });
    } catch (error) {
        console.error("❌ Error creating problem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create problem",
            error: error.message,
        });
    }
};

/**
 * Update existing problem (admin only)
 * @route PUT /api/admin/problems/:id
 */
export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const problem = await Problem.findOneAndUpdate(
            { id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            data: problem,
        });
    } catch (error) {
        console.error("❌ Error updating problem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update problem",
            error: error.message,
        });
    }
};

/**
 * Delete problem (admin only)
 * @route DELETE /api/admin/problems/:id
 */
export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOneAndDelete({ id });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
            data: problem,
        });
    } catch (error) {
        console.error("❌ Error deleting problem:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete problem",
            error: error.message,
        });
    }
};
