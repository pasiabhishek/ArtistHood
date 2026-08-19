import React from "react";
import { Link } from "react-router-dom";
import "./css/Feed.css";
import useTitle from "./UseTitle";

export default function AfterLogin() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const displayName = user?.fullName || "there";
    const email = user?.email || "";
    useTitle("Feed")

    return (
        <div className="Feed">
            <div className="Left_Nav">
                <div className="Left_Nav_header">
                    <div className="logo">
                        ARTIST<span className="">HOOD</span>
                    </div>
                </div>
                <div className="Left_Nav_Navbar">
                    <ul>
                        <li>Home</li>
                        <li>Artist</li>
                        <li>Booking</li>
                        <li>Messages</li>
                        <li>Notification</li>
                        <li><button>+Create Post</button></li>
                    </ul>
                </div>
                <div className="profile">
                    <img src="favicon.ico" alt="profile picture" />
                    <h3>{displayName}</h3>
                </div>

            </div>
        </div>
    );
}
