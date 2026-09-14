const configuredApiUrl = import.meta.env.VITE_API_URL;

// Keep the backend origin in the environment; never embed it in application code.
export const API_BASE_URL = configuredApiUrl?.trim().replace(/\/+$/, "");

export function getApiUrl(path) {
    if (!API_BASE_URL) {
        throw new Error("VITE_API_URL is not configured. Add it to the frontend .env file.");
    }

    return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export function getAuthToken(response) {
    // Login and signup responses use slightly different token shapes.
    return response.data?.token || response.data?.user?.token;
}
