import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, apiRequest } from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Login failed."
                );
            }

            if (!data?.access_token) {
                throw new Error(
                    "The server did not return an access token."
                );
            }

            // Store the token before requesting the profile.
            localStorage.setItem("token", data.access_token);

            if (data.refresh_token) {
                localStorage.setItem(
                    "refreshToken",
                    data.refresh_token
                );
            }

            const user = await apiRequest("/auth/me");

            login(
                user,
                data.access_token,
                data.refresh_token
            );

            toast.success("Login successful!");

            const requestedPath = location.state?.from?.pathname;

            if (
                requestedPath?.startsWith("/") &&
                !requestedPath.startsWith("//")
            ) {
                navigate(requestedPath, { replace: true });
            } else if (user.role === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            toast.error(error.message || "Unable to sign in.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center">
                        Welcome Back
                    </h1>

                    <p className="text-center text-gray-500 mb-4">
                        Sign in to your HomeRent account
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email Address
                                </span>
                            </label>

                            <input
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Password
                                </span>
                            </label>

                            <input
                                type="password"
                                className="input input-bordered w-full"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="link link-primary text-sm"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Signing in..."
                                : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center mt-4">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="link link-primary font-semibold"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;