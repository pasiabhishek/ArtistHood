import React from "react";
import { Link } from "react-router-dom";
import "./css/Auth.css";

export default function NotFound() {
    return (
        <main className="auth-page">
            <nav className="auth-nav">
                <Link className="logo" to="/" aria-label="ArtistHood home">
                    ARTIST<span>HOOD</span>
                </Link>
            </nav>
            <section className="auth-content" aria-labelledby="not-found-heading">
                <div className="auth-intro">
                    <p className="auth-eyebrow">WRONG TURN</p>
                    <h1>This stage is empty.</h1>
                    <p>The page you are looking for does not exist or may have moved.</p>
                </div>
                <div className="auth-card not-found-card">
                    <p className="not-found-code">404</p>
                    <h2 id="not-found-heading">Page not found</h2>
                    <p>Let’s get you back to discovering exceptional artists.</p>
                    <Link className="auth-submit not-found-link" to="/">
                        Back to home
                    </Link>
                    <Link className="not-found-secondary" to="/artist">
                        Browse artists
                    </Link>
                </div>
            </section>
        </main>
    );
}
