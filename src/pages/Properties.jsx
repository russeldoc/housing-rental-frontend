import { useEffect, useMemo, useState } from "react";

import {
    FaSearch,
    FaSlidersH,
    FaTimes,
} from "react-icons/fa";

import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";
import { apiRequest } from "../services/api";


const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState("All");
    const [bedrooms, setBedrooms] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

    const propertiesPerPage = 6;

    // Get properties from FastAPI backend
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await apiRequest(
                    "/properties/?page=1&page_size=100&is_available=true"
                );
                // console.log("Properties from backend:", data.items);
                // console.log("First property:", data.items[0]);
                // console.log("Image URL:", data.items[0]?.image_url);

                console.log(
                    "Property images:",
                    data.items.map((property) => ({
                        id: property.id,
                        title: property.title,
                        image_url: property.image_url,
                    }))
                );

                // Backend returns { items, total, ... }
                setProperties(data.items || []);
            } catch (error) {
                console.error("Failed to load properties:", error);
                setError(error.message || "Failed to load properties.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProperties();
    }, []);


    // Filter + Search + Sort
    const filteredProperties = useMemo(() => {
        let result = [...properties];

        // Search by property title or location
        if (search.trim() !== "") {
            const searchText = search.toLowerCase();

            result = result.filter(
                (property) =>
                    property.title?.toLowerCase().includes(searchText) ||
                    property.location?.toLowerCase().includes(searchText)
            );
        }

        // Maximum Price
        if (maxPrice !== "All") {
            result = result.filter(
                (property) =>
                    Number(property.monthly_rent) <= Number(maxPrice)
            );
        }

        // Bedrooms
        if (bedrooms !== "All") {
            result = result.filter(
                (property) =>
                    Number(property.bedrooms) >= Number(bedrooms)
            );
        }

        // Sorting
        if (sortBy === "price-low") {
            result.sort(
                (a, b) =>
                    Number(a.monthly_rent) -
                    Number(b.monthly_rent)
            );
        }

        if (sortBy === "price-high") {
            result.sort(
                (a, b) =>
                    Number(b.monthly_rent) -
                    Number(a.monthly_rent)
            );
        }

        return result;
    }, [
        properties,
        search,
        maxPrice,
        bedrooms,
        sortBy,
    ]);

    // Pagination
    const totalPages = Math.ceil(
        filteredProperties.length / propertiesPerPage
    );

    const startIndex = (currentPage - 1) * propertiesPerPage;

    const currentProperties = filteredProperties.slice(
        startIndex,
        startIndex + propertiesPerPage
    );

    // Reset filters
    const clearFilters = () => {
        setSearch("");
        setMaxPrice("All");
        setBedrooms("All");
        setSortBy("default");
        setCurrentPage(1);
    };


    return (
        <div className="bg-base-200 min-h-screen">

            {/* Header */}
            <section className="bg-primary text-primary-content">
                <div className="max-w-7xl mx-auto px-6 py-14">
                    <p className="font-semibold">
                        EXPLORE HOMES
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mt-2">
                        Find Your Perfect Property
                    </h1>

                    <p className="mt-4 max-w-2xl opacity-90">
                        Search through our available houses and flats
                        to find a place that matches your needs.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Search & Filter Panel */}
                <div className="bg-base-100 rounded-2xl shadow-md p-5 mb-10">

                    {/* Search */}
                    <div className="relative mb-5">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search by property name or location..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="input input-bordered w-full pl-11"
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Maximum Price */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Maximum Price
                                </span>
                            </label>

                            <select
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="All">
                                    Any Price
                                </option>

                                <option value="20000">
                                    Up to ৳20,000
                                </option>

                                <option value="30000">
                                    Up to ৳30,000
                                </option>

                                <option value="40000">
                                    Up to ৳40,000
                                </option>

                                <option value="60000">
                                    Up to ৳60,000
                                </option>
                            </select>
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Bedrooms
                                </span>
                            </label>

                            <select
                                value={bedrooms}
                                onChange={(e) => {
                                    setBedrooms(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="All">
                                    Any
                                </option>

                                <option value="1">
                                    1+ Bedroom
                                </option>

                                <option value="2">
                                    2+ Bedrooms
                                </option>

                                <option value="3">
                                    3+ Bedrooms
                                </option>

                                <option value="4">
                                    4+ Bedrooms
                                </option>
                            </select>
                        </div>

                        {/* Sorting */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Sort By
                                </span>
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="default">
                                    Default
                                </option>

                                <option value="price-low">
                                    Price: Low to High
                                </option>

                                <option value="price-high">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(search ||
                        maxPrice !== "All" ||
                        bedrooms !== "All" ||
                        sortBy !== "default") && (
                            <div className="mt-5">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="btn btn-sm btn-outline"
                                >
                                    <FaTimes />
                                    Clear Filters
                                </button>
                            </div>
                        )}
                </div>

                {/* Results Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Available Properties
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {filteredProperties.length} properties found
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                        <FaSlidersH />
                        <span>
                            Use filters to find your ideal home
                        </span>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {/* Property Grid */}
                {!isLoading && !error && (
                    currentProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {currentProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="bg-base-100 rounded-2xl">
                            <EmptyState message="Try changing your search or filters." />
                        </div>
                    )
                )}

                {/* Pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="join">

                            <button
                                type="button"
                                className="join-item btn"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        (page) => page - 1
                                    )
                                }
                            >
                                «
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    type="button"
                                    key={page}
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={`join-item btn ${currentPage === page
                                        ? "btn-primary"
                                        : ""
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                className="join-item btn"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (page) => page + 1
                                    )
                                }
                            >
                                »
                            </button>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Properties;

