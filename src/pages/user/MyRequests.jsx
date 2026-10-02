
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { getRentalRequests } from "../../services/rentalRequests";

const MyRequests = () => {
    const { authUser } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const allRequests = getRentalRequests();

        const myRequests = allRequests.filter(
            (request) => request.userEmail === authUser?.email
        );

        setRequests(myRequests);
    }, [authUser]);

    const statusClass = (status) => {
        if (status === "Approved") return "badge-success";
        if (status === "Rejected") return "badge-error";
        return "badge-warning";
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold">My Rental Requests</h1>
                <p className="text-gray-500 mt-2 mb-8">
                    Track the status of your property rental requests.
                </p>

                {requests.length === 0 ? (
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body items-center text-center py-14">
                            <FaClipboardList className="text-5xl text-gray-400" />
                            <h2 className="text-xl font-bold mt-3">
                                No Rental Requests Yet
                            </h2>
                            <p className="text-gray-500">
                                Browse properties and submit a rental request to get started.
                            </p>
                            <Link to="/properties" className="btn btn-primary mt-3">
                                Browse Properties
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {requests.map((request) => (
                            <div key={request.id} className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div>
                                            <h2 className="card-title">
                                                {request.propertyTitle}
                                            </h2>
                                            <p className="flex items-center gap-2 text-gray-500 mt-2">
                                                <FaMapMarkerAlt />
                                                {request.propertyLocation}
                                            </p>
                                        </div>

                                        <span className={`badge ${statusClass(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>

                                    <p className="mt-3">
                                        <strong>Monthly rent:</strong>{" "}
                                        ৳{request.monthlyRent.toLocaleString()}
                                    </p>

                                    <p>
                                        <strong>Preferred move-in:</strong>{" "}
                                        {request.moveInDate}
                                    </p>

                                    <p>
                                        <strong>Submitted:</strong>{" "}
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </p>

                                    {request.message && (
                                        <p className="text-gray-600 mt-2">
                                            <strong>Your message:</strong> {request.message}
                                        </p>
                                    )}

                                    <div className="card-actions justify-end mt-3">
                                        <Link
                                            to={`/properties/${request.propertyId}`}
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