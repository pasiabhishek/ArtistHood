import React, { useState } from "react";
import "../../styles/layout/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    // Closing the menu after a link click keeps mobile navigation tidy.
    return (
        <div className="bg-gray-950">
            <nav className="nav bg-gray-950">
                {/* The logo takes visitors back to the brand home. */}
                <div className="logo">
                    ARTIST<span className="">HOOD</span>
                </div>

                {/* The hamburger button only matters on smaller screens. */}
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

                {/* Mobile navigation slides open from this container. */}
                <div id="primary-navigation" className={`navbar ${menuOpen ? "active" : ""}`}>
                    {/* <ul>
                        <li>
                            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        </li>
                        <li>
                            <Link to="/artist" onClick={() => setMenuOpen(false)}>Artist</Link>
                        </li>
                        <li>
                            <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                        </li>
                    </ul> */}

                        {/* Mobile actions stay inside the opened menu. */}
                    <div className="logsign mobile-btn">
                        <Link to={"/login"} onClick={() => setMenuOpen(false)}>
                            <button className="login">Login</button>
                        </Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                            <button className="signup">Get Started</button>
                        </Link>
                    </div>
                </div>

                {/* Desktop actions remain visible beside the navigation. */}
                <div className="logsign desktop-btn">
                    <Link to="/login">
                        <button className="login">Login</button>
                    </Link>
                    <Link to="/signup">
                        <button className="signup">Get Started</button>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
