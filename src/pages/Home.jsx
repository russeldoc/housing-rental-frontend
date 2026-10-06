import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

import PropertyCard from "../components/PropertyCard";
import { apiRequest } from "../services/api";

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Get properties from FastAPI
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await apiRequest(
                    "/properties/?page=1&page_size=3&is_available=true"
                );

                setProperties(data.items || []);
            } catch (error) {
                console.error("Failed to load featured properties:", error);
                setError(
                    error.message || "Failed to load properties."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProperties();
    }, []);

    const featuredProperties = properties.slice(0, 3);

    return (
        <div>

            {/* ================= HERO ================= */}

            <section className="relative">

                <div
                    className="hero min-h-[600px]"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80)",
                    }}
                >

                    <div className="hero-overlay bg-black/50"></div>

                    <div className="hero-content text-center text-white">

                        <div className="max-w-4xl">

                            <p className="text-primary font-semibold text-lg mb-3">
                                FIND YOUR NEXT HOME
                            </p>

                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                Find a Place You Can
                                <span className="text-primary">
                                    {" "}Call Home
                                </span>
                            </h1>

                            <p className="py-6 text-lg max-w-2xl mx-auto text-gray-200">
                                Discover comfortable and affordable houses and flats
                                in the location you love.
                            </p>

                            {/* Search Box */}

                            <div className="bg-base-100 text-base-content rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                    <input
                                        type="text"
                                        placeholder="Where do you want to live?"
                                        className="input input-bordered w-full"
                                    />

                                    <select className="select select-bordered w-full">
                                        <option value="">
                                            Property Type
                                        </option>

                                        <option value="Apartment">
                                            Apartment
                                        </option>

                                        <option value="Flat">
                                            Flat
                                        </option>

                                        <option value="House">
                                            House
                                        </option>
                                    </select>

                                    <select className="select select-bordered w-full">
                                        <option value="">
                                            Price Range
                                        </option>

                                        <option value="10000">
                                            ৳10,000 - ৳20,000
                                        </option>

                                        <option value="20000">
                                            ৳20,000 - ৳30,000
                                        </option>

                                        <option value="30000">
                                            ৳30,000 - ৳50,000
                                        </option>
                                    </select>

                                    <Link
                                        to="/properties"
                                        className="btn btn-primary"
                                    >
                                        <FaSearch />
                                        Search
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FEATURED PROPERTIES ================= */}

            <section className="max-w-7xl mx-auto px-6 py-16">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">

                    <div>

                        <p className="text-primary font-semibold">
                            EXPLORE HOMES
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold mt-2">
                            Featured Properties
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Take a look at some of our latest available properties.
                        </p>

                    </div>

                    <Link
                        to="/properties"
                        className="btn btn-outline"
                    >
                        View All Properties
                        <FaArrowRight />
                    </Link>

                </div>


                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-16">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}


                {/* Error */}
                {!isLoading && error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}


                {/* Properties */}
                {!isLoading && !error && (
                    featuredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {featuredProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500">
                                No available properties found.
                            </p>
                        </div>
                    )
                )}

            </section>


            {/* ================= WHY HOMERENT ================= */}

            <section className="bg-base-200">

                <div className="max-w-7xl mx-auto px-6 py-16">

                    <div className="text-center mb-12">

                        <p className="text-primary font-semibold">
                            WHY HOMERENT?
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold mt-2">
                            Renting Made Simple
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="text-center">

                            <div className="text-4xl mb-4">
                                🏠
                            </div>

                            <h3 className="text-xl font-bold mb-2">
                                Find Your Home
                            </h3>

                            <p className="text-gray-500">
                                Browse available properties and find a home
                                that matches your needs.
                            </p>

                        </div>


                        <div className="text-center">

                            <div className="text-4xl mb-4">
                                🔍
                            </div>

                            <h3 className="text-xl font-bold mb-2">
                                Search Easily
                            </h3>

                            <p className="text-gray-500">
                                Search and filter properties by location,
                                price and property type.
                            </p>

                        </div>


                        <div className="text-center">

                            <div className="text-4xl mb-4">
                                🔑
                            </div>

                            <h3 className="text-xl font-bold mb-2">
                                Request to Rent
                            </h3>

                            <p className="text-gray-500">
                                Submit a rental request and manage your
                                requests from your dashboard.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="max-w-7xl mx-auto px-6 py-16">

                <div className="bg-primary text-primary-content rounded-3xl p-10 md:p-16 text-center">

                    <h2 className="text-3xl md:text-4xl font-bold">
                        Ready to Find Your New Home?
                    </h2>

                    <p className="mt-4 mb-8 text-lg opacity-90">
                        Explore our available properties today.
                    </p>

                    <Link
                        to="/properties"
                        className="btn btn-secondary"
                    >
                        Browse Properties
                        <FaArrowRight />
                    </Link>

                </div>

            </section>

        </div>
    );
};

export default Home;

