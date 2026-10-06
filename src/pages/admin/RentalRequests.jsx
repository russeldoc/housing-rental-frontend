import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaClipboardList,
    FaMapMarkerAlt,
    FaCheck,
    FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { apiRequest } from "../../services/api";

const RentalRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("All");

    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const loadRequests = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const data = await apiRequest(
                "/rental-requests/?page=1&page_size=100"
            );

            console.log(
                "Rental requests from backend:",
                data
            );

            setRequests(data.items || []);
        } catch (error) {
            console.error(
                "Failed to load rental requests:",
                error
            );

            setError(
                error.message ||
                "Could not load rental requests."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleStatusChange = async (
        requestId,
        status
    ) => {
        setUpdatingId(requestId);

        try {
            await apiRequest(
                `/rental-requests/${requestId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            toast.success(
                status === "approved"
                    ? "Rental request approved!"
                    : "Rental request rejected."
            );

            // Reload from backend so the UI matches PostgreSQL
            await loadRequests();
        } catch (error) {
            console.error(
                "Failed to update rental request:",
                error
            );

            toast.error(
                error.message ||
                "Could not update this rental request."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredRequests =
        filter === "All"
            ? requests
            : requests.filter(
                (request) =>
                    request.status?.toLowerCase() ===
                    filter.toLowerCase()
            );

    const statusClass = (status) => {
        const normalizedStatus =
            status?.toLowerCase();

        if (normalizedStatus === "approved") {
            return "badge-success";
        }

        if (normalizedStatus === "rejected") {
            return "badge-error";
        }

        return "badge-warning";
    };

    const statusText = (status) => {
        if (!status) return "Pending";

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1).toLowerCase()
        );
    };

    const pendingCount = requests.filter(
        (request) =>
            request.status?.toLowerCase() === "pending"
    ).length;

    const approvedCount = requests.filter(
        (request) =>
            request.status?.toLowerCase() === "approved"
    ).length;

    const rejectedCount = requests.filter(
        (request) =>
            request.status?.toLowerCase() === "rejected"
    ).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <FaClipboardList className="text-3xl text-primary" />

                        <h1 className="text-3xl font-bold">
                            Rental Request Management
                        </h1>
                    </div>

                    <p className="text-gray-500 mt-2">
                        Review requests and manage their status.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="alert alert-error mb-6"
                    >
                        {error}
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    <div className="stat bg-base-100 rounded-xl shadow">
                        <div className="stat-title">
                            Pending
                        </div>

                        <div className="stat-value text-warning">
                            {pendingCount}
                        </div>
                    </div>

                    <div className="stat bg-base-100 rounded-xl shadow">
                        <div className="stat-title">
                            Approved
                        </div>

                        <div className="stat-value text-success">
                            {approvedCount}
                        </div>
                    </div>

                    <div className="stat bg-base-100 rounded-xl shadow">
                        <div className="stat-title">
                            Rejected
                        </div>

                        <div className="stat-value text-error">
                            {rejectedCount}
                        </div>
                    </div>

                </div>

                {/* Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                    <h2 className="text-xl font-bold">
                        Requests ({filteredRequests.length})
                    </h2>

                    <select
                        className="select select-bordered w-full sm:w-56"
                        value={filter}
                        onChange={(event) =>
                            setFilter(event.target.value)
                        }
                    >
                        <option value="All">
                            All Requests
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>
                    </select>

                </div>

                {/* No requests */}
                {filteredRequests.length === 0 ? (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body items-center text-center py-14">

                            <FaClipboardList className="text-5xl text-gray-300" />

                            <h3 className="text-xl font-bold mt-3">
                                No Requests Found
                            </h3>

                            <p className="text-gray-500">
                                There are no rental requests
                                in this category yet.
                            </p>

                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {filteredRequests.map((request) => {

                            const isUpdating =
                                updatingId === request.id;

                            const normalizedStatus =
                                request.status?.toLowerCase();

                            return (
                                <div
                                    key={request.id}
                                    className="card bg-base-100 shadow-md"
                                >
                                    <div className="card-body">

                                        {/* Request header */}
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                            <div>
                                                <h2 className="card-title">
                                                    Rental Request #
                                                    {request.id}
                                                </h2>

                                                <p className="flex items-center gap-2 text-gray-500 mt-2">
                                                    <FaMapMarkerAlt />

                                                    Property ID:{" "}
                                                    {request.property_id}
                                                </p>
                                            </div>

                                            <span
                                                className={`badge ${statusClass(
                                                    request.status
                                                )}`}
                                            >
                                                {statusText(
                                                    request.status
                                                )}
                                            </span>

                                        </div>

                                        {/* Request information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">

                                            <p>
                                                <strong>
                                                    Request ID:
                                                </strong>{" "}
                                                {request.id}
                                            </p>

                                            <p>
                                                <strong>
                                                    Tenant ID:
                                                </strong>{" "}
                                                {request.tenant_id}
                                            </p>

                                            <p>
                                                <strong>
                                                    Property ID:
                                                </strong>{" "}
                                                {request.property_id}
                                            </p>

                                            <p>
                                                <strong>
                                                    Submitted:
                                                </strong>{" "}
                                                {request.created_at
                                                    ? new Date(
                                                        request.created_at
                                                    ).toLocaleDateString()
                                                    : "Date unavailable"}
                                            </p>

                                        </div>

                                        {/* Message */}
                                        {request.message && (
                                            <div className="bg-base-200 rounded-lg p-4 mt-4">

                                                <p className="font-semibold mb-2">
                                                    Tenant Message
                                                </p>

                                                <p className="text-gray-600 whitespace-pre-line">
                                                    {request.message}
                                                </p>

                                            </div>
                                        )}

                                        {/* Actions */}
                                        {normalizedStatus ===
                                            "pending" && (
                                                <div className="card-actions justify-end mt-5 gap-2">

                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        disabled={
                                                            isUpdating
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                request.id,
                                                                "approved"
                                                            )
                                                        }
                                                    >
                                                        {isUpdating ? (
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                        ) : (
                                                            <FaCheck />
                                                        )}

                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-error"
                                                        disabled={
                                                            isUpdating
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                request.id,
                                                                "rejected"
                                                            )
                                                        }
                                                    >
                                                        {isUpdating ? (
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                        ) : (
                                                            <FaTimes />
                                                        )}

                                                        Reject
                                                    </button>

                                                </div>
                                            )}

                                        {/* View property */}
                                        <div className="card-actions justify-end mt-3">

                                            <Link
                                                to={`/properties/${request.property_id}`}
                                                className="btn btn-outline btn-primary btn-sm"
                                            >
                                                View Property
                                            </Link>

                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
};

export default RentalRequests;
