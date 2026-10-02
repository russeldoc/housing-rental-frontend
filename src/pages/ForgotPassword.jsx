const ForgotPassword = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">

            <div className="card bg-base-100 shadow-xl w-full max-w-md">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center mb-4">
                        Forgot Password?
                    </h2>

                    <p className="text-gray-500 text-center mb-6">
                        Enter your email and we will help you reset your password.
                    </p>

                    <form className="space-y-4">

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Send Reset Link
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default ForgotPassword;