export const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    // Normal request was successful
    if (response.ok) {
        return data;
    }

    // Access token expired or is invalid
    if (
        response.status === 401 &&
        endpoint !== "/auth/refresh"
    ) {
        const refreshToken = localStorage.getItem("refreshToken");

        // No refresh token available
        if (!refreshToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("authUser");

            window.location.href = "/login";

            throw new Error("Session expired. Please login again.");
        }

        try {
            // Ask backend for a new access token
            const refreshResponse = await fetch(
                `${API_BASE_URL}/auth/refresh`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                }
            );

            const refreshData = await refreshResponse
                .json()
                .catch(() => null);

            // Refresh token is invalid/expired
            if (!refreshResponse.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("authUser");

                window.location.href = "/login";

                throw new Error(
                    "Your session has expired. Please login again."
                );
            }

            // Save the new access token
            const newAccessToken = refreshData?.access_token;

            if (!newAccessToken) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("authUser");

                window.location.href = "/login";

                throw new Error(
                    "Could not refresh your session. Please login again."
                );
            }

            localStorage.setItem("token", newAccessToken);

            // Retry the original request with the new token
            const retryHeaders = {
                ...(options.body
                    ? { "Content-Type": "application/json" }
                    : {}),
                Authorization: `Bearer ${newAccessToken}`,
                ...options.headers,
            };

            const retryResponse = await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    ...options,
                    headers: retryHeaders,
                }
            );

            const retryData = await retryResponse
                .json()
                .catch(() => null);

            if (!retryResponse.ok) {
                throw new Error(
                    retryData?.detail ||
                    `Request failed (${retryResponse.status})`
                );
            }

            return retryData;
        } catch (error) {
            // If the error is already our session-expired error,
            // just pass it through.
            if (
                error.message ===
                "Your session has expired. Please login again." ||
                error.message ===
                "Could not refresh your session. Please login again."
            ) {
                throw error;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("authUser");

            window.location.href = "/login";

            throw new Error(
                "Could not refresh your session. Please login again."
            );
        }
    }

    // Other API errors
    throw new Error(
        data?.detail || `Request failed (${response.status})`
    );
}

