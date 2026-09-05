import React from 'react'
import { Link } from "react-router-dom";

export default function Left_nav() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const displayName = user?.fullName || "there";
    const email = user?.email || "";
    return (
        <div>
            <div className="Left_Nav">
                <div className="Left_Nav_header">
                    <div className="logo">
                        ARTIST<span className="">HOOD</span>
                    </div>
                </div>
                <div className="Left_Nav_Navbar">
                    <ul>
                        <li>
                            <Link to="/feed">
                                <i className="fa-regular fa-house"></i> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/discover">
                                <i className="fa-solid fa-users"></i> Discover
                            </Link>
                        </li>
                        <li>
                            <Link to="/booking">
                                <i className="fa-regular fa-calendar-check"></i> Booking
                            </Link>
                        </li>
                        <li>
                            <Link to="/messages">
                                <i className="fa-solid fa-message"></i> Messages
                            </Link>
                        </li>
                        <li>
                            <Link to="/notifications">
                                <i className="fa-regular fa-bell"></i> Notification
                            </Link>
                        </li>
                        <Link to="/create-post">
                            <li>
                                <button>
                                    + Create Post
                                </button>
                            </li>
                        </Link>

                    </ul>
                </div>
                <div className="Left_Nav_Footer">
                    <img src="favicon2.png" alt="profile picture" />
                    <h3>{displayName}</h3>
                </div>

            </div>
        </div>
    )
}
