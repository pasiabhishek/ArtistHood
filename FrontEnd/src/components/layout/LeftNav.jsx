import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    getSessionUser,
    authHeaders,
    getApiUrl,
} from "../../services/api";

export default function LeftNav({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [hasUnread, setHasUnread] = useState(false);

    const user = getSessionUser();
    const displayName = user?.fullName || user?.username || "Guest";
    const isArtist = user?.role === "Artist";
    const profileImage = user?.profileImage;
    const profilePath = user?.username
        ? isArtist
            ? `/artists/${user.username}`
            : `/client/${user.username}`
        : "/feed";

    // Fetch unread notifications status and listen for updates
    useEffect(() => {
        let active = true;

        const loadNotifications = async () => {
            try {
                const response = await axios.get(
                    getApiUrl("api/notifications"),
                    { headers: authHeaders() }
                );

                if (!active) return;

                const notifications = response.data?.notifications || [];
                setHasUnread(notifications.some((item) => !item.read));
            } catch (error) {
                console.error("Failed to load notification status:", error);
            }
        };

        loadNotifications();

        window.addEventListener("notifications:updated", loadNotifications);

        return () => {
            active = false;
            window.removeEventListener("notifications:updated", loadNotifications);
        };
    }, [location.pathname]);

    const navItems = [
        { to: "/feed", icon: "fa-regular fa-house", label: "Home", end: true },
        { to: "/discover", icon: "fa-regular fa-compass", label: "Discover" },
        { to: "/artists", icon: "fa-regular fa-user", label: "Artists" },
        {
            to: isArtist ? "/dashboard" : "/booking",
            icon: "fa-regular fa-calendar-check",
            label: isArtist ? "Dashboard" : "My bookings",
        },
        { to: "/messages", icon: "fa-solid fa-message", label: "Messages" },
        { to: "/notifications", icon: "fa-regular fa-bell", label: "Notifications" },
        { to: "/settings", icon: "fa-regular fa-gear", label: "Settings" },
    ];

    function signOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <aside
            id="left-navigation"
            className={`Left_Nav ${isOpen ? "is-open" : ""}`}
            aria-label="Dashboard navigation"
        >
            <div className="Left_Nav_header">
                <Link className="logo" to="/" onClick={onClose}>
                    ARTIST<span>HOOD</span>
                </Link>
                <button
                    className="mobile-left-nav-close"
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onClose}
                >
                    <FaTimes aria-hidden="true" />
                </button>
            </div>

            <nav className="Left_Nav_Navbar">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) => (isActive ? "is-active" : "")}
                            >
                                <i className={item.icon} aria-hidden="true"></i>
                                {item.label}

                                {/* Red dot appears on Notifications when unread */}
                                {item.label === "Notifications" && hasUnread && (
                                    <span className="notification-dot" aria-label="Unread notifications" />
                                )}
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <NavLink to="/create-post" onClick={onClose} className="create-nav-link">
                            + Create post
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="left-nav-bottom">
                <Link to={profilePath} onClick={onClose} className="Left_Nav_Footer">
                    <img
                        className="left-nav-footer-logo"
                        src={profileImage}
                        alt=""
                    />
                    <div>
                        <h3>{displayName}</h3>
                        <span>View profile</span>
                    </div>
                </Link>
                <button type="button" className="left-nav-logout" onClick={signOut}>
                    Log out
                </button>
            </div>
        </aside>
    );
}