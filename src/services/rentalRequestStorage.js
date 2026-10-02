
const STORAGE_KEY = "homeRentRentalRequests";
const REQUEST_EVENT = "homeRentRentalRequestsChanged";

// Get all rental requests
export const getRentalRequests = () => {
    try {
        const savedRequests = localStorage.getItem(STORAGE_KEY);
        return savedRequests ? JSON.parse(savedRequests) : [];
    } catch (error) {
        console.error("Error loading rental requests:", error);
        return [];
    }
};

// Save rental requests
export const saveRentalRequests = (requests) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    window.dispatchEvent(new Event(REQUEST_EVENT));
};

// Add a new rental request
export const addRentalRequest = (requestData) => {
    const requests = getRentalRequests();

    const newRequest = {
        ...requestData,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        status: "Pending",
        createdAt: new Date().toISOString(),
    };

    saveRentalRequests([...requests, newRequest]);

    return newRequest;
};

// Update request status
export const updateRentalRequestStatus = (id, status) => {
    const requests = getRentalRequests();

    const updatedRequests = requests.map((request) =>
        request.id === id
            ? { ...request, status }
            : request
    );

    saveRentalRequests(updatedRequests);

    return updatedRequests;
};

// Listen for rental request changes
export const subscribeToRentalRequestChanges = (callback) => {
    window.addEventListener(REQUEST_EVENT, callback);

    return () => {
        window.removeEventListener(REQUEST_EVENT, callback);
    };
};
