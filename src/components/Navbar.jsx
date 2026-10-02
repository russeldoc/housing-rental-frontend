import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="navbar bg-base-100 shadow-md px-4 md:px-8">

            <div className="flex-1">
                <Link
                    to="/"
                    className="text-2xl font-bold text-primary flex items-center gap-2"
                >
                    <FaHome />
                    HomeRent
                </Link>
            </div>

            <div className="hidden md:flex">
                <ul className="menu menu-horizontal px-1">

                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to="/properties">Properties</Link>
                    </li>

                    <li>
                        <Link to="/about">About</Link>
                    </li>

                </ul>
            </div>

            <div className="flex gap-2">

                <Link
                    to="/login"
                    className="btn btn-outline btn-primary"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="btn btn-primary"
                >
                    Signup
                </Link>

            </div>

        </nav>
    );
};

export default Navbar;