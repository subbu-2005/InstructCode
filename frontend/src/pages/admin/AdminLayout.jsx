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
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
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
        <div className="min-h-screen bg-base-200">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="btn btn-circle btn-primary"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-primary-focus
          text-primary-content shadow-xl z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-focus/50 transition-colors"
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Admin info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary-content/20">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.imageUrl}
                            alt={user?.fullName || "Admin"}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user?.fullName}</p>
                            <p className="text-xs opacity-75 truncate">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="lg:ml-64 min-h-screen">
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
