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

        <main className="after-login-page">
            <section className="after-login-card">
                <p className="after-login-eyebrow">WELCOME ABOARD</p>
                <h1>Hi, {displayName}!</h1>
                <p>
                    You’re successfully signed in to ArtistHood. Explore artists,
                    discover fresh talent, and manage your next big event from here.
                </p>

                <div className="after-login-actions">
                    <Link className="after-login-btn primary" to="/artist">
                        Explore artists
                    </Link>
                    <Link className="after-login-btn secondary" to="/">
                        Go to home
                    </Link>
                </div>

                {email ? <p className="after-login-user">Signed in as {email}</p> : null}
            </section>
        </main>
    );
}
