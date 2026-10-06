import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaClipboardList,
    FaMapMarkerAlt,
} from "react-icons/fa";

import { apiRequest } from "../../services/api";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMyRequests = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const data = await apiRequest(
                "/rental-requests/my?page=1&page_size=100"
            );

            console.log("My rental requests from backend:", data);

            setRequests(data.items || []);
        } catch (error) {
            console.error(
                "Failed to load rental requests:",
                error
            );

            setError(
                error.message ||
                "Could not load your rental requests."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMyRequests();
    }, [loadMyRequests]);

    const statusClass = (status) => {
        const normalizedStatus = status?.toLowerCase();

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold">
                    My Rental Requests
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Track the status of your property rental requests.
                </p>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="alert alert-error mb-6"
                    >
                        {error}
                    </div>
                )}

                {/* No requests */}
                {!error && requests.length === 0 ? (
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body items-center text-center py-14">

                            <FaClipboardList className="text-5xl text-gray-400" />

                            <h2 className="text-xl font-bold mt-3">
                                No Rental Requests Yet
                            </h2>

                            <p className="text-gray-500">
                                Browse properties and submit a rental
                                request to get started.
                            </p>

                            <Link
                                to="/properties"
                                className="btn btn-primary mt-3"
                            >
                                Browse Properties
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="card bg-base-100 shadow-md"
                            >
                                <div className="card-body">

                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                        <div>
                                            <h2 className="card-title">
                                                Property #{request.property_id}
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
                                            {statusText(request.status)}
                                        </span>
                                    </div>

                                    {/* Request information */}
                                    <div className="mt-4 space-y-2">

                                        <p>
                                            <strong>
                                                Request ID:
                                            </strong>{" "}
                                            {request.id}
                                        </p>

                                        <p>
                                            <strong>
                                                Property ID:
                                            </strong>{" "}
                                            {request.property_id}
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {statusText(
                                                request.status
                                            )}
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
                                                Your request
                                            </p>

                                            <p className="text-gray-600 whitespace-pre-line">
                                                {request.message}
                                            </p>

                                        </div>
                                    )}

                                    {/* View property */}
                                    <div className="card-actions justify-end mt-4">

                                        <Link
                                            to={`/properties/${request.property_id}`}
                                            className="btn btn-outline btn-primary btn-sm"
                                        >
                                            View Property
                                        </Link>

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

export default MyRequests;

