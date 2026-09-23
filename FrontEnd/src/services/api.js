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

export function getSessionUser() {
    try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        return null;
    }
}

export function getSessionToken() {
    return localStorage.getItem("token") || getSessionUser()?.token || "";
}

export function authHeaders(extra = {}) {
    const token = getSessionToken();
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

export function flattenArtistRecord(artist) {
    if (!artist) return null;

    if (artist.artistProfile) {
        const profile = artist.artistProfile;
        const user = artist.user || profile.user || {};
        return {
            ...profile,
            user,
            username: user.username,
            fullName: user.fullName,
            profileImage: profile.profileImage || user.profileImage,
            verified: Boolean(profile.isVerified || profile.verified),
        };
    }

    const user = artist.user || {};
    return {
        ...artist,
        user,
        username: user.username || artist.username,
        fullName: user.fullName || artist.fullName || artist.name,
        profileImage:
            artist.profileImage ||
            artist.image ||
            user.profileImage,
        verified: Boolean(artist.isVerified || artist.verified),
    };
}

export function artistDisplayName(artist) {
    const record = flattenArtistRecord(artist);
    if (!record) return "Artist";
    return (
        record.stageName ||
        record.fullName ||
        `${record.user?.firstName || ""} ${record.user?.lastName || ""}`.trim() ||
        record.username ||
        "Artist"
    );
}

export function artistUsernameOf(artist) {
    const record = flattenArtistRecord(artist);
    return record?.username || record?.user?.username || "";
}


