
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaHome,
    FaCheck,
    FaArrowLeft,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import {
    getProperties,
    subscribeToPropertyChanges,
} from "../services/propertyStorage";
import { getRentalRequests } from "../services/rentalRequests";

const PropertyDetails = () => {
    const { id } = useParams();
    const { authUser } = useAuth();

    const [property, setProperty] = useState(() =>
        getProperties().find((item) => String(item.id) === String(id))
    );

    const [existingRequest, setExistingRequest] = useState(null);

    const isUnavailable =
        property?.availability === "Not Available";

    useEffect(() => {
        const refreshProperty = () => {
            const updatedProperty = getProperties().find(
                (item) => String(item.id) === String(id)
            );

            setProperty(updatedProperty);
        };

        refreshProperty();

        return subscribeToPropertyChanges(refreshProperty);
    }, [id]);

    useEffect(() => {
        const refreshRequest = () => {
            if (!authUser?.email) {
                setExistingRequest(null);
                return;
            }

            const userEmail = authUser.email.trim().toLowerCase();

            const request = getRentalRequests().find(
                (item) =>
                    item.userEmail?.trim().toLowerCase() === userEmail &&
                    String(item.propertyId) === String(id)
            );

            setExistingRequest(request || null);
        };

        refreshRequest();

        window.addEventListener("focus", refreshRequest);

        const handleStorageChange = (event) => {
            if (
                event.key === "rentalRequests" ||
                event.key === null
            ) {
                refreshRequest();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("focus", refreshRequest);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [id, authUser?.email]);

    if (!property) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Property Not Found
                </h1>

                <p className="text-gray-500 mb-6">
                    The property you are looking for does not exist.
                </p>

                <Link to="/properties" className="btn btn-primary">
                    <FaArrowLeft />
                    Back to Properties
                </Link>
            </div>
        );
    }

    const statusClass = (status) => {
        if (status === "Approved") return "badge-success";
        if (status === "Rejected") return "badge-error";
        return "badge-warning";
    };

    return (
        <div className="bg-base-200 min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-10">
                <Link to="/properties" className="btn btn-ghost mb-6">
                    <FaArrowLeft />
                    Back to Properties
                </Link>

                <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-[300px] md:h-[500px] object-cover"
                    />

                    <div className="p-6 md:p-10">
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
                                        : property.status}
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
                                    ৳{Number(property.price).toLocaleString()}
                                </p>

                                <p className="text-gray-500">per month</p>
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaRulerCombined className="text-2xl mx-auto mb-2 text-primary" />
                                <p className="font-bold text-lg">
                                    {property.area}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Square Feet
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaHome className="text-2xl mx-auto mb-2 text-primary" />
                                <p className="font-bold text-lg">
                                    {property.type}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Property Type
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">
                                About This Property
                            </h2>

                            <p className="text-gray-600 leading-7">
                                {property.description ||
                                    "This property offers a comfortable living environment with convenient facilities and a great location."}
                            </p>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-5">
                                Amenities
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(property.amenities || []).map(
                                    (amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="text-success">
                                                <FaCheck />
                                            </div>
                                            <span>{amenity}</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mt-10 bg-primary text-primary-content rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Interested in this property?
                                </h2>

                                <p className="mt-2 opacity-90">
                                    {isUnavailable
                                        ? "This property has already been approved for another renter and is no longer available."
                                        : existingRequest
                                            ? "You have already submitted a rental request for this property."
                                            : "Submit a rental request to get started."}
                                </p>
                            </div>

                            {isUnavailable ? (
                                <span className="badge badge-error badge-lg">
                                    Not Available
                                </span>
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
