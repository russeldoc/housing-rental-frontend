import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaUserCheck,
    FaUserTimes,
    FaSearch,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
    const { authUser } = useAuth();

    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);

    // Search and filters
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [isActive, setIsActive] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // Pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Load users from backend
    const loadUsers = async () => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("page_size", pageSize);

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (role) {
                params.append("role", role);
            }

            if (isActive !== "") {
                params.append("is_active", isActive);
            }

            params.append("sort_by", sortBy);

            const data = await apiRequest(
                "/users/?" + params.toString()
            );

            setUsers(data.items || []);
            setTotalUsers(data.total || 0);
            setTotalPages(data.total_pages || 1);
        } catch (error) {
            console.error("Error loading users:", error);

            toast.error(
                error.message || "Could not load users."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Load again when filters or page change
    useEffect(() => {
        loadUsers();
    }, [page, search, role, isActive, sortBy]);

    // Activate / deactivate user
    const handleStatusChange = async (user) => {
        // Prevent current admin from changing their own status
        if (authUser?.id === user.id) {
            toast.error(
                "You cannot deactivate your own account."
            );
            return;
        }

        const newStatus = !user.is_active;

        const action = newStatus
            ? "activate"
            : "deactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${user.full_name}"?`
        );

        if (!confirmed) return;

        try {
            setUpdatingUserId(user.id);

            await apiRequest(`/users/${user.id}/status`, {
                method: "PATCH",
                body: JSON.stringify({
                    is_active: newStatus,
                }),
            });

            toast.success(
                `User ${newStatus
                    ? "activated"
                    : "deactivated"
                } successfully!`
            );

            await loadUsers();
        } catch (error) {
            console.error(
                "Error updating user status:",
                error
            );

            toast.error(
                error.message ||
                "Could not update user status."
            );
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Search
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    // Role filter
    const handleRoleChange = (event) => {
        setRole(event.target.value);
        setPage(1);
    };

    // Status filter
    const handleStatusFilterChange = (event) => {
        setIsActive(event.target.value);
        setPage(1);
    };

    // Sort
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setPage(1);
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearch("");
        setRole("");
        setIsActive("");
        setSortBy("newest");
        setPage(1);
    };

    const hasFilters =
        search ||
        role ||
        isActive !== "" ||
        sortBy !== "newest";

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Manage Users
                    </h1>

                    <p className="text-gray-500 mt-2">
                        View and manage registered users.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body">

                        <div className="flex items-center gap-2 mb-4">
                            <FaFilter className="text-primary" />

                            <h2 className="font-bold text-lg">
                                Search & Filters
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* Search */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Search
                                    </span>
                                </label>

                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="text"
                                        placeholder="Name, email or phone"
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="input input-bordered w-full pl-10"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Role
                                    </span>
                                </label>

                                <select
                                    value={role}
                                    onChange={handleRoleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">
                                        All Roles
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                    <option value="tenant">
                                        Tenant
                                    </option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Status
                                    </span>
                                </label>

                                <select
                                    value={isActive}
                                    onChange={handleStatusFilterChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">
                                        All Status
                                    </option>

                                    <option value="true">
                                        Active
                                    </option>

                                    <option value="false">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Sort By
                                    </span>
                                </label>

                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="newest">
                                        Newest First
                                    </option>

                                    <option value="oldest">
                                        Oldest First
                                    </option>
                                </select>
                            </div>

                        </div>

                        {/* Clear Filters */}
                        {hasFilters && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="btn btn-sm btn-outline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* Total Users */}
                <div className="mb-5">
                    <p className="text-gray-500">
                        Total users:{" "}
                        <span className="font-bold text-base-content">
                            {totalUsers}
                        </span>
                    </p>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : users.length === 0 ? (

                    /* Empty State */
                    <div className="card bg-base-100 shadow">
                        <div className="card-body text-center items-center py-12">

                            <FaUser className="text-4xl text-gray-400" />

                            <h2 className="text-xl font-bold">
                                No users found
                            </h2>

                            <p className="text-gray-500">
                                Try changing your search or filters.
                            </p>

                        </div>
                    </div>

                ) : (

                    <>
                        {/* Users Table */}
                        <div className="card bg-base-100 shadow-md">

                            <div className="card-body p-0">

                                <div className="overflow-x-auto">

                                    <table className="table">

                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Contact</th>
                                                <th>Location</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {users.map((user) => {

                                                const isCurrentUser =
                                                    authUser?.id === user.id;

                                                const isUpdating =
                                                    updatingUserId === user.id;

                                                return (
                                                    <tr key={user.id}>

                                                        {/* User */}
                                                        <td>
                                                            <div className="flex items-center gap-3">

                                                                <div className="avatar placeholder">
                                                                    <div className="bg-primary text-primary-content rounded-full w-10">
                                                                        <FaUser />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="font-bold">
                                                                        {user.full_name}

                                                                        {isCurrentUser && (
                                                                            <span className="badge badge-primary badge-sm ml-2">
                                                                                You
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className="text-sm opacity-60">
                                                                        ID: {user.id}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </td>

                                                        {/* Contact */}
                                                        <td>
                                                            <div className="flex flex-col gap-1">

                                                                <span className="flex items-center gap-2">
                                                                    <FaEnvelope />
                                                                    {user.email}
                                                                </span>

                                                                <span className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <FaPhone />
                                                                    {user.phone_number}
                                                                </span>

                                                            </div>
                                                        </td>

                                                        {/* Location */}
                                                        <td>
                                                            <span className="flex items-center gap-2">
                                                                <FaMapMarkerAlt />
                                                                {user.home_district}
                                                            </span>
                                                        </td>

                                                        {/* Role */}
                                                        <td>
                                                            <span
                                                                className={`badge ${user.role === "admin"
                                                                        ? "badge-primary"
                                                                        : "badge-outline"
                                                                    }`}
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </td>

                                                        {/* Status */}
                                                        <td>
                                                            <span
                                                                className={`badge ${user.is_active
                                                                        ? "badge-success"
                                                                        : "badge-error"
                                                                    }`}
                                                            >
                                                                {user.is_active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </td>

                                                        {/* Action */}
                                                        <td>

                                                            {isCurrentUser ? (

                                                                <span className="badge badge-primary">
                                                                    Current Account
                                                                </span>

                                                            ) : (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            user
                                                                        )
                                                                    }
                                                                    disabled={isUpdating}
                                                                    className={`btn btn-sm ${user.is_active
                                                                            ? "btn-error btn-outline"
                                                                            : "btn-success"
                                                                        }`}
                                                                >

                                                                    {isUpdating ? (

                                                                        <span className="loading loading-spinner loading-xs" />

                                                                    ) : user.is_active ? (

                                                                        <>
                                                                            <FaUserTimes />
                                                                            Deactivate
                                                                        </>

                                                                    ) : (

                                                                        <>
                                                                            <FaUserCheck />
                                                                            Activate
                                                                        </>

                                                                    )}

                                                                </button>

                                                            )}

                                                        </td>

                                                    </tr>
                                                );
                                            })}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">

                            <p className="text-sm text-gray-500">
                                Page{" "}
                                <span className="font-bold">
                                    {page}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold">
                                    {totalPages}
                                </span>
                            </p>

                            <div className="join">

                                <button
                                    type="button"
                                    className="join-item btn"
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                >
                                    <FaChevronLeft />
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    className="join-item btn"
                                    disabled={page >= totalPages}
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.min(
                                                totalPages,
                                                prev + 1
                                            )
                                        )
                                    }
                                >
                                    Next
                                    <FaChevronRight />
                                </button>

                            </div>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default AdminUsers;
