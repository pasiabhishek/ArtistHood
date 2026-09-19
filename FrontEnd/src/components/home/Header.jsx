import React, { useEffect, useState } from "react";
import "../../styles/layout/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() =>
        Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const updateAuthState = () =>
            setIsLoggedIn(Boolean(localStorage.getItem("token")));

        window.addEventListener("storage", updateAuthState);
        return () => window.removeEventListener("storage", updateAuthState);
    }, []);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="site-header">
            <nav className="nav" aria-label="Main navigation">
                <Link className="logo" to="/" onClick={closeMenu}>
                    ARTIST<span>HOOD</span>
                </Link>

                <ul className="nav-links desktop-links">
                    <li>
                        <NavLink to="/artists" className={({ isActive }) => (isActive ? "is-active" : "")}>
                            Artists
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/categories" className={({ isActive }) => (isActive ? "is-active" : "")}>
                            Categories
                        </NavLink>
                    </li>
                </ul>

                <button
                    className="menu-icon"
                    type="button"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((isOpen) => !isOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div
                    id="primary-navigation"
                    className={`navbar ${menuOpen ? "active" : ""}`}
                >
                    <div className="logsign mobile-btn">
                        <div className="mobile-nav-links">
                            <Link to="/artists" onClick={closeMenu}>Artists</Link>
                            <Link to="/categories" onClick={closeMenu}>Categories</Link>
                        </div>
                        {isLoggedIn ? (
                            <Link className="header-action signup" to="/feed" onClick={closeMenu}>
                                Open feed
                            </Link>
                        ) : (
                            <>
                                <Link className="header-action login" to="/login" onClick={closeMenu}>
                                    Login
                                </Link>
                                <Link className="header-action signup" to="/signup" onClick={closeMenu}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="logsign desktop-btn">
                    {isLoggedIn ? (
                        <Link className="header-action signup" to="/feed">
                            Open feed
                        </Link>
                    ) : (
                        <>
                            <Link className="header-action login" to="/login">
                                Login
                            </Link>
                            <Link className="header-action signup" to="/signup">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
