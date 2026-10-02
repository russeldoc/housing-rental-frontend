
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import {
    getProperties,
    deleteProperty,
} from "../../services/propertyStorage";

const ManageProperties = () => {
    const [properties, setProperties] = useState(() => getProperties());

    const handleDelete = (id, title) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) return;

        const updatedProperties = deleteProperty(id);

        setProperties(updatedProperties);
        toast.success("Property deleted successfully!");
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-7xl mx-auto">
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

                <div className="mb-5">
                    <p className="text-gray-500">
                        Total properties:{" "}
                        <span className="font-bold text-base-content">
                            {properties.length}
                        </span>
                    </p>
                </div>

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
                        {properties.map((property) => (
                            <div
                                key={property.id}
                                className="card bg-base-100 shadow-md"
                            >
                                <figure className="h-52">
                                    <img
                                        src={property.image}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>

                                <div className="card-body">
                                    <h2 className="card-title">
                                        {property.title}
                                    </h2>

                                    <p className="flex items-center gap-2 text-gray-500">
                                        <FaMapMarkerAlt />
                                        {property.location}
                                    </p>

                                    <p className="text-xl font-bold text-primary">
                                        ৳{Number(property.price).toLocaleString()}
                                        <span className="text-sm font-normal text-gray-500">
                                            {" "}/ month
                                        </span>
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="badge badge-outline">
                                            {property.type}
                                        </span>
                                        <span className="badge badge-outline">
                                            {property.bedrooms} Bedrooms
                                        </span>
                                        <span className="badge badge-outline">
                                            {property.status}
                                        </span>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        <Link
                                            to={`/admin/properties/edit/${property.id}`}
                                            className="btn btn-outline btn-primary btn-sm"
                                        >
                                            <FaEdit />
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(property.id, property.title)
                                            }
                                            className="btn btn-error btn-outline btn-sm"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
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

export default ManageProperties;
