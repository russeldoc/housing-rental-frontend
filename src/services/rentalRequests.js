

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


    // Prevent the same user from submitting another pending
    // request for the same property.
    const alreadyPending = requests.some(
        (item) =>
            item.userEmail === request.userEmail &&
            item.propertyId === request.propertyId &&
            item.status === "Pending"
    );

    if (alreadyPending) {
        return {
            success: false,
            message: "You already have a pending request for this property.",
        };
    }

    const newRequest = {
        id: Date.now(),
        ...request,
        status: "Pending",
        createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    return {
        success: true,
        request: newRequest,
    };
};


export const updateRentalRequestStatus = (requestId, newStatus) => {
    const allowedStatuses = ["Approved", "Rejected"];

    if (!allowedStatuses.includes(newStatus)) {
        return false;
    }

    const requests = getRentalRequests();

    const updatedRequests = requests.map((request) =>
        request.id === requestId && request.status === "Pending"
            ? { ...request, status: newStatus }
            : request
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRequests));

    return updatedRequests.some(
        (request) =>
            request.id === requestId && request.status === newStatus
    );
};