import React, { useState } from "react";
import "./Header.css";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="logo">
        ARTIST<span>HOOD</span>
      </div>

      {/* Hamburger Icon */}
      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation */}
      <div className={`navbar ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>Home</li>
          <li>Artist</li>
          <li>Categories</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        {/* Mobile Buttons */}
        <div className="logsign mobile-btn">
          <button className="login">Login</button>
          <button className="signup">Get Started</button>
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className="logsign desktop-btn">
        <button className="login">Login</button>
        <button className="signup">Get Started</button>
      </div>
    </nav>
  );
}