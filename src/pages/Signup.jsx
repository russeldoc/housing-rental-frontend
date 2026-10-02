const Signup = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">

            <div className="card bg-base-100 shadow-xl w-full max-w-md">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center mb-6">
                        Create Account
                    </h2>

                    <form className="space-y-4">

                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input input-bordered w-full"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="input input-bordered w-full"
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Create Account
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Signup;