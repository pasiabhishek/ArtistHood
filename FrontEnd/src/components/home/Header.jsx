import React, { useEffect, useState } from "react";
import "../../styles/layout/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

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

                {!isLoggedIn && (
                    <button
                        className="menu-icon"
                        type="button"
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={menuOpen}
                        aria-controls="primary-navigation"
                        onClick={() => setMenuOpen((isOpen) => !isOpen)}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}

                {!isLoggedIn && (
                    <div
                        id="primary-navigation"
                        className={`navbar ${menuOpen ? "active" : ""}`}
                    >
                        <div className="logsign mobile-btn">
                            <Link
                                className="header-action login"
                                to="/login"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>
                            <Link
                                className="header-action signup"
                                to="/signup"
                                onClick={closeMenu}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}

                {!isLoggedIn && (
                    <div className="logsign desktop-btn">
                        <Link className="header-action login" to="/login">
                            Login
                        </Link>
                        <Link className="header-action signup" to="/signup">
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}