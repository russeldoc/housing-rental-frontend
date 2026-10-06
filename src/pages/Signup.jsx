import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { API_BASE_URL } from "../services/api";

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        family_members: "1",
        home_district: "",
        national_id: "",
        passport_number: "",
        password: "",
        confirmPassword: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (
            !formData.national_id.trim() &&
            !formData.passport_number.trim()
        ) {
            toast.error(
                "Enter either your National ID or passport number."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                phone_number: formData.phone_number.trim(),
                family_members: Number(formData.family_members),
                home_district: formData.home_district.trim(),
                national_id: formData.national_id.trim() || null,
                passport_number:
                    formData.passport_number.trim() || null,
                password: formData.password,
            };

            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const detail = data?.detail;

                const message = Array.isArray(detail)
                    ? detail.map((item) => item.msg).join(", ")
                    : detail || "Registration failed.";

                throw new Error(message);
            }

            toast.success("Account created! Please sign in.");
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error(error.message || "Unable to create account.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
            <div className="card bg-base-100 shadow-xl w-full max-w-lg">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center">
                        Create Account
                    </h1>

                    <p className="text-center text-gray-500 mb-4">
                        Join HomeRent to find your next home
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3"
                    >
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Full Name
                                </span>
                            </label>
                            <input
                                name="full_name"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                                value={formData.full_name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email Address
                                </span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Phone Number
                                </span>
                            </label>
                            <input
                                name="phone_number"
                                type="tel"
                                className="input input-bordered w-full"
                                placeholder="Your phone number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                autoComplete="tel"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Home District
                                </span>
                            </label>
                            <input
                                name="home_district"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="e.g. Dhaka"
                                value={formData.home_district}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Family Members
                                </span>
                            </label>
                            <input
                                name="family_members"
                                type="number"
                                min="1"
                                max="50"
                                className="input input-bordered w-full"
                                value={formData.family_members}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    National ID (NID)
                                </span>
                            </label>
                            <input
                                name="national_id"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Enter NID, if available"
                                value={formData.national_id}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Passport Number
                                </span>
                            </label>
                            <input
                                name="passport_number"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Enter passport, if available"
                                value={formData.passport_number}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Provide either your NID or passport number.
                            </p>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Password
                                </span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                className="input input-bordered w-full"
                                placeholder="At least 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Confirm Password
                                </span>
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="input input-bordered w-full"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="link link-primary font-semibold"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;