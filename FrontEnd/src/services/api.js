const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = configuredApiUrl
    ? configuredApiUrl.replace(/\/+$/, "")
    : "";

export function getAuthToken(response) {
    return response.data?.token || response.data?.user?.token;
}