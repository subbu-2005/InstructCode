import { useDashboardStats } from "../hooks/useDashboard";
import Navbar from "../components/Navbar";
import { TrendingUp, Calendar, Target, Award, Flame } from "lucide-react";

function ProgressPage() {
    const { data: statsData, isLoading } = useDashboardStats();

    const stats = statsData?.data?.stats || {};
    const points = statsData?.data?.points || 0;

    if (isLoading) {
        return (
            <div className="h-screen bg-base-100 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">My Progress</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Solved */}
                    <div className="stat bg-base-200 rounded-xl shadow-lg">
                        <div className="stat-figure text-primary">
                            <Target size={32} />
                        </div>
                        <div className="stat-title">Total Solved</div>
                        <div className="stat-value text-primary">{stats.totalSolved || 0}</div>
                        <div className="stat-desc">
                            Easy: {stats.easySolved || 0} • Medium: {stats.mediumSolved || 0} • Hard: {stats.hardSolved || 0}
                        </div>
                    </div>

                    {/* Points */}
                    <div className="stat bg-base-200 rounded-xl shadow-lg">
                        <div className="stat-figure text-secondary">
                            <Award size={32} />
                        </div>
                        <div className="stat-title">Total Points</div>
                        <div className="stat-value text-secondary">{points}</div>
                        <div className="stat-desc">Keep solving to earn more!</div>
                    </div>

                    {/* Current Streak */}
                    <div className="stat bg-base-200 rounded-xl shadow-lg">
                        <div className="stat-figure text-warning">
                            <Flame size={32} />
                        </div>
                        <div className="stat-title">Current Streak</div>
                        <div className="stat-value text-warning">{stats.currentStreak || 0} days</div>
                        <div className="stat-desc">Longest: {stats.longestStreak || 0} days</div>
                    </div>

                    {/* Last Solved */}
                    <div className="stat bg-base-200 rounded-xl shadow-lg">
                        <div className="stat-figure text-info">
                            <Calendar size={32} />
                        </div>
                        <div className="stat-title">Last Solved</div>
                        <div className="stat-value text-sm">
                            {stats.lastSolvedDate ? new Date(stats.lastSolvedDate).toLocaleDateString() : "Never"}
                        </div>
                        <div className="stat-desc">Keep the streak going!</div>
                    </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="bg-base-200 rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={24} />
                        Difficulty Distribution
                    </h2>
                    <div className="space-y-4">
                        {/* Easy */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Easy</span>
                                <span className="text-sm">{stats.easySolved || 0} solved</span>
                            </div>
                            <progress
                                className="progress progress-success w-full"
                                value={stats.easySolved || 0}
                                max={Math.max(stats.totalSolved || 1, 10)}
                            ></progress>
                        </div>

                        {/* Medium */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Medium</span>
                                <span className="text-sm">{stats.mediumSolved || 0} solved</span>
                            </div>
                            <progress
                                className="progress progress-warning w-full"
                                value={stats.mediumSolved || 0}
                                max={Math.max(stats.totalSolved || 1, 10)}
                            ></progress>
                        </div>

                        {/* Hard */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Hard</span>
                                <span className="text-sm">{stats.hardSolved || 0} solved</span>
                            </div>
                            <progress
                                className="progress progress-error w-full"
                                value={stats.hardSolved || 0}
                                max={Math.max(stats.totalSolved || 1, 10)}
                            ></progress>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                {stats.solvedProblems && stats.solvedProblems.length > 0 && (
                    <div className="bg-base-200 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Problem ID</th>
                                        <th>Difficulty</th>
                                        <th>Solved At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.solvedProblems
                                        .slice(-10)
                                        .reverse()
                                        .map((problem, idx) => (
                                            <tr key={idx}>
                                                <td>{problem.problemId}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${problem.difficulty === "Easy"
                                                                ? "badge-success"
                                                                : problem.difficulty === "Medium"
                                                                    ? "badge-warning"
                                                                    : "badge-error"
                                                            }`}
                                                    >
                                                        {problem.difficulty}
                                                    </span>
                                                </td>
                                                <td>{new Date(problem.solvedAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProgressPage;
