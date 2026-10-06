import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

import { apiRequest } from "../../services/api";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load property from FastAPI
    useEffect(() => {
        const loadProperty = async () => {
            try {
                const property = await apiRequest(`/properties/${id}`);

                setFormData({
                    title: property.title ?? "",
                    location: property.location ?? "",
                    price: property.monthly_rent ?? "",
                    bedrooms: property.bedrooms ?? 1,
                    bathrooms: property.bathrooms ?? 1,
                    image: property.image_url ?? "",
                    description: property.description ?? "",
                    status: property.is_available
                        ? "Available"
                        : "Not Available",
                });
            } catch (error) {
                console.error("Error loading property:", error);
                toast.error("Property not found.");
                navigate("/admin/properties", { replace: true });
            }
        };

        loadProperty();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.title.trim() ||
            !formData.location.trim() ||
            !formData.price ||
            !formData.image.trim() ||
            !formData.description.trim()
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (
            Number(formData.price) <= 0 ||
            Number(formData.bedrooms) < 1 ||
            Number(formData.bathrooms) < 1
        ) {
            toast.error("Please enter valid property numbers.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Send updated property to FastAPI
            const updatedProperty = await apiRequest(
                `/properties/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                        location: formData.location.trim(),
                        monthly_rent: Number(formData.price),
                        bedrooms: Number(formData.bedrooms),
                        bathrooms: Number(formData.bathrooms),
                        image_url: formData.image.trim(),
                        is_available:
                            formData.status === "Available",
                    }),
                }
            );

            console.log(
                "Updated property from backend:",
                updatedProperty
            );

            toast.success("Property updated successfully!");

            navigate("/admin/properties");
        } catch (error) {
            console.error("Error updating property:", error);
            toast.error(
                error.message || "Could not update the property."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!formData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-4xl mx-auto">

                <Link
                    to="/admin/properties"
                    className="btn btn-ghost mb-5"
                >
                    <FaArrowLeft />
                    Back to Manage Properties
                </Link>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">

                        <h1 className="text-3xl font-bold">
                            Edit Property
                        </h1>

                        <p className="text-base-content/60 mb-4">
                            Update the details of this rental property.
                        </p>

                        <form onSubmit={handleSubmit}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Property Title */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Property Title *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Location *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Monthly Rent */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Monthly Rent (৳) *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Bedrooms */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Bedrooms *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Bathrooms */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Bathrooms *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Status */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Status *
                                        </span>
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="Available">
                                            Available
                                        </option>

                                        <option value="Not Available">
                                            Not Available
                                        </option>
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Image URL *
                                        </span>
                                    </label>

                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required
                                    />

                                    {formData.image && (
                                        <img
                                            src={formData.image}
                                            alt="Property preview"
                                            className="mt-3 h-48 w-full rounded-lg object-cover"
                                        />
                                    )}
                                </div>

                                {/* Description */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Description *
                                        </span>
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered w-full min-h-32"
                                        required
                                    />
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

                                <Link
                                    to="/admin/properties"
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    <FaSave />

                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProperty;
