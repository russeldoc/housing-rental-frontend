import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaArrowLeft,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const PropertyDetails = () => {
    const { id } = useParams();
    const { authUser } = useAuth();

    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [existingRequest, setExistingRequest] = useState(null);
    const [requestLoading, setRequestLoading] = useState(false);

    // Load property from FastAPI
    useEffect(() => {
        const loadProperty = async () => {
            try {
                setIsLoading(true);
                setError("");

                let data;

                try {
                    // First try to get the property normally.
                    data = await apiRequest(`/properties/${id}`);
                } catch (error) {
                    // If unavailable, try the paginated endpoint.
                    const unavailableData = await apiRequest(
                        `/properties/?property_id=${id}&is_available=false`
                    );

                    data = unavailableData.items?.[0];

                    if (!data) {
                        throw error;
                    }
                }

                setProperty(data);
            } catch (error) {
                console.error("Failed to load property:", error);

                setProperty(null);
                setError(
                    error.message || "Failed to load property."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProperty();
    }, [id]);

    // Check whether the logged-in user already has a rental request
    useEffect(() => {
        const loadExistingRequest = async () => {
            if (!authUser) {
                setExistingRequest(null);
                return;
            }

            try {
                setRequestLoading(true);

                const data = await apiRequest(
                    `/rental-requests/my?property_id=${id}&page=1&page_size=100`
                );

                const requests = data.items || [];

                // Prefer an active/pending request if there is one.
                const request =
                    requests.find(
                        (item) => item.status === "pending"
                    ) ||
                    requests[0] ||
                    null;

                setExistingRequest(request);
            } catch (error) {
                console.error(
                    "Failed to check rental request:",
                    error
                );

                setExistingRequest(null);
            } finally {
                setRequestLoading(false);
            }
        };

        loadExistingRequest();
    }, [id, authUser]);

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Property not found / API error
    if (!property) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Property Not Found
                </h1>

                <p className="text-gray-500 mb-6">
                    {error ||
                        "The property you are looking for does not exist."}
                </p>

                <Link
                    to="/properties"
                    className="btn btn-primary"
                >
                    <FaArrowLeft />
                    Back to Properties
                </Link>
            </div>
        );
    }

    const isUnavailable = !property.is_available;

    const statusClass = (status) => {
        if (status === "approved") {
            return "badge-success";
        }

        if (status === "rejected") {
            return "badge-error";
        }

        return "badge-warning";
    };

    return (
        <div className="bg-base-200 min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Back Button */}
                <Link
                    to="/properties"
                    className="btn btn-ghost mb-6"
                >
                    <FaArrowLeft />
                    Back to Properties
                </Link>

                <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">

                    {/* Property Image */}
                    <img
                        src={
                            property.image_url ||
                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={property.title}
                        className="w-full h-[300px] md:h-[500px] object-cover"
                    />

                    <div className="p-6 md:p-10">

                        {/* Title / Location / Price */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                            <div>

                                <div
                                    className={`badge mb-3 ${isUnavailable
                                            ? "badge-error"
                                            : "badge-primary"
                                        }`}
                                >
                                    {isUnavailable
                                        ? "Not Available"
                                        : "Available"}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold">
                                    {property.title}
                                </h1>

                                <p className="flex items-center gap-2 text-gray-500 mt-3">
                                    <FaMapMarkerAlt />
                                    {property.location}
                                </p>

                            </div>

                            <div>
                                <p className="text-3xl font-bold text-primary">
                                    ৳
                                    {Number(
                                        property.monthly_rent
                                    ).toLocaleString()}
                                </p>

                                <p className="text-gray-500">
                                    per month
                                </p>
                            </div>

                        </div>

                        <div className="divider" />

                        {/* Property Information */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaBed className="text-2xl mx-auto mb-2 text-primary" />

                                <p className="font-bold text-lg">
                                    {property.bedrooms}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Bedrooms
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaBath className="text-2xl mx-auto mb-2 text-primary" />

                                <p className="font-bold text-lg">
                                    {property.bathrooms}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Bathrooms
                                </p>
                            </div>

                        </div>

                        {/* Description */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">
                                About This Property
                            </h2>

                            <p className="text-gray-600 leading-7">
                                {property.description ||
                                    "No description has been provided for this property."}
                            </p>
                        </div>

                        {/* Rental Request */}
                        <div className="mt-10 bg-primary text-primary-content rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">

                            <div>
                                <h2 className="text-2xl font-bold">
                                    Interested in this property?
                                </h2>

                                <p className="mt-2 opacity-90">
                                    {isUnavailable
                                        ? "This property has already been approved for another renter and is no longer available."
                                        : requestLoading
                                            ? "Checking your rental request..."
                                            : existingRequest
                                                ? "You have already submitted a rental request for this property."
                                                : "Submit a rental request to get started."}
                                </p>
                            </div>

                            {isUnavailable ? (

                                <span className="badge badge-error badge-lg">
                                    Not Available
                                </span>

                            ) : requestLoading ? (

                                <span className="loading loading-spinner loading-md"></span>

                            ) : existingRequest ? (

                                <div className="text-center">

                                    <span
                                        className={`badge badge-lg ${statusClass(
                                            existingRequest.status
                                        )}`}
                                    >
                                        {existingRequest.status}
                                    </span>

                                    <p className="text-sm mt-2">
                                        Request already submitted
                                    </p>

                                    <Link
                                        to="/my-requests"
                                        className="btn btn-outline mt-3"
                                    >
                                        View My Requests
                                    </Link>

                                </div>

                            ) : authUser ? (

                                <Link
                                    to={`/properties/${property.id}/request`}
                                    className="btn btn-secondary"
                                >
                                    Request to Rent
                                </Link>

                            ) : (

                                <Link
                                    to="/login"
                                    className="btn btn-secondary"
                                >
                                    Login to Request
                                </Link>

                            )}

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default PropertyDetails;
