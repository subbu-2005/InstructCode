import { useState } from "react";
import { useLeaderboard } from "../hooks/useDashboard";
import Navbar from "../components/Navbar";
import { Trophy, Flame, Medal } from "lucide-react";

function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState("all");
    const { data: leaderboardData, isLoading } = useLeaderboard(timeframe);

    const getRankColor = (rank) => {
        if (rank === 1) return "text-yellow-400";
        if (rank === 2) return "text-gray-300";
        if (rank === 3) return "text-orange-500";
        return "text-purple-400";
    };

    const getRankGlow = (rank) => {
        if (rank === 1) return "glow-yellow";
        if (rank === 2) return "glow-gray";
        if (rank === 3) return "glow-orange";
        return "";
    };

    return (
        <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
            {/* Background Orbs */}
            <div className="glowing-orb glowing-orb-purple w-96 h-96 top-20 right-10 opacity-30" />
            <div className="glowing-orb glowing-orb-blue w-80 h-80 bottom-40 left-20 opacity-25" />

            <Navbar />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                    <Trophy size={36} className="sm:size-12 text-yellow-400" />
                    <span className="gradient-text-purple-blue">Leaderboard</span>
                </h1>

                {/* Timeframe Filter */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
                    {["all", "daily", "weekly", "monthly"].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${timeframe === tf
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-purple-blue"
                                : "glass-card text-gray-300 hover:text-white hover-glow-purple border-purple-500/20"
                                }`}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Leaderboard Table */}
                <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl border-purple-500/20 glow-purple-blue">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 gradient-text-purple-blue">Top Coders</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="size-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-purple-500/20">
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Rank</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">User</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Points</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Solved</th>
                                        <th className="text-left py-4 px-4 text-gray-400 font-semibold">Streak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData?.data?.leaderboard?.map((user) => (
                                        <tr
                                            key={user._id}
                                            className={`border-b border-purple-500/10 hover:bg-white/5 transition-all duration-300 ${user.rank <= 3 ? getRankGlow(user.rank) : ""
                                                }`}
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {user.rank === 1 && <Trophy className="text-yellow-400" size={24} />}
                                                    {user.rank === 2 && <Medal className="text-gray-300" size={24} />}
                                                    {user.rank === 3 && <Medal className="text-orange-500" size={24} />}
                                                    <span className={`text-2xl font-black ${getRankColor(user.rank)}`}>
                                                        #{user.rank}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-full ring-2 ring-purple-500/30">
                                                            <img
                                                                src={user.profileImage || "https://via.placeholder.com/48"}
                                                                alt={user.name}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-white text-lg">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-2xl font-black gradient-text-purple-blue">{user.points}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-lg font-semibold text-gray-300">{user.stats?.totalSolved || 0}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Flame size={20} className="text-orange-400" />
                                                    <span className="text-lg font-semibold text-orange-400">
                                                        {user.stats?.currentStreak || 0}
                                                    </span>
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
