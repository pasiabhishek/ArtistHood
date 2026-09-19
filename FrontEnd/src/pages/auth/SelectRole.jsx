import React from "react";
import "../../styles/auth/SelectRole.css";
import { Link } from "react-router-dom";
import Header from "../../components/home/Header";
import Footer from "../../components/layout/Footer";

export default function SelectRole() {
    return (
        <div className="SelectRole">
            <Header />
            <main className="SelectRole-main" id="main-content">
                <h2>How will you use ArtistHood?</h2>
                <p>Choose a role to continue. You can always explore the community either way.</p>
                <div className="buttonSet">
                    <Link className="role-card" to="/signup">
                        <strong>I'm a client</strong>
                        <span>Find and book artists for events, launches, and celebrations.</span>
                    </Link>
                    <Link className="role-card" to="/artist-signup">
                        <strong>I'm an artist</strong>
                        <span>Create a profile, share your work, and receive booking requests.</span>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
