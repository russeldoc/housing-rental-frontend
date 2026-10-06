import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RentalRequest = () => {
    const { id } = useParams();
    const { authUser } = useAuth();

    const [property, setProperty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        renterName: authUser?.name || authUser?.full_name || "",
        userEmail: authUser?.email || "",
        phone: authUser?.phone_number || "",
        moveInDate: "",
        message: "",
    });

    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    // Load property from backend
    useEffect(() => {
        const loadProperty = async () => {
            setIsLoading(true);

            try {
                let data;

                try {
                    // First try to get the property by ID
                    data = await apiRequest(`/properties/${id}`);
                } catch (error) {
                    // If the property is unavailable,
                    // search for it including unavailable properties
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

                setFeedback({
                    type: "error",
                    message:
                        error.message || "Could not load property.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadProperty();
    }, [id]);

    // Update user information when authUser loads
    useEffect(() => {
        setFormData((previousData) => ({
            ...previousData,

            renterName:
                authUser?.name ||
                authUser?.full_name ||
                previousData.renterName,

            userEmail:
                authUser?.email ||
                previousData.userEmail,

            phone:
                authUser?.phone_number ||
                previousData.phone,
        }));
    }, [authUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setFeedback({
            type: "",
            message: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!property) {
            setFeedback({
                type: "error",
                message: "Property not found.",
            });
            return;
        }

        if (!property.is_available) {
            setFeedback({
                type: "error",
                message:
                    "Sorry, this property is no longer available.",
            });
            return;
        }

        setIsSubmitting(true);

        setFeedback({
            type: "",
            message: "",
        });

        try {
            // Backend currently stores message only.
            // So we include the existing form details inside message.
            const completeMessage = [
                `Applicant Name: ${formData.renterName.trim()}`,
                `Email: ${formData.userEmail.trim()}`,
                `Phone: ${formData.phone.trim()}`,
                `Preferred Move-in Date: ${formData.moveInDate}`,
                "",
                `Message: ${formData.message.trim() ||
                "No additional message."
                }`,
            ].join("\n");

            await apiRequest("/rental-requests/", {
                method: "POST",

                body: JSON.stringify({
                    property_id: Number(property.id),
                    message: completeMessage,
                }),
            });

            toast.success(
                "Rental request submitted successfully!"
            );

            setFeedback({
                type: "success",
                message:
                    "Your rental request has been submitted successfully!",
            });

            setFormData((previousData) => ({
                ...previousData,
                moveInDate: "",
                message: "",
            }));
        } catch (error) {
            console.error("Rental request error:", error);

            setFeedback({
                type: "error",
                message:
                    error.message ||
                    "Could not submit the rental request.",
            });

            toast.error(
                error.message ||
                "Could not submit the rental request."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Property not found
    if (!property) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Property Not Found
                </h1>

                <p className="text-gray-500 mb-6">
                    We could not find this property.
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

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-2xl mx-auto">

                {/* Back to property */}
                <Link
                    to={`/properties/${property.id}`}
                    className="btn btn-ghost mb-6"
                >
                    <FaArrowLeft />
                    Back to Property
                </Link>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-6 md:p-8">

                        <h1 className="text-3xl font-bold">
                            Rental Request
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Submit your details to request this property.
                        </p>

                        {/* Property information */}
                        <div className="bg-base-200 rounded-xl p-4 mt-4">

                            <h2 className="font-bold text-lg">
                                {property.title}
                            </h2>

                            <p className="text-gray-500">
                                {property.location}
                            </p>

                            <p className="text-primary font-bold mt-2">
                                ৳
                                {Number(
                                    property.monthly_rent
                                ).toLocaleString()}
                                {" / month"}
                            </p>

                            {isUnavailable && (
                                <div className="badge badge-error mt-3">
                                    Not Available
                                </div>
                            )}
                        </div>

                        {/* Unavailable message */}
                        {isUnavailable && (
                            <div
                                role="alert"
                                className="alert alert-error mt-4"
                            >
                                This property has already been approved
                                for another renter. You cannot submit
                                a new rental request.
                            </div>
                        )}

                        {/* Feedback */}
                        {feedback.message && (
                            <div
                                role="alert"
                                className={`alert mt-4 ${feedback.type === "success"
                                        ? "alert-success"
                                        : "alert-error"
                                    }`}
                            >
                                {feedback.message}
                            </div>
                        )}

                        {/* Form */}
                        {!isUnavailable && (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 mt-4"
                            >

                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="renterName"
                                        className="label"
                                    >
                                        <span className="label-text font-semibold">
                                            Full Name
                                        </span>
                                    </label>

                                    <input
                                        id="renterName"
                                        name="renterName"
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your full name"
                                        value={formData.renterName}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="userEmail"
                                        className="label"
                                    >
                                        <span className="label-text font-semibold">
                                            Email Address
                                        </span>
                                    </label>

                                    <input
                                        id="userEmail"
                                        name="userEmail"
                                        type="email"
                                        className="input input-bordered w-full"
                                        placeholder="you@example.com"
                                        value={formData.userEmail}
                                        onChange={handleChange}
                                        required
                                        maxLength={254}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="label"
                                    >
                                        <span className="label-text font-semibold">
                                            Phone Number
                                        </span>
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        maxLength={20}
                                    />
                                </div>

                                {/* Move-in date */}
                                <div>
                                    <label
                                        htmlFor="moveInDate"
                                        className="label"
                                    >
                                        <span className="label-text font-semibold">
                                            Preferred Move-in Date
                                        </span>
                                    </label>

                                    <input
                                        id="moveInDate"
                                        name="moveInDate"
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={formData.moveInDate}
                                        onChange={handleChange}
                                        min={new Date().toLocaleDateString(
                                            "en-CA"
                                        )}
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="label"
                                    >
                                        <span className="label-text font-semibold">
                                            Message (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Tell the property owner anything they should know..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        maxLength={1000}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Submit Rental Request
                                        </>
                                    )}
                                </button>

                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalRequest;

