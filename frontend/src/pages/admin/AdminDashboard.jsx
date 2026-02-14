import StatsCard from "../../components/admin/StatsCard";
import { Users, Activity, FileCode, Clock } from "lucide-react";
import { useOverviewStats } from "../../hooks/admin/useAdminStats";

/**
 * Admin Dashboard Page
 * Overview page with statistics and charts
 */
export default function AdminDashboard() {
    const { data: stats, isLoading } = useOverviewStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="size-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    const statsData = stats?.data || {};

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black mb-3">
                    <span className="gradient-text-purple-blue">Dashboard</span> Overview
                </h1>
                <p className="text-gray-400 text-lg">Welcome to the admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="glass-card p-6 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="size-10 text-purple-400" />
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Total Users</div>
                    <div className="text-4xl font-black gradient-text-purple-blue mb-2">
                        {statsData.totalUsers || 0}
                    </div>
                    {statsData.userGrowth && (
                        <div className="text-xs text-green-400">
                            ↑ {statsData.userGrowth}% vs last month
                        </div>
                    )}
                </div>

                {/* Active Users Today */}
                <div className="glass-card p-6 rounded-2xl border-blue-500/20 hover-glow-blue transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="size-10 text-blue-400" />
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Active Users Today</div>
                    <div className="text-4xl font-black gradient-text-purple-blue">
                        {statsData.activeUsersToday || 0}
                    </div>
                </div>

                {/* Total Sessions */}
                <div className="glass-card p-6 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="size-10 text-purple-400" />
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Total Sessions</div>
                    <div className="text-4xl font-black gradient-text-purple-blue">
                        {statsData.totalSessions || 0}
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="glass-card p-6 rounded-2xl border-blue-500/20 hover-glow-blue transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="size-10 text-blue-400" />
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Active Sessions</div>
                    <div className="text-4xl font-black gradient-text-purple-blue">
                        {statsData.activeSessions || 0}
                    </div>
                </div>
            </div>

            {/* Problem Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8 rounded-2xl border-purple-500/20 glow-purple">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <FileCode size={24} className="text-purple-400" />
                        <span className="gradient-text-purple-blue">Problems Overview</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
                            <span className="text-gray-300 font-medium">Total Problems</span>
                            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-lg">
                                {statsData.totalProblems || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-semibold">
                                    Easy
                                </span>
                            </span>
                            <span className="font-bold text-white text-lg">
                                {statsData.problemsByDifficulty?.Easy || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-sm font-semibold">
                                    Medium
                                </span>
                            </span>
                            <span className="font-bold text-white text-lg">
                                {statsData.problemsByDifficulty?.Medium || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold">
                                    Hard
                                </span>
                            </span>
                            <span className="font-bold text-white text-lg">
                                {statsData.problemsByDifficulty?.Hard || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-8 rounded-2xl border-blue-500/20 glow-blue">
                    <h3 className="text-2xl font-bold mb-6 gradient-text-purple-blue">Quick Actions</h3>
                    <div className="space-y-3">
                        <a
                            href="/admin/problems/new"
                            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:scale-105 transition-all duration-300 glow-purple-blue"
                        >
                            <FileCode size={20} />
                            Create New Problem
                        </a>
                        <a
                            href="/admin/users"
                            className="flex items-center gap-3 px-6 py-4 rounded-xl glass-card border-purple-500/30 text-gray-300 hover:text-white font-semibold hover-glow-purple transition-all duration-300"
                        >
                            <Users size={20} />
                            Manage Users
                        </a>
                        <a
                            href="/admin/sessions"
                            className="flex items-center gap-3 px-6 py-4 rounded-xl glass-card border-blue-500/30 text-gray-300 hover:text-white font-semibold hover-glow-blue transition-all duration-300"
                        >
                            <Activity size={20} />
                            View Sessions
                        </a>
                    </div>
                </div>
            </div>

            {/* Note about charts */}
            <div className="glass-card p-6 rounded-2xl border-blue-500/20 flex items-start gap-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6 text-blue-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="text-gray-300">
                    Charts and detailed analytics will be displayed here. The foundation is ready!
                </span>
            </div>
        </div>
    );
}
