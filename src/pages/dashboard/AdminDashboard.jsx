
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaClipboardList, FaUsers } from "react-icons/fa";

const AdminDashboard = () => {
    const { authUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-base-200 px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Welcome, {authUser?.name}. Manage HomeRent here.
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
                        to="/admin/properties"
                        className="card bg-base-100 shadow-md hover:shadow-xl"
                    >
                        <div className="card-body">
                            <FaHome className="text-3xl text-primary" />
                            <h2 className="card-title mt-2">Manage Properties</h2>
                            <p>Add, edit, and remove properties.</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/requests"
                        className="card bg-base-100 shadow-md hover:shadow-xl"
                    >
                        <div className="card-body">
                            <FaClipboardList className="text-3xl text-primary" />
                            <h2 className="card-title mt-2">Rental Requests</h2>
                            <p>Review and manage rental requests.</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="card bg-base-100 shadow-md hover:shadow-xl"
                    >
                        <div className="card-body">
                            <FaUsers className="text-3xl text-primary" />
                            <h2 className="card-title mt-2">Manage Users</h2>
                            <p>View registered users.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
