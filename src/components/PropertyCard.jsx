import { Link } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
} from "react-icons/fa";

const PropertyCard = ({ property }) => {
    const isUnavailable = !property.is_available;

    return (
        <div className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 border border-base-200 overflow-hidden">

            {/* Property Image */}
            <figure className="relative">

                <img
                    src={
                        property.image_url ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={property.title}
                    className="w-full h-56 object-cover"
                />

                <div
                    className={`badge absolute top-4 right-4 ${isUnavailable
                            ? "badge-error"
                            : "badge-primary"
                        }`}
                >
                    {isUnavailable
                        ? "Not Available"
                        : "Available"}
                </div>

            </figure>

            {/* Property Information */}
            <div className="card-body">

                <h2 className="card-title">
                    {property.title}
                </h2>

                <p className="flex items-center gap-2 text-gray-500">
                    <FaMapMarkerAlt />
                    {property.location}
                </p>

                <div className="flex justify-between text-sm text-gray-600 mt-2">

                    <span className="flex items-center gap-1">
                        <FaBed />
                        {property.bedrooms} Beds
                    </span>

                    <span className="flex items-center gap-1">
                        <FaBath />
                        {property.bathrooms} Baths
                    </span>

                </div>

                <div className="divider my-1"></div>

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-xl font-bold text-primary">
                            ৳
                            {Number(
                                property.monthly_rent
                            ).toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-500">
                            per month
                        </p>
                    </div>

                    <Link
                        to={`/properties/${property.id}`}
                        className="btn btn-primary btn-sm"
                    >
                        View Details
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default PropertyCard;

