
import { properties as initialProperties } from "../data/properties";

const STORAGE_KEY = "homeRentProperties";
const PROPERTY_EVENT = "homeRentPropertiesChanged";


export const getProperties = () => {
    try {
        const savedProperties = localStorage.getItem(STORAGE_KEY);

        let properties;

        if (savedProperties === null) {
            properties = initialProperties;

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(properties)
            );
        } else {
            properties = JSON.parse(savedProperties);
        }

        // Read existing rental requests, including older approvals.
        const rentalRequests = JSON.parse(
            localStorage.getItem("rentalRequests") || "[]"
        );

        const approvedPropertyIds = new Set(
            rentalRequests
                .filter((request) => request.status === "Approved")
                .map((request) => String(request.propertyId))
        );

        return properties.map((property) => ({
            ...property,
            availability: approvedPropertyIds.has(
                String(property.id)
            )
                ? "Not Available"
                : property.availability || "Available",
        }));
    } catch (error) {
        console.error("Error loading properties:", error);
        return initialProperties;
    }
};


export const saveProperties = (properties) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));

    // Notify other pages that the property list changed.
    window.dispatchEvent(new Event(PROPERTY_EVENT));
};

export const subscribeToPropertyChanges = (callback) => {
    window.addEventListener(PROPERTY_EVENT, callback);

    return () => {
        window.removeEventListener(PROPERTY_EVENT, callback);
    };
};

export const addProperty = (property) => {
    const properties = getProperties();

    const newProperty = {
        ...property,
        id: Date.now(),
    };

    saveProperties([...properties, newProperty]);

    return newProperty;
};

export const updateProperty = (id, updatedData) => {
    const properties = getProperties();

    const updatedProperties = properties.map((property) =>
        property.id === Number(id)
            ? { ...property, ...updatedData, id: property.id }
            : property
    );

    saveProperties(updatedProperties);

    return updatedProperties;
};

export const deleteProperty = (id) => {
    const properties = getProperties();

    const updatedProperties = properties.filter(
        (property) => property.id !== Number(id)
    );

    saveProperties(updatedProperties);

    return updatedProperties;
};
