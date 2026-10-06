import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { apiRequest } from "../../services/api";

const AddProperty = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        monthly_rent: "",
        bedrooms: "",
        bathrooms: "",
        image_url: "",
        description: "",
        is_available: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle availability
    const handleAvailabilityChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            is_available: e.target.value === "Available",
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (
            !formData.title.trim() ||
            !formData.location.trim() ||
            !formData.monthly_rent ||
            !formData.bedrooms ||
            !formData.bathrooms ||
            !formData.description.trim()
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (Number(formData.monthly_rent) <= 0) {
            toast.error("Monthly rent must be greater than 0.");
            return;
        }

        if (Number(formData.bedrooms) <= 0) {
            toast.error("Bedrooms must be greater than 0.");
            return;
        }

        if (Number(formData.bathrooms) <= 0) {
            toast.error("Bathrooms must be greater than 0.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Send property to FastAPI/PostgreSQL
            await apiRequest("/properties/", {
                method: "POST",
                body: JSON.stringify({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    location: formData.location.trim(),
                    monthly_rent: Number(formData.monthly_rent),
                    bedrooms: Number(formData.bedrooms),
                    bathrooms: Number(formData.bathrooms),
                    image_url: formData.image_url.trim() || null,
                    is_available: formData.is_available,
                }),
            });

            toast.success("Property added successfully!");

            // Go back to Manage Properties
            navigate("/admin/properties");
        } catch (error) {
            console.error("Error adding property:", error);

            toast.error(
                error.message || "Could not add the property."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Add Property
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Add a new rental property to your platform.
                    </p>
                </div>

                {/* Form */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Title */}
                            <div>
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
                                    placeholder="e.g. Modern 3 Bedroom Apartment"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
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
                                    placeholder="e.g. Uttara, Dhaka"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Rent / Bedrooms / Bathrooms */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* Monthly Rent */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Monthly Rent *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="monthly_rent"
                                        value={formData.monthly_rent}
                                        onChange={handleChange}
                                        placeholder="25000"
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Bedrooms */}
                                <div>
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
                                        placeholder="3"
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Bathrooms */}
                                <div>
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
                                        placeholder="2"
                                        min="1"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Image URL
                                    </span>
                                </label>

                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/property-image.jpg"
                                    className="input input-bordered w-full"
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    Enter a valid image URL.
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Description *
                                    </span>
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the property..."
                                    className="textarea textarea-bordered w-full h-32"
                                    required
                                />
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Availability
                                    </span>
                                </label>

                                <select
                                    value={
                                        formData.is_available
                                            ? "Available"
                                            : "Not Available"
                                    }
                                    onChange={handleAvailabilityChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="Not Available">
                                        Not Available
                                    </option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/properties")
                                    }
                                    className="btn btn-outline"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Property"
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddProperty;
