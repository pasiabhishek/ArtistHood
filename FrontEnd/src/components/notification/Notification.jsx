import React from "react";
import { Link } from "react-router-dom";

export default function Notification() {
    return (
        <section className="page-empty" id="main-content">
            <p className="discover-kicker">Activity</p>
            <h1>Notifications</h1>
            <p>
                Follows, booking updates, and comments will show up in this space
                as soon as they start coming in.
            </p>
            <Link to="/feed">Back to feed</Link>
        </section>
    );
}
