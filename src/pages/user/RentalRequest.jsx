
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

import {
    getProperties,
    subscribeToPropertyChanges,
} from "../../services/propertyStorage";

import {
    createRentalRequest,
} from "../../services/rentalRequests";

const RentalRequest = () => {
    const { id } = useParams();

    const [property, setProperty] = useState(() =>
        getProperties().find(
            (item) => String(item.id) === String(id)
        )
    );

    const [formData, setFormData] = useState({
        renterName: "",
        userEmail: "",
        phone: "",
        moveInDate: "",
        message: "",
    });

    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    const isUnavailable =
        property?.availability === "Not Available";

    useEffect(() => {
        const refreshProperty = () => {
            const foundProperty = getProperties().find(
                (item) => String(item.id) === String(id)
            );

            setProperty(foundProperty);
        };

        refreshProperty();

        return subscribeToPropertyChanges(refreshProperty);
    }, [id]);

    // Refresh availability if rental requests change in another tab.
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (
                event.key === "rentalRequests" ||
                event.key === null
            ) {
                const updatedProperty = getProperties().find(
                    (item) => String(item.id) === String(id)
                );

                setProperty(updatedProperty);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        window.addEventListener("focus", handleStorageChange);

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );

            window.removeEventListener(
                "focus",
                handleStorageChange
            );
        };
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setFeedback({ type: "", message: "" });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!property) {
            setFeedback({
                type: "error",
                message: "Property not found.",
            });
            return;
        }

        // Check current saved data before submitting.
        const currentProperty = getProperties().find(
            (item) => String(item.id) === String(id)
        );

        if (
            !currentProperty ||
            currentProperty.availability === "Not Available"
        ) {
            setProperty(currentProperty);

            setFeedback({
                type: "error",
                message: "Sorry, this property is no longer available.",
            });
            return;
        }

        const result = createRentalRequest({
            propertyId: property.id,
            propertyTitle: property.title,
            renterName: formData.renterName.trim(),
            userEmail: formData.userEmail.trim().toLowerCase(),
            phone: formData.phone.trim(),
            moveInDate: formData.moveInDate,
            message: formData.message.trim(),
        });

        if (!result.success) {
            setFeedback({
                type: "error",
                message: result.message,
            });

            // Refresh in case another request was just approved.
            setProperty(
                getProperties().find(
                    (item) => String(item.id) === String(id)
                )
            );

            return;
        }

        setFeedback({
            type: "success",
            message: "Your rental request has been submitted successfully!",
        });

        setFormData({
            renterName: "",
            userEmail: "",
            phone: "",
            moveInDate: "",
            message: "",
        });
    };

    if (!property) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Property Not Found
                </h1>

                <Link to="/properties" className="btn btn-primary">
                    <FaArrowLeft />
                    Back to Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-2xl mx-auto">
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

                        <div className="bg-base-200 rounded-xl p-4 mt-4">
                            <h2 className="font-bold text-lg">
                                {property.title}
                            </h2>

                            <p className="text-gray-500">
                                {property.location}
                            </p>

                            <p className="text-primary font-bold mt-2">
                                ৳{Number(property.price).toLocaleString()}
                                {" / month"}
                            </p>

                            {isUnavailable && (
                                <div className="badge badge-error mt-3">
                                    Not Available
                                </div>
                            )}
                        </div>

                        {isUnavailable && (
                            <div role="alert" className="alert alert-error mt-4">
                                This property has already been approved for another renter. You cannot submit a new rental request.
                            </div>
                        )}

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

                        {!isUnavailable && (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 mt-4"
                            >
                                <div>
                                    <label htmlFor="renterName" className="label">
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

                                <div>
                                    <label htmlFor="userEmail" className="label">
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

                                <div>
                                    <label htmlFor="phone" className="label">
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

                                <div>
                                    <label htmlFor="moveInDate" className="label">
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
                                        min={new Date().toLocaleDateString("en-CA")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="label">
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

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                >
                                    <FaPaperPlane />
                                    Submit Rental Request
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
