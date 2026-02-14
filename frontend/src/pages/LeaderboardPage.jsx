import { useState } from "react";
import { useLeaderboard } from "../hooks/useDashboard";
import Navbar from "../components/Navbar";
import { Trophy, Flame } from "lucide-react";

function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState("all");
    const { data: leaderboardData, isLoading } = useLeaderboard(timeframe);

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <Trophy size={40} className="text-yellow-500" />
                    Leaderboard
                </h1>

                {/* Timeframe Filter */}
                <div className="flex gap-2 justify-center mb-8">
                    {["all", "daily", "weekly", "monthly"].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`btn btn-sm ${timeframe === tf ? "btn-primary" : "btn-outline"}`}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Leaderboard Table */}
                <div className="bg-base-200 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Coders</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>User</th>
                                        <th>Points</th>
                                        <th>Solved</th>
                                        <th>Streak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData?.data?.leaderboard?.map((user) => (
                                        <tr key={user._id} className="hover">
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {user.rank === 1 && <Trophy className="text-yellow-500" size={20} />}
                                                    {user.rank === 2 && <Trophy className="text-gray-400" size={20} />}
                                                    {user.rank === 3 && <Trophy className="text-orange-600" size={20} />}
                                                    <span className="font-bold">#{user.rank}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-10 h-10 rounded-full">
                                                            <img
                                                                src={user.profileImage || "https://via.placeholder.com/40"}
                                                                alt={user.name}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="font-bold text-primary">{user.points}</td>
                                            <td>{user.stats?.totalSolved || 0}</td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    <Flame size={16} className="text-orange-500" />
                                                    {user.stats?.currentStreak || 0}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LeaderboardPage;
