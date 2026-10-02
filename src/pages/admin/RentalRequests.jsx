
import { useState } from "react";
import { FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import {
    getRentalRequests,
    updateRentalRequestStatus,
} from "../../services/rentalRequests";

const RentalRequests = () => {
    const [requests, setRequests] = useState(() => getRentalRequests());
    const [filter, setFilter] = useState("All");

    const handleStatusChange = (requestId, status) => {
        const success = updateRentalRequestStatus(requestId, status);

        if (!success) {
            toast.error("Could not update this request.");
            setRequests(getRentalRequests());
            return;
        }

        setRequests(getRentalRequests());

        toast.success(
            status === "Approved"
                ? "Rental request approved!"
                : "Rental request rejected."
        );
    };

    const filteredRequests =
        filter === "All"
            ? requests
            : requests.filter((request) => request.status === filter);

    const statusClass = (status) => {
        if (status === "Approved") return "badge-success";
        if (status === "Rejected") return "badge-error";
        return "badge-warning";
    };

    const pendingCount = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const approvedCount = requests.filter(
        (request) => request.status === "Approved"
    ).length;

    const rejectedCount = requests.filter(
        (request) => request.status === "Rejected"
    ).length;

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-7xl mx-auto">
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

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="stat bg-base-100 rounded-xl shadow">
                        <div className="stat-title">Pending</div>
                        <div className="stat-value text-warning">{pendingCount}</div>
                    </div>

                    <div className="stat bg-base-100 rounded-xl shadow">
                        <div className="stat-title">Approved</div>
                        <div className="stat-value text-success">{approvedCount}</div>
                    </div>

                    <div className="stat bg-base-100 rounded-xl shadow">
                        <div className="stat-title">Rejected</div>
                        <div className="stat-value text-error">{rejectedCount}</div>
                    </div>
                </div>

                {/* Status filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold">
                        Requests ({filteredRequests.length})
                    </h2>

                    <select
                        className="select select-bordered w-full sm:w-56"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Requests</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {/* Request list */}
                {filteredRequests.length === 0 ? (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body items-center text-center py-14">
                            <FaClipboardList className="text-5xl text-gray-300" />

                            <h3 className="text-xl font-bold mt-3">
                                No Requests Found
                            </h3>

                            <p className="text-gray-500">
                                There are no requests in this category yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="card bg-base-100 shadow-md"
                            >
                                <div className="card-body">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-xl font-bold">
                                                    {request.propertyTitle}
                                                </h3>

                                                <span className={`badge ${statusClass(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            <p className="flex items-center gap-2 text-gray-500 mt-2">
                                                <FaMapMarkerAlt />
                                                {request.propertyLocation}
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                                                <p>
                                                    <strong>Applicant:</strong> {request.userName}
                                                </p>

                                                <p className="break-all">
                                                    <strong>Email:</strong> {request.userEmail}
                                                </p>

                                                <p>
                                                    <strong>Monthly rent:</strong>{" "}
                                                    ৳{request.monthlyRent.toLocaleString()}
                                                </p>

                                                <p>
                                                    <strong>Move-in date:</strong> {request.moveInDate}
                                                </p>

                                                <p>
                                                    <strong>Submitted:</strong>{" "}
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {request.message && (
                                                <div className="bg-base-200 rounded-lg p-4 mt-4">
                                                    <p className="font-semibold mb-1">
                                                        Applicant's message
                                                    </p>
                                                    <p className="text-gray-600">{request.message}</p>
                                                </div>
                                            )}
                                        </div>

                                        {request.status === "Pending" && (
                                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-40">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                        handleStatusChange(request.id, "Approved")
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="btn btn-error btn-outline btn-sm"
                                                    onClick={() =>
                                                        handleStatusChange(request.id, "Rejected")
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RentalRequests;

