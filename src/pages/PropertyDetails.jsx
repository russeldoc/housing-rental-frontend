import { Link, useParams } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaRulerCombined,
    FaHome,
    FaCheck,
    FaArrowLeft,
} from "react-icons/fa";

import properties from "../data/properties";

const PropertyDetails = () => {
    const { id } = useParams();

    const property = properties.find(
        (item) => item.id === Number(id)
    );

    if (!property) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Property Not Found
                </h1>

                <p className="text-gray-500 mb-6">
                    The property you are looking for does not exist.
                </p>

                <Link to="/properties" className="btn btn-primary">
                    <FaArrowLeft />
                    Back to Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-base-200 min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Back Button */}
                <Link
                    to="/properties"
                    className="btn btn-ghost mb-6"
                >
                    <FaArrowLeft />
                    Back to Properties
                </Link>

                {/* Main Property Section */}
                <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden">

                    {/* Image */}
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-[300px] md:h-[500px] object-cover"
                    />

                    <div className="p-6 md:p-10">

                        {/* Title & Status */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                            <div>
                                <div className="badge badge-primary mb-3">
                                    {property.status}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold">
                                    {property.title}
                                </h1>

                                <p className="flex items-center gap-2 text-gray-500 mt-3">
                                    <FaMapMarkerAlt />
                                    {property.location}
                                </p>
                            </div>

                            <div>
                                <p className="text-3xl font-bold text-primary">
                                    ৳{property.price.toLocaleString()}
                                </p>

                                <p className="text-gray-500">
                                    per month
                                </p>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Property Information */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaBed className="text-2xl mx-auto mb-2 text-primary" />
                                <p className="font-bold text-lg">
                                    {property.bedrooms}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Bedrooms
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaBath className="text-2xl mx-auto mb-2 text-primary" />
                                <p className="font-bold text-lg">
                                    {property.bathrooms}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Bathrooms
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaRulerCombined className="text-2xl mx-auto mb-2 text-primary" />
                                <p className="font-bold text-lg">
                                    {property.area}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Square Feet
                                </p>
                            </div>

                            <div className="bg-base-200 rounded-xl p-5 text-center">
                                <FaHome className="text-2xl mx-auto mb-2 text-primary" />
                                <p className="font-bold text-lg">
                                    {property.type}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Property Type
                                </p>
                            </div>

                        </div>

                        {/* Description */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-4">
                                About This Property
                            </h2>

                            <p className="text-gray-600 leading-7">
                                {property.description ||
                                    "This property offers a comfortable living environment with convenient facilities and a great location."}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold mb-5">
                                Amenities
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {(property.amenities || []).map(
                                    (amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="text-success">
                                                <FaCheck />
                                            </div>

                                            <span>{amenity}</span>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>

                        {/* Request Section */}
                        <div className="mt-10 bg-primary text-primary-content rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">

                            <div>
                                <h2 className="text-2xl font-bold">
                                    Interested in this property?
                                </h2>

                                <p className="mt-2 opacity-90">
                                    Submit a rental request to get started.
                                </p>
                            </div>

                            <button className="btn btn-secondary">
                                Request to Rent
                            </button>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default PropertyDetails;