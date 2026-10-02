
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Read registered users from localStorage
        const users = JSON.parse(
            localStorage.getItem("registeredUsers") || "[]"
        );

        // Find a matching account
        const user = users.find(
            (item) =>
                item.email.toLowerCase() === email.trim().toLowerCase() &&
                item.password === password
        );

        if (!user) {
            toast.error("Invalid email or password!");
            return;
        }

        // Demo token only. FastAPI will provide the real JWT later.
        const demoToken = `demo-token-${Date.now()}`;

        const { password: savedPassword, ...safeUser } = user;

        login(safeUser, demoToken);

        toast.success("Login successful!");

        const requestedPath = location.state?.from?.pathname;

        if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//")) {
            navigate(requestedPath, { replace: true });
        } else if (safeUser.role === "admin") {
            navigate("/admin", { replace: true });
        } else {
            navigate("/dashboard", { replace: true });
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>

                            <input
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>

                            <input
                                type="password"
                                className="input input-bordered w-full"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                        <button type="submit" className="btn btn-primary w-full">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="link link-primary font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;