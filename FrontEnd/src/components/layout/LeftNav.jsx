import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LeftNav({ isOpen, onClose }) {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const displayName = user?.fullName || "GUEST";

    return (
        <aside
            id="left-navigation"
            className={`Left_Nav ${isOpen ? "is-open" : ""}`}
            aria-label="Dashboard navigation"
        >
            <div className="Left_Nav_header">
                <div className="logo">
                    ARTIST<span>HOOD</span>
                </div>
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
                    <Link to="/feed" onClick={onClose}>
                        <li>
                            <i className="fa-regular fa-house"></i>
                            Home
                        </li>
                    </Link>
                    <Link to="/booking" onClick={onClose}>
                        <li>
                            <i className="fa-regular fa-calendar-check"></i>
                            Booking
                        </li>
                    </Link>
                    <Link to="/messages" onClick={onClose}>
                        <li>
                            <i className="fa-solid fa-message"></i>
                            Messages
                        </li>
                    </Link>
                    <Link to="/notifications" onClick={onClose}>
                        <li>
                            <i className="fa-regular fa-bell"></i>
                            Notification
                        </li>
                    </Link>
                    <Link to="/create-post" onClick={onClose}>
                        <li>+ Create Post</li>
                    </Link>
                </ul>
            </nav>

            <Link to={user?.username ? `/artists/${user.username}` : "/feed"} onClick={onClose}>
                <div className="Left_Nav_Footer">
                    <img
                        className="left-nav-footer-logo"
                        src={ user?.profileImage || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"}
                        alt="profile"
                    />
                    <h3>{displayName}</h3>
                </div>
            </Link>
        </aside>
    );
}