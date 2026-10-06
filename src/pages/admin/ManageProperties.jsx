import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaMapMarkerAlt,
    FaBed,
    FaBath,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { apiRequest } from "../../services/api";

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load properties from PostgreSQL through FastAPI
    const loadProperties = async () => {
        try {
            setIsLoading(true);

            const data = await apiRequest(
                "/properties/?page=1&page_size=100"
            );

            setProperties(data.items || []);
        } catch (error) {
            console.error("Error loading properties:", error);

            toast.error(
                error.message || "Could not load properties."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProperties();
    }, []);

    // Delete property
    const handleDelete = async (id, title) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) return;

        try {
            await apiRequest(`/properties/${id}`, {
                method: "DELETE",
            });

            toast.success("Property deleted successfully!");

            // Reload properties from PostgreSQL
            await loadProperties();
        } catch (error) {
            console.error("Error deleting property:", error);

            // Property has rental requests
            if (
                error.message?.includes(
                    "This property has rental requests"
                )
            ) {
                toast.error(
                    "This property has rental history. Please set it to Not Available instead of deleting it.",
                    {
                        duration: 5000,
                    }
                );

                return;
            }

            // Other errors
            toast.error(
                error.message || "Could not delete the property."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Manage Properties
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Add, edit, and manage your rental properties.
                        </p>
                    </div>

                    <Link
                        to="/admin/properties/add"
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        Add Property
                    </Link>

                </div>

                {/* Total Properties */}
                <div className="mb-5">
                    <p className="text-gray-500">
                        Total properties:{" "}
                        <span className="font-bold text-base-content">
                            {properties.length}
                        </span>
                    </p>
                </div>

                {/* Empty State */}
                {properties.length === 0 ? (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body text-center items-center py-12">

                            <h2 className="text-xl font-bold">
                                No properties found
                            </h2>

                            <p className="text-gray-500">
                                Add your first rental property to get started.
                            </p>

                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {properties.map((property) => {

                            const isAvailable = property.is_available;

                            return (
                                <div
                                    key={property.id}
                                    className="card bg-base-100 shadow-md"
                                >

                                    {/* Image */}
                                    <figure className="h-52">

                                        <img
                                            src={
                                                property.image_url ||
                                                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
                                            }
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />

                                    </figure>

                                    <div className="card-body">

                                        {/* Title */}
                                        <h2 className="card-title">
                                            {property.title}
                                        </h2>

                                        {/* Location */}
                                        <p className="flex items-center gap-2 text-gray-500">
                                            <FaMapMarkerAlt />
                                            {property.location}
                                        </p>

                                        {/* Rent */}
                                        <p className="text-xl font-bold text-primary">
                                            ৳
                                            {Number(
                                                property.monthly_rent
                                            ).toLocaleString()}

                                            <span className="text-sm font-normal text-gray-500">
                                                {" "}/ month
                                            </span>
                                        </p>

                                        {/* Property Details */}
                                        <div className="flex flex-wrap gap-2 mt-2">

                                            <span className="badge badge-outline">
                                                <FaBed className="mr-1" />
                                                {property.bedrooms} Bedrooms
                                            </span>

                                            <span className="badge badge-outline">
                                                <FaBath className="mr-1" />
                                                {property.bathrooms} Bathrooms
                                            </span>

                                            <span
                                                className={`badge ${isAvailable
                                                        ? "badge-success"
                                                        : "badge-error"
                                                    }`}
                                            >
                                                {isAvailable
                                                    ? "Available"
                                                    : "Not Available"}
                                            </span>

                                        </div>

                                        {/* Buttons */}
                                        <div className="card-actions justify-end mt-4">

                                            {/* Edit */}
                                            <Link
                                                to={`/admin/properties/edit/${property.id}`}
                                                className="btn btn-outline btn-primary btn-sm"
                                            >
                                                <FaEdit />
                                                Edit
                                            </Link>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        property.id,
                                                        property.title
                                                    )
                                                }
                                                className="btn btn-error btn-outline btn-sm"
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>

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

export default ManageProperties;

