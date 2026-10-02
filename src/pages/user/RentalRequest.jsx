
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

import properties from "../../data/properties";
import { useAuth } from "../../context/AuthContext";
import { createRentalRequest } from "../../services/rentalRequests";

const RentalRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuth();

    const property = properties.find(
        (item) => item.id === Number(id)
    );

    const [moveInDate, setMoveInDate] = useState("");
    const [message, setMessage] = useState("");

    const today = new Date().toISOString().split("T")[0];

    if (!property) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-16 text-center">
                <h1 className="text-3xl font-bold">Property Not Found</h1>
                <Link to="/properties" className="btn btn-primary mt-6">
                    Back to Properties
                </Link>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!moveInDate) {
            toast.error("Please select your preferred move-in date.");
            return;
        }

        if (moveInDate < today) {
            toast.error("Move-in date cannot be in the past.");
            return;
        }

        const result = createRentalRequest({
            propertyId: property.id,
            propertyTitle: property.title,
            propertyLocation: property.location,
            monthlyRent: property.price,
            userEmail: authUser.email,
            userName: authUser.name,
            moveInDate,
            message: message.trim(),
        });

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success("Rental request submitted!");
        navigate("/my-requests");
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <Link to={`/properties/${property.id}`} className="btn btn-ghost mb-5">
                    <FaArrowLeft />
                    Back to Property
                </Link>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h1 className="text-3xl font-bold">Request to Rent</h1>
                        <p className="text-gray-500">
                            Complete the form to submit your rental request.
                        </p>

                        <div className="bg-base-200 rounded-xl p-4 my-3">
                            <h2 className="font-bold text-lg">{property.title}</h2>
                            <p className="text-gray-500">{property.location}</p>
                            <p className="text-primary font-bold text-xl mt-2">
                                ৳{property.price.toLocaleString()} / month
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Your Name</span>
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    value={authUser?.name || ""}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={authUser?.email || ""}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Preferred Move-in Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    min={today}
                                    value={moveInDate}
                                    onChange={(e) => setMoveInDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Message (Optional)</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Tell the property owner a little about your rental needs."
                                    rows={4}
                                    maxLength={500}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 text-right">
                                    {message.length}/500 characters
                                </p>
                            </div>

                            <button type="submit" className="btn btn-primary w-full">
                                Submit Rental Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalRequest;