
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const users = JSON.parse(
            localStorage.getItem("registeredUsers") || "[]"
        );

        const emailExists = users.some(
            (user) => user.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (emailExists) {
            toast.error("An account with this email already exists.");
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            password,
            role: "user",
        };

        users.push(newUser);

        localStorage.setItem("registeredUsers", JSON.stringify(users));

        toast.success("Account created! Please sign in.");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center">
                        Create Account
                    </h1>

                    <p className="text-center text-gray-500 mb-4">
                        Join HomeRent to find your next home
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>

                            <input
                                type="password"
                                className="input input-bordered w-full"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;