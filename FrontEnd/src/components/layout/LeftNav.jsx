import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSessionUser } from "../../services/api";

export default function LeftNav({ isOpen, onClose }) {
    const navigate = useNavigate();
    const user = getSessionUser();
    const displayName = user?.fullName || user?.username || "Guest";
    const isArtist = user?.role === "Artist";
    const profilePath = user?.username
        ? isArtist
            ? `/artists/${user.username}`
            : `/client/${user.username}`
        : "/feed";

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
                        src={user?.profileImage || "/favicon.ico"}
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
