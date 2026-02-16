import { useState } from "react";
import { useSessions, useActiveSessions, useEndSession } from "../../hooks/admin/useAdminSessions";
import { Activity, Clock, StopCircle, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Admin Sessions Page
 * Session monitoring with real-time active sessions and filters
 */
export default function AdminSessions() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const { data: activeSessions, isLoading: loadingActive } = useActiveSessions();
    const { data: allSessions, isLoading: loadingAll } = useSessions({
        page,
        limit: 20,
        status,
        difficulty,
    });
    const endSessionMutation = useEndSession();

    const handleEndSession = (sessionId, problem) => {
        if (window.confirm(`Are you sure you want to end the session for "${problem}"?`)) {
            endSessionMutation.mutate(sessionId);
        }
    };

    const getDifficultyBadge = (diff) => {
        const badges = {
            easy: "badge-success",
            medium: "badge-warning",
            hard: "badge-error",
        };
        return badges[diff] || "badge-ghost";
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Session Monitoring</h1>
                <p className="text-base-content/70">Monitor and manage coding sessions</p>
            </div>

            {/* Active Sessions Panel */}
            <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                <div className="card-body">
                    <h2 className="card-title text-success">
                        <Activity className="animate-pulse" size={20} />
                        Active Sessions ({activeSessions?.count || 0})
                        <span className="text-xs opacity-60 ml-2">Auto-refreshes every 5s</span>
                    </h2>

                    {loadingActive ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : activeSessions?.data?.length === 0 ? (
                        <div className="text-center py-8 opacity-60">
                            <Clock size={48} className="mx-auto mb-2" />
                            <p>No active sessions at the moment</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {activeSessions?.data?.map((session) => (
                                <div key={session._id} className="card bg-base-100 shadow">
                                    <div className="card-body p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{session.problem}</h3>
                                                <span className={`badge badge-sm ${getDifficultyBadge(session.difficulty)} mt-1`}>
                                                    {session.difficulty}
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleEndSession(session._id, session.problem)}
                                                disabled={endSessionMutation.isPending}
                                            >
                                                <StopCircle size={14} />
                                            </button>
                                        </div>

                                        <div className="text-sm mt-2 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="opacity-60">Host:</span>
                                                <span>{session.host?.name}</span>
                                            </div>
                                            {session.participant && (
                                                <div className="flex items-center gap-2">
                                                    <span className="opacity-60">Participant:</span>
                                                    <span>{session.participant.name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="opacity-60" />
                                                <span className="text-xs">
                                                    Started {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h3 className="card-title text-sm">
                        <Filter size={18} />
                        Filters
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                        <select
                            className="select select-bordered select-sm"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            className="select select-bordered select-sm"
                            value={difficulty}
                            onChange={(e) => {
                                setDifficulty(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        {(status || difficulty) && (
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                    setStatus("");
                                    setDifficulty("");
                                    setPage(1);
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* All Sessions Table */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title">All Sessions</h2>

                    {loadingAll ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Problem</th>
                                            <th>Difficulty</th>
                                            <th>Host</th>
                                            <th>Participant</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allSessions?.data?.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-8 opacity-60">
                                                    No sessions found
                                                </td>
                                            </tr>
                                        ) : (
                                            allSessions?.data?.map((session) => (
                                                <tr key={session._id}>
                                                    <td className="font-medium">{session.problem}</td>
                                                    <td>
                                                        <span className={`badge ${getDifficultyBadge(session.difficulty)}`}>
                                                            {session.difficulty}
                                                        </span>
                                                    </td>
                                                    <td>{session.host?.name}</td>
                                                    <td>{session.participant?.name || "-"}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${session.status === "active" ? "badge-success" : "badge-ghost"
                                                                }`}
                                                        >
                                                            {session.status}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(session.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        {session.status === "active" && (
                                                            <button
                                                                className="btn btn-error btn-xs"
                                                                onClick={() => handleEndSession(session._id, session.problem)}
                                                                disabled={endSessionMutation.isPending}
                                                            >
                                                                <StopCircle size={14} />
                                                                End
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {allSessions?.pagination?.pages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <div className="join">
                                        <button
                                            className="join-item btn"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            «
                                        </button>
                                        <button className="join-item btn">
                                            Page {page} of {allSessions.pagination.pages}
                                        </button>
                                        <button
                                            className="join-item btn"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === allSessions.pagination.pages}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
