
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

import { addProperty } from "../../services/propertyStorage";

const initialForm = {
    title: "",
    location: "",
    price: "",
    bedrooms: "2",
    bathrooms: "1",
    area: "",
    type: "Apartment",
    status: "Available",
    image: "",
    description: "",
};

const AddProperty = () => {
    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.title.trim() ||
            !formData.location.trim() ||
            !formData.price ||
            !formData.area ||
            !formData.description.trim() ||
            !formData.image.trim()
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (Number(formData.price) <= 0 || Number(formData.area) <= 0) {
            toast.error("Price and area must be greater than zero.");
            return;
        }

        setIsSubmitting(true);

        try {
            addProperty({
                ...formData,
                title: formData.title.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                image: formData.image.trim(),
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area: Number(formData.area),
            });

            toast.success("Property added successfully!");
            navigate("/admin/properties");
        } catch (error) {
            console.error("Error adding property:", error);
            toast.error("Could not add the property.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            Add New Property
                        </h1>

                        <p className="text-base-content/60 mb-4">
                            Enter the details of the rental property.
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
                                        placeholder="e.g. Modern Family Apartment"
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
                                        placeholder="e.g. Uttara, Dhaka"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Monthly Price */}
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
                                        placeholder="25000"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Area */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Area (sq ft) *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="1100"
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
                                        min="0"
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
                                        min="0"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Property Type */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Property Type *
                                        </span>
                                    </label>

                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="Apartment">
                                            Apartment
                                        </option>
                                        <option value="Flat">Flat</option>
                                        <option value="House">House</option>
                                    </select>
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
                                        <option value="Rented">Rented</option>
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
                                        placeholder="https://example.com/property.jpg"
                                        className="input input-bordered w-full"
                                        required
                                    />

                                    <p className="text-xs text-base-content/60 mt-2">
                                        Paste a publicly accessible image URL.
                                    </p>
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
                                        placeholder="Describe the property, its features and nearby facilities..."
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
                                        : "Save Property"}
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
