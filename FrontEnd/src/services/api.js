const configuredApiUrl = import.meta.env.VITE_API_URL;

// Remove a trailing slash so every request builds a clean URL.
export const API_BASE_URL = configuredApiUrl
    ? configuredApiUrl.replace(/\/+$/, "")
    : "";

export function getAuthToken(response) {
    // Login and signup responses use slightly different token shapes.
    return response.data?.token || response.data?.user?.token;
}