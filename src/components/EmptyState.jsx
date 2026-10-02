import { FaSearch } from "react-icons/fa";

const EmptyState = ({ message = "No properties found." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">

            <div className="text-5xl text-gray-300 mb-5">
                <FaSearch />
            </div>

            <h3 className="text-2xl font-bold mb-2">
                Nothing Found
            </h3>

            <p className="text-gray-500">
                {message}
            </p>

        </div>
    );
};

export default EmptyState;