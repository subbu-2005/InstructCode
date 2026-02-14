import { Link, Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { LayoutDashboard, Users, Activity, FileCode, Menu, X } from "lucide-react";
import { useState } from "react";

const ADMIN_EMAIL = "psubramanya742@gmail.com";

/**
 * Admin Layout Component
 * Provides sidebar navigation and layout for all admin pages
 * Only accessible to admin email
 */
export default function AdminLayout() {
    const { user, isLoaded } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check if user is admin
    const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

    // Show loading state
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-animated-gradient">
                <div className="size-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Redirect if not admin
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    const navItems = [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/users", icon: Users, label: "Users" },
        { to: "/admin/sessions", icon: Activity, label: "Sessions" },
        { to: "/admin/problems", icon: FileCode, label: "Problems" },
    ];

    return (
        <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
            {/* Background Orbs */}
            <div className="glowing-orb glowing-orb-purple w-96 h-96 top-20 left-10 opacity-20" />
            <div className="glowing-orb glowing-orb-blue w-80 h-80 bottom-40 right-20 opacity-15" />

            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="size-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center glow-purple-blue"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 glass-card border-r border-purple-500/20
          z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="p-6">
                    <h1 className="text-3xl font-black mb-8 gradient-text-purple-blue">Admin Panel</h1>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 hover-glow-purple transition-all duration-300"
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Admin info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-500/20">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.imageUrl}
                            alt={user?.fullName || "Admin"}
                            className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{user?.fullName}</p>
                            <p className="text-xs text-purple-400 truncate">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="lg:ml-64 min-h-screen relative z-10">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
