import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, ShieldCheck, TrendingUp, Trophy } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path) => location.pathname === path;
  const isAdminPath = (path) => location.pathname.startsWith(path);

  // Check if user is admin
  const ADMIN_EMAIL = "psubramanya742@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <nav className="glass border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-2 sm:gap-3 hover:scale-105 transition-all duration-300"
        >
          <div className="size-9 sm:size-11 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center glow-purple-blue">
            <SparklesIcon className="size-5 sm:size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-base sm:text-xl gradient-text-purple-blue font-mono tracking-wider">
              InstructCode
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-2 sm:px-4 py-2.5 rounded-xl transition-all duration-300 font-medium
              ${isActive("/problems")
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-purple-blue"
                : "text-gray-300 hover:text-white hover:bg-white/5 hover-glow-purple"
              }
              `}
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <BookOpenIcon className="size-4" />
              <span className="hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* PROGRESS PAGE LINK */}
          <Link
            to={"/progress"}
            className={`px-2 sm:px-4 py-2.5 rounded-xl transition-all duration-300 font-medium
              ${isActive("/progress")
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-purple-blue"
                : "text-gray-300 hover:text-white hover:bg-white/5 hover-glow-purple"
              }
              `}
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <TrendingUp className="size-4" />
              <span className="hidden sm:inline">Progress</span>
            </div>
          </Link>

          {/* LEADERBOARD PAGE LINK */}
          <Link
            to={"/leaderboard"}
            className={`px-2 sm:px-4 py-2.5 rounded-xl transition-all duration-300 font-medium
              ${isActive("/leaderboard")
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-purple-blue"
                : "text-gray-300 hover:text-white hover:bg-white/5 hover-glow-purple"
              }
              `}
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Trophy className="size-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </div>
          </Link>

          {/* DASHBOARD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-2 sm:px-4 py-2.5 rounded-xl transition-all duration-300 font-medium
              ${isActive("/dashboard")
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-purple-blue"
                : "text-gray-300 hover:text-white hover:bg-white/5 hover-glow-purple"
              }
              `}
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {/* ADMIN LINK - Only show if user is admin */}
          {isAdmin && (
            <Link
              to={"/admin"}
              className={`px-2 sm:px-4 py-2.5 rounded-xl transition-all duration-300 font-medium
                ${isAdminPath("/admin")
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white glow-purple-blue"
                  : "text-gray-300 hover:text-white hover:bg-white/5 hover-glow-purple"
                }
                `}
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <ShieldCheck className="size-4" />
                <span className="hidden sm:inline">Admin</span>
              </div>
            </Link>
          )}

          {/* USER BUTTON */}
          <div className="ml-2 rounded-full ring-2 ring-purple-500/30 hover:ring-purple-500/60 transition-all duration-300">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-10",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
