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
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const statsData = stats?.data || {};

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-base-content/70">Welcome to the admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={statsData.totalUsers || 0}
                    icon={Users}
                    growth={statsData.userGrowth}
                    color="primary"
                />
                <StatsCard
                    title="Active Users Today"
                    value={statsData.activeUsersToday || 0}
                    icon={Clock}
                    color="success"
                />
                <StatsCard
                    title="Total Sessions"
                    value={statsData.totalSessions || 0}
                    icon={Activity}
                    color="secondary"
                />
                <StatsCard
                    title="Active Sessions"
                    value={statsData.activeSessions || 0}
                    icon={Activity}
                    color="warning"
                />
            </div>

            {/* Problem Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h3 className="card-title">
                            <FileCode size={20} />
                            Problems Overview
                        </h3>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between items-center">
                                <span>Total Problems</span>
                                <span className="badge badge-lg badge-primary">
                                    {statsData.totalProblems || 0}
                                </span>
                            </div>
                            <div className="divider my-0"></div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="badge badge-success badge-sm">Easy</span>
                                </span>
                                <span className="font-semibold">
                                    {statsData.problemsByDifficulty?.Easy || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="badge badge-warning badge-sm">Medium</span>
                                </span>
                                <span className="font-semibold">
                                    {statsData.problemsByDifficulty?.Medium || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="badge badge-error badge-sm">Hard</span>
                                </span>
                                <span className="font-semibold">
                                    {statsData.problemsByDifficulty?.Hard || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h3 className="card-title">Quick Actions</h3>
                        <div className="space-y-2 mt-4">
                            <a href="/admin/problems/new" className="btn btn-primary btn-block">
                                <FileCode size={18} />
                                Create New Problem
                            </a>
                            <a href="/admin/users" className="btn btn-secondary btn-block">
                                <Users size={18} />
                                Manage Users
                            </a>
                            <a href="/admin/sessions" className="btn btn-accent btn-block">
                                <Activity size={18} />
                                View Sessions
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note about charts */}
            <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Charts and detailed analytics will be displayed here. The foundation is ready!</span>
            </div>
        </div>
    );
}
