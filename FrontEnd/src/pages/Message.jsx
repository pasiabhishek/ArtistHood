import React from "react";
import { Link } from "react-router-dom";

export default function Message() {
    return (
        <section className="page-empty" id="main-content">
            <p className="discover-kicker">Inbox</p>
            <h1>Messages</h1>
            <p>
                Direct conversations with artists and clients will appear here.
                Start by exploring talent and sending a booking enquiry.
            </p>
            <Link to="/artists">Browse artists</Link>
        </section>
    );
}
