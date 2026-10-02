import { useParams } from "react-router-dom";

const PropertyDetails = () => {

    const { id } = useParams();

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <h1 className="text-4xl font-bold">
                Property Details
            </h1>

            <p className="mt-4">
                Property ID: {id}
            </p>

        </div>
    );
};

export default PropertyDetails;