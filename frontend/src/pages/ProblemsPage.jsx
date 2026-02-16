import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useProblems } from "../hooks/useProblems";

function ProblemsPage() {
  const { data, isLoading } = useProblems();
  const problems = data?.data || [];

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated-gradient">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="size-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Background Orbs */}
      <div className="glowing-orb glowing-orb-purple w-96 h-96 top-20 right-10 opacity-30" />
      <div className="glowing-orb glowing-orb-blue w-80 h-80 bottom-40 left-20 opacity-25" />

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* HEADER */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3">
            <span className="gradient-text-purple-blue">Practice</span> Problems
          </h1>
          <p className="text-base sm:text-xl text-gray-400">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4 mb-8 sm:mb-12">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="block glass-card p-4 sm:p-6 rounded-2xl border-purple-500/20 hover-glow-purple transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* LEFT SIDE */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="size-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center glow-purple">
                      <Code2Icon className="size-7 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white group-hover:gradient-text-purple-blue transition-all">
                          {problem.title}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-purple-400 font-medium">{problem.category}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{problem.description.text}</p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="font-semibold">Solve</span>
                  <ChevronRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border-purple-500/20 glow-purple-blue">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Total Problems</div>
              <div className="text-4xl font-black gradient-text-purple-blue">{problems.length}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Easy</div>
              <div className="text-4xl font-black text-green-400">{easyProblemsCount}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Medium</div>
              <div className="text-4xl font-black text-yellow-400">{mediumProblemsCount}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Hard</div>
              <div className="text-4xl font-black text-red-400">{hardProblemsCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
