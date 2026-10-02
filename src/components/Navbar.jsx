
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { authUser, isAuthenticated, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        toast.success("Logged out successfully!");
        navigate("/");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar bg-base-100 shadow-md px-4 md:px-8 sticky top-0 z-50">
            <div className="flex-1">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-2xl font-bold text-primary flex items-center gap-2"
                >
                    <FaHome />
                    HomeRent
                </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
                <Link to="/" className="btn btn-ghost">Home</Link>
                <Link to="/properties" className="btn btn-ghost">Properties</Link>
                <Link to="/about" className="btn btn-ghost">About</Link>

                {isAuthenticated ? (
                    <>
                        {authUser?.role === "admin" ? (
                            <Link to="/admin" className="btn btn-ghost">
                                Admin Dashboard
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="btn btn-ghost">
                                Dashboard
                            </Link>
                        )}

                        <span className="text-sm text-gray-500 px-2">
                            Hi, {authUser?.name}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="btn btn-outline btn-error"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline btn-primary">
                            Login
                        </Link>
                        <Link to="/signup" className="btn btn-primary">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <button
                type="button"
                className="btn btn-ghost btn-square md:hidden"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Mobile navigation */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-base-100 shadow-lg p-4 flex flex-col gap-2 md:hidden">
                    <Link to="/" onClick={closeMenu} className="btn btn-ghost justify-start">
                        Home
                    </Link>
                    <Link to="/properties" onClick={closeMenu} className="btn btn-ghost justify-start">
                        Properties
                    </Link>
                    <Link to="/about" onClick={closeMenu} className="btn btn-ghost justify-start">
                        About
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <div className="px-4 py-2 text-sm text-gray-500">
                                Signed in as {authUser?.name}
                            </div>

                            {authUser?.role === "admin" ? (
                                <Link to="/admin" onClick={closeMenu} className="btn btn-ghost justify-start">
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link to="/dashboard" onClick={closeMenu} className="btn btn-ghost justify-start">
                                    Dashboard
                                </Link>
                            )}

                            <button onClick={handleLogout} className="btn btn-outline btn-error">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu} className="btn btn-outline btn-primary">
                                Login
                            </Link>
                            <Link to="/signup" onClick={closeMenu} className="btn btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;