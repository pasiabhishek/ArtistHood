import React from "react";
import { Link } from "react-router-dom";

export default function LeftNav() {
    const storedUser = localStorage.getItem("user");
    // Read the saved profile so the navigation can greet the current member.
    const user = storedUser ? JSON.parse(storedUser) : null;

    const displayName = user?.fullName || "there";

    return (
        <div className="Left_Nav">

            {/* Brand mark stays at the top of the dashboard navigation. */}
            <div className="Left_Nav_header">
                <div className="logo">
                    ARTIST<span>HOOD</span>
                </div>
            </div>

            {/* These links are the main shortcuts around the signed-in area. */}
            <div className="Left_Nav_Navbar">
                <ul>

                    <Link to="/feed">
                        <li>
                            <i className="fa-regular fa-house"></i>
                            Home
                        </li>
                    </Link>

                    <Link to="/discover">
                        <li>
                            <i className="fa-solid fa-users"></i>
                            Discover
                        </li>
                    </Link>

                    <Link to="/booking">
                        <li>
                            <i className="fa-regular fa-calendar-check"></i>
                            Booking
                        </li>
                    </Link>

                    <Link to="/messages">
                        <li>
                            <i className="fa-solid fa-message"></i>
                            Messages
                        </li>
                    </Link>

                    <Link to="/notifications">
                        <li>
                            <i className="fa-regular fa-bell"></i>
                            Notification
                        </li>
                    </Link>

                    <Link to="/create-post">
                        <li>
                            + Create Post
                        </li>
                    </Link>

                </ul>
            </div>

            {/* Show a small account summary at the bottom of the rail. */}
            <div className="Left_Nav_Footer">
                <img
                    src="/favicon.ico"
                    alt="profile"
                />

                <h3>{displayName}</h3>
            </div>

        </div>
    );
}
