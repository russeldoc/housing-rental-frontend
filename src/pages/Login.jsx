import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">

            <div className="card bg-base-100 shadow-xl w-full max-w-md">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center mb-6">
                        Login
                    </h2>

                    <form className="space-y-4">

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email
                                </span>
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
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
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Login
                        </button>

                    </form>

                    <div className="text-center mt-4">

                        <Link
                            to="/forgot-password"
                            className="link link-primary"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    <p className="text-center mt-3">
                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="link link-primary"
                        >
                            Signup
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;