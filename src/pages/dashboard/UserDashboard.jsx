
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaClipboardList, FaUser } from "react-icons/fa";

const UserDashboard = () => {
    const { authUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-base-200 px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Welcome, {authUser?.name}!
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Manage your HomeRent account here.
                        </p>
                    </div>

                    <button
                        className="btn btn-outline btn-error"
                        onClick={() => {
                            logout();
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/properties"
                        className="card bg-base-100 shadow-md hover:shadow-xl"
                    >
                        <div className="card-body">
                            <FaHome className="text-3xl text-primary" />
                            <h2 className="card-title mt-2">Browse Properties</h2>
                            <p>Explore available houses and flats.</p>
                        </div>
                    </Link>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <FaClipboardList className="text-3xl text-primary" />
                            <h2 className="card-title mt-2">My Rental Requests</h2>
                            <p>Your rental requests will appear here once implemented.</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <FaUser className="text-3xl text-primary" />
                            <h2 className="card-title mt-2">My Profile</h2>
                            <p>{authUser?.email}</p>
                            <p className="badge badge-outline mt-2">
                                {authUser?.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;