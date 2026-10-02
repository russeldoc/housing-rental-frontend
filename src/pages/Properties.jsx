import { useMemo, useState } from "react";
import {
    FaSearch,
    FaSlidersH,
    FaSortAmountDown,
    FaTimes,
} from "react-icons/fa";

import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";
import properties from "../data/properties";

const Properties = () => {

    // Search
    const [search, setSearch] = useState("");

    // Filters
    const [propertyType, setPropertyType] = useState("All");
    const [maxPrice, setMaxPrice] = useState("All");
    const [bedrooms, setBedrooms] = useState("All");

    // Sorting
    const [sortBy, setSortBy] = useState("default");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const propertiesPerPage = 6;


    // Filter + Search + Sort
    const filteredProperties = useMemo(() => {

        let result = [...properties];

        // Search
        if (search.trim() !== "") {

            const searchText = search.toLowerCase();

            result = result.filter((property) =>
                property.title.toLowerCase().includes(searchText) ||
                property.location.toLowerCase().includes(searchText)
            );

        }


        // Property Type
        if (propertyType !== "All") {

            result = result.filter(
                (property) => property.type === propertyType
            );

        }


        // Maximum Price
        if (maxPrice !== "All") {

            result = result.filter(
                (property) => property.price <= Number(maxPrice)
            );

        }


        // Bedrooms
        if (bedrooms !== "All") {

            result = result.filter(
                (property) => property.bedrooms >= Number(bedrooms)
            );

        }


        // Sorting
        if (sortBy === "price-low") {

            result.sort((a, b) => a.price - b.price);

        }

        if (sortBy === "price-high") {

            result.sort((a, b) => b.price - a.price);

        }

        if (sortBy === "area-large") {

            result.sort((a, b) => b.area - a.area);

        }


        return result;

    }, [
        search,
        propertyType,
        maxPrice,
        bedrooms,
        sortBy,
    ]);


    // Pagination
    const totalPages = Math.ceil(
        filteredProperties.length / propertiesPerPage
    );

    const startIndex =
        (currentPage - 1) * propertiesPerPage;

    const currentProperties =
        filteredProperties.slice(
            startIndex,
            startIndex + propertiesPerPage
        );


    // Reset filters
    const clearFilters = () => {

        setSearch("");
        setPropertyType("All");
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

                        <FaSearch
                            className="absolute left-4 top-1/2
              -translate-y-1/2 text-gray-400"
                        />

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Property Type */}

                        <div>

                            <label className="label">
                                <span className="label-text font-semibold">
                                    Property Type
                                </span>
                            </label>

                            <select
                                value={propertyType}
                                onChange={(e) => {
                                    setPropertyType(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="select select-bordered w-full"
                            >

                                <option value="All">
                                    All Types
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

                        </div>


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

                                <option value="area-large">
                                    Largest Area
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Clear Filters */}

                    {(search ||
                        propertyType !== "All" ||
                        maxPrice !== "All" ||
                        bedrooms !== "All" ||
                        sortBy !== "default") && (

                            <div className="mt-5">

                                <button
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


                {/* Property Grid */}

                {currentProperties.length > 0 ? (

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

                        <EmptyState
                            message="Try changing your search or filters."
                        />

                    </div>

                )}


                {/* Pagination */}

                {totalPages > 1 && (

                    <div className="flex justify-center mt-12">

                        <div className="join">

                            <button
                                className="join-item btn"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((page) => page - 1)
                                }
                            >
                                «
                            </button>


                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (

                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`join-item btn ${currentPage === page
                                            ? "btn-primary"
                                            : ""
                                        }`}
                                >
                                    {page}
                                </button>

                            ))}


                            <button
                                className="join-item btn"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((page) => page + 1)
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