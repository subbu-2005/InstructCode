import { useState, useEffect } from "react";
import { useUsers, useDeleteUser } from "../../hooks/admin/useAdminUsers";
import { Search, Trash2, Eye, UserX } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Admin Users Page
 * User management with search, pagination, and delete functionality
 */
export default function AdminUsers() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading } = useUsers({ page, limit: 20, search });
    const deleteUserMutation = useDeleteUser();

    // Auto-search with debouncing (500ms after user stops typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their sessions.`)) {
            deleteUserMutation.mutate(userId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const users = data?.data || [];
    const pagination = data?.pagination || {};

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-base-content/70">Manage all platform users</p>
                </div>
            </div>

            {/* Search - Auto-search as you type */}
            <div className="flex gap-2">
                <div className="join flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or email... (auto-search)"
                        className="input input-bordered join-item flex-1"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <div className="btn btn-primary join-item pointer-events-none">
                        <Search size={18} />
                    </div>
                </div>
                {search && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setSearchInput("");
                            setPage(1);
                        }}
                        className="btn btn-ghost"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Users Table */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Joined</th>
                                    <th>Sessions</th>
                                    <th>Last Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            <UserX size={48} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-base-content/70">No users found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-10 h-10 rounded-full">
                                                            <img
                                                                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}`}
                                                                alt={user.name}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{user.name}</div>
                                                        <div className="text-xs opacity-60">{user.clerkId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className="badge badge-primary">
                                                    {user.sessionCount || 0}
                                                </span>
                                            </td>
                                            <td>
                                                {user.lastActive
                                                    ? new Date(user.lastActive).toLocaleDateString()
                                                    : "Never"}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-error btn-ghost"
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        disabled={deleteUserMutation.isPending}
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="join">
                                <button
                                    className="join-item btn"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    «
                                </button>
                                <button className="join-item btn">
                                    Page {page} of {pagination.pages}
                                </button>
                                <button
                                    className="join-item btn"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pagination.pages}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
