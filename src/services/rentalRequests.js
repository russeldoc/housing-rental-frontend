
import { updateProperty } from "./propertyStorage";

const STORAGE_KEY = "rentalRequests";

export const getRentalRequests = () => {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
    } catch (error) {
        console.error("Error loading rental requests:", error);
        return [];
    }
};

export const createRentalRequest = (request) => {
    const requests = getRentalRequests();

    const userEmail = request.userEmail?.trim().toLowerCase();
    const propertyId = String(request.propertyId);

    // Prevent requests for properties already approved for someone.
    const approvedRequest = requests.find(
        (item) =>
            String(item.propertyId) === propertyId &&
            item.status === "Approved"
    );

    if (approvedRequest) {
        return {
            success: false,
            message: "Sorry, this property is not available anymore.",
        };
    }

    // Prevent the same user from requesting the same property again.
    const existingRequest = requests.find(
        (item) =>
            item.userEmail?.trim().toLowerCase() === userEmail &&
            String(item.propertyId) === propertyId
    );

    if (existingRequest) {
        return {
            success: false,
            message: `You have already requested this property. Current status: ${existingRequest.status}.`,
        };
    }

    const newRequest = {
        ...request,
        userEmail,
        id: Date.now(),
        status: "Pending",
        createdAt: new Date().toISOString(),
    };

    try {
        requests.push(newRequest);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(requests)
        );

        return {
            success: true,
            request: newRequest,
        };
    } catch (error) {
        console.error("Error saving rental request:", error);

        return {
            success: false,
            message: "Could not save your rental request. Please try again.",
        };
    }
};

export const updateRentalRequestStatus = (
    requestId,
    newStatus
) => {
    const allowedStatuses = ["Approved", "Rejected"];

    if (!allowedStatuses.includes(newStatus)) {
        return false;
    }

    const requests = getRentalRequests();

    const targetRequest = requests.find(
        (request) =>
            String(request.id) === String(requestId)
    );

    if (!targetRequest || targetRequest.status !== "Pending") {
        return false;
    }

    const updatedRequests = requests.map((request) =>
        String(request.id) === String(requestId)
            ? { ...request, status: newStatus }
            : request
    );

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedRequests)
        );

        // Mark the property unavailable when the request is approved.
        if (newStatus === "Approved") {
            updateProperty(targetRequest.propertyId, {
                availability: "Not Available",
            });
        }

        return true;
    } catch (error) {
        console.error("Error updating rental request:", error);
        return false;
    }
};
