import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/pages/Booking.css";
import "../styles/pages/Workspace.css";
import {
    authHeaders,
    flattenArtistRecord,
    getApiUrl,
    getSessionUser,
} from "../services/api";
import { getLocalProfile, saveLocalProfile } from "../services/demoStore";
import useRequireAuth from "../hooks/useRequireAuth";
import artistCategories from "../data/artistCategories";

export default function Settings() {
    useRequireAuth();
    const currentUser = getSessionUser();
    const isArtist = currentUser?.role === "Artist";
    const localProfile = getLocalProfile(currentUser?.username);

    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        fullName: currentUser?.fullName || "",
        bio: localProfile?.bio || "",
        location: localProfile?.location || "",
        stageName: "",
        category: "",
        city: "",
        state: "",
        price: "",
        priceType: "per event",
        experience: "",
        instagram: "",
        youtube: "",
        website: "",
        availableFrom: "",
    });

    useEffect(() => {
        if (!isArtist) return;
        const loadArtist = async () => {
            try {
                const response = await axios.get(getApiUrl("api/artists/me"), {
                    headers: authHeaders(),
                });
                const artist = flattenArtistRecord(
                    response.data?.artistProfile || response.data?.artist
                );
                if (!artist) return;
                setForm((current) => ({
                    ...current,
                    stageName: artist.stageName || "",
                    category: artist.category || "",
                    city: artist.city || "",
                    state: artist.state || "",
                    price: artist.price ?? "",
                    priceType: artist.priceType || "per event",
                    experience: artist.experience ?? "",
                    instagram: artist.instagram || "",
                    youtube: artist.youtube || "",
                    website: artist.website || "",
                    availableFrom: artist.availableFrom
                        ? String(artist.availableFrom).slice(0, 10)
                        : "",
                    bio: artist.bio || current.bio,
                }));
            } catch (fetchError) {
                setError("Artist profile details will save locally if the API is unavailable.");
            }
        };
        loadArtist();
    }, [isArtist]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleImage = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const data = new FormData();
        data.append("profileImage", file);
        try {
            const response = await axios.put(getApiUrl("api/users/update-image"), data, {
                headers: authHeaders(),
            });
            const image = response.data?.profileImage;
            if (image && currentUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({ ...currentUser, profileImage: image })
                );
            }
            setStatus("Profile image updated.");
        } catch (uploadError) {
            setError(uploadError.response?.data?.message || "Image upload needs the backend and Cloudinary.");
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        saveLocalProfile(currentUser.username, {
            bio: form.bio,
            location: form.location,
            fullName: form.fullName,
        });
        if (currentUser) {
            localStorage.setItem(
                "user",
                JSON.stringify({ ...currentUser, fullName: form.fullName })
            );
        }
        if (isArtist) {
            try {
                await axios.put(
                    getApiUrl("api/artists/update"),
                    {
                        stageName: form.stageName,
                        category: form.category,
                        bio: form.bio,
                        experience: Number(form.experience || 0),
                        city: form.city,
                        state: form.state,
                        availableFrom: form.availableFrom || undefined,
                        price: Number(form.price || 0),
                        priceType: form.priceType,
                        instagram: form.instagram,
                        youtube: form.youtube,
                        website: form.website,
                    },
                    { headers: authHeaders({ "Content-Type": "application/json" }) }
                );
            } catch (saveError) {
                setError(
                    saveError.response?.data?.message ||
                        "Artist details were saved locally for this demo."
                );
            }
        }
        setStatus("Settings saved.");
        setSaving(false);
    };

    const profilePath =
        isArtist && currentUser?.username
            ? `/artists/${currentUser.username}`
            : `/client/${currentUser?.username || ""}`;

    return (
        <main className="booking-page">
            <section className="booking-page-header">
                <div>
                    <p className="booking-kicker">Account</p>
                    <h1>Settings</h1>
                    <p className="booking-intro">
                        Update the details that appear on your ArtistHood profile.
                    </p>
                </div>
                <Link to={profilePath} className="booking-browse-link">
                    View profile
                </Link>
            </section>

            {status && <p className="booking-success">{status}</p>}
            {error && <p className="workspace-banner">{error}</p>}

            <section className="settings-card">
                <form className="settings-form" onSubmit={handleSave}>
                    <label>
                        Profile image
                        <input type="file" accept="image/*" onChange={handleImage} />
                    </label>
                    <label>
                        Full name
                        <input name="fullName" value={form.fullName} onChange={handleChange} />
                    </label>
                    <label>
                        Bio
                        <textarea name="bio" rows="4" value={form.bio} onChange={handleChange} />
                    </label>
                    <label>
                        Location
                        <input name="location" value={form.location} onChange={handleChange} />
                    </label>

                    {isArtist && (
                        <>
                            <label>
                                Stage name
                                <input name="stageName" value={form.stageName} onChange={handleChange} />
                            </label>
                            <label>
                                Category
                                <select name="category" value={form.category} onChange={handleChange}>
                                    <option value="">Select category</option>
                                    {artistCategories.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="booking-form-row">
                                <label>
                                    City
                                    <input name="city" value={form.city} onChange={handleChange} />
                                </label>
                                <label>
                                    State
                                    <input name="state" value={form.state} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="booking-form-row">
                                <label>
                                    Price
                                    <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
                                </label>
                                <label>
                                    Price type
                                    <select name="priceType" value={form.priceType} onChange={handleChange}>
                                        <option value="per event">per event</option>
                                        <option value="per hour">per hour</option>
                                        <option value="per day">per day</option>
                                    </select>
                                </label>
                            </div>
                            <label>
                                Available from
                                <input type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} />
                            </label>
                            <label>
                                Instagram
                                <input name="instagram" value={form.instagram} onChange={handleChange} />
                            </label>
                        </>
                    )}

                    <button type="submit" className="settings-save" disabled={saving}>
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </form>
            </section>
        </main>
    );
}
