import { Link } from "react-router";
import { useAdminProblems, useDeleteProblem } from "../../hooks/admin/useAdminProblems";
import { Plus, Edit, Trash2, FileCode } from "lucide-react";
import { useState } from "react";

/**
 * Admin Problems Page
 * Problem list with create/edit/delete functionality
 */
export default function AdminProblems() {
    const { data, isLoading } = useAdminProblems();
    const deleteProblemMutation = useDeleteProblem();
    const [filter, setFilter] = useState("");

    const handleDelete = (problemId, problemTitle) => {
        if (window.confirm(`Are you sure you want to delete "${problemTitle}"?`)) {
            deleteProblemMutation.mutate(problemId);
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const badges = {
            Easy: "badge-success",
            Medium: "badge-warning",
            Hard: "badge-error",
        };
        return badges[difficulty] || "badge-ghost";
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const problems = data?.data || [];
    const filteredProblems = filter
        ? problems.filter((p) => p.difficulty === filter)
        : problems;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Problem Management</h1>
                    <p className="text-base-content/70">Create and manage coding problems</p>
                </div>
                <Link to="/admin/problems/new" className="btn btn-primary w-full sm:w-auto">
                    <Plus size={18} />
                    Create Problem
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    className={`btn btn-sm ${!filter ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setFilter("")}
                >
                    All ({problems.length})
                </button>
                <button
                    className={`btn btn-sm ${filter === "Easy" ? "btn-success" : "btn-ghost"}`}
                    onClick={() => setFilter("Easy")}
                >
                    Easy ({problems.filter((p) => p.difficulty === "Easy").length})
                </button>
                <button
                    className={`btn btn-sm ${filter === "Medium" ? "btn-warning" : "btn-ghost"}`}
                    onClick={() => setFilter("Medium")}
                >
                    Medium ({problems.filter((p) => p.difficulty === "Medium").length})
                </button>
                <button
                    className={`btn btn-sm ${filter === "Hard" ? "btn-error" : "btn-ghost"}`}
                    onClick={() => setFilter("Hard")}
                >
                    Hard ({problems.filter((p) => p.difficulty === "Hard").length})
                </button>
            </div>

            {/* Problems Grid */}
            {filteredProblems.length === 0 ? (
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body text-center py-16">
                        <FileCode size={64} className="mx-auto mb-4 opacity-30" />
                        <h3 className="text-xl font-semibold mb-2">No problems found</h3>
                        <p className="text-base-content/70 mb-4">
                            {filter
                                ? `No ${filter} problems available`
                                : "Get started by creating your first problem"}
                        </p>
                        <Link to="/admin/problems/new" className="btn btn-primary mx-auto">
                            <Plus size={18} />
                            Create Problem
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProblems.map((problem) => (
                        <div key={problem._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="card-body">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="card-title text-lg">{problem.title}</h3>
                                    <span className={`badge ${getDifficultyBadge(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>

                                <p className="text-sm opacity-70 mb-2">{problem.category}</p>

                                <p className="text-sm line-clamp-3 mb-4">
                                    {problem.description.text}
                                </p>

                                <div className="text-xs opacity-60 mb-4">
                                    Created {new Date(problem.createdAt).toLocaleDateString()}
                                </div>

                                <div className="card-actions justify-end">
                                    <Link
                                        to={`/admin/problems/${problem.id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-error btn-ghost"
                                        onClick={() => handleDelete(problem.id, problem.title)}
                                        disabled={deleteProblemMutation.isPending}
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
