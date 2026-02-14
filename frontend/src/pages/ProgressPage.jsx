import { useDashboardStats } from "../hooks/useDashboard";
import Navbar from "../components/Navbar";
import { TrendingUp, Calendar, Target, Award, Flame } from "lucide-react";

function ProgressPage() {
    const { data: statsData, isLoading } = useDashboardStats();

    const stats = statsData?.data?.stats || {};
    const points = statsData?.data?.points || 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-animated-gradient flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="size-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
            {/* Background Orbs */}
            <div className="glowing-orb glowing-orb-purple w-96 h-96 top-20 left-10 opacity-30" />
            <div className="glowing-orb glowing-orb-blue w-80 h-80 bottom-40 right-20 opacity-25" />

            <Navbar />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <h1 className="text-5xl font-black mb-8">
                    <span className="gradient-text-purple-blue">My</span> Progress
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Solved */}
                    <div className="glass-card p-6 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <Target className="size-10 text-purple-400" />
                        </div>
                        <div className="text-sm text-gray-400 mb-2">Total Solved</div>
                        <div className="text-4xl font-black gradient-text-purple-blue mb-2">{stats.totalSolved || 0}</div>
                        <div className="text-xs text-gray-500">
                            Easy: {stats.easySolved || 0} • Medium: {stats.mediumSolved || 0} • Hard: {stats.hardSolved || 0}
                        </div>
                    </div>

                    {/* Points */}
                    <div className="glass-card p-6 rounded-2xl border-blue-500/20 hover-glow-blue transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <Award className="size-10 text-blue-400" />
                        </div>
                        <div className="text-sm text-gray-400 mb-2">Total Points</div>
                        <div className="text-4xl font-black gradient-text-purple-blue mb-2">{points}</div>
                        <div className="text-xs text-gray-500">Keep solving to earn more!</div>
                    </div>

                    {/* Current Streak */}
                    <div className="glass-card p-6 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <Flame className="size-10 text-orange-400" />
                        </div>
                        <div className="text-sm text-gray-400 mb-2">Current Streak</div>
                        <div className="text-4xl font-black text-orange-400 mb-2">{stats.currentStreak || 0} days</div>
                        <div className="text-xs text-gray-500">Longest: {stats.longestStreak || 0} days</div>
                    </div>

                    {/* Last Solved */}
                    <div className="glass-card p-6 rounded-2xl border-blue-500/20 hover-glow-blue transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <Calendar className="size-10 text-blue-400" />
                        </div>
                        <div className="text-sm text-gray-400 mb-2">Last Solved</div>
                        <div className="text-lg font-bold text-white mb-2">
                            {stats.lastSolvedDate ? new Date(stats.lastSolvedDate).toLocaleDateString() : "Never"}
                        </div>
                        <div className="text-xs text-gray-500">Keep the streak going!</div>
                    </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="glass-card p-8 rounded-2xl border-purple-500/20 glow-purple mb-8">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <TrendingUp size={28} className="text-purple-400" />
                        <span className="gradient-text-purple-blue">Difficulty Distribution</span>
                    </h2>
                    <div className="space-y-6">
                        {/* Easy */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-green-400">Easy</span>
                                <span className="text-sm text-gray-400">{stats.easySolved || 0} solved</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                                    style={{ width: `${((stats.easySolved || 0) / Math.max(stats.totalSolved || 1, 10)) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Medium */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-yellow-400">Medium</span>
                                <span className="text-sm text-gray-400">{stats.mediumSolved || 0} solved</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                                    style={{ width: `${((stats.mediumSolved || 0) / Math.max(stats.totalSolved || 1, 10)) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Hard */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-red-400">Hard</span>
                                <span className="text-sm text-gray-400">{stats.hardSolved || 0} solved</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                                    style={{ width: `${((stats.hardSolved || 0) / Math.max(stats.totalSolved || 1, 10)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                {stats.solvedProblems && stats.solvedProblems.length > 0 && (
                    <div className="glass-card p-8 rounded-2xl border-purple-500/20 glow-purple-blue">
                        <h2 className="text-3xl font-bold mb-6 gradient-text-purple-blue">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-purple-500/20">
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Problem ID</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Difficulty</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Solved At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.solvedProblems
                                        .slice(-10)
                                        .reverse()
                                        .map((problem, idx) => (
                                            <tr key={idx} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-white font-medium">{problem.problemId}</td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${problem.difficulty === "Easy"
                                                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                                : problem.difficulty === "Medium"
                                                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                                            }`}
                                                    >
                                                        {problem.difficulty}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-400">{new Date(problem.solvedAt).toLocaleDateString()}</td>
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
