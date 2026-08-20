import React from "react";
import { FaInstagram, FaFacebookSquare, FaYoutube } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { Link } from "react-router-dom";
import "../../pages/css/Footer.css";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__main">
                <div className="site-footer__content">

                    {/* Brand Section */}
                    <div className="site-footer__brand">
                        <h2 className="site-footer__logo">
                            ARTIST
                            <span style={{ color: "var(--btn-bg)" }}>
                                HOOD
                            </span>
                        </h2>

                        <p className="site-footer__description">
                            India's Premium Artist Booking Platform.
                            Discover, connect and book talented artists
                            for your next unforgettable event.
                        </p>

                        {/* Social Icons */}
                        <div className="site-footer__socials">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="site-footer__social site-footer__social--instagram"
                            >
                                <FaInstagram size={17} />
                            </a>

                            <a
                                href="#"
                                aria-label="Facebook"
                                className="site-footer__social site-footer__social--facebook"
                            >
                                <FaFacebookSquare size={17} />
                            </a>

                            <a
                                href="#"
                                aria-label="YouTube"
                                className="site-footer__social site-footer__social--youtube"
                            >
                                <FaYoutube size={17} />
                            </a>

                            <a
                                href="#"
                                aria-label="WhatsApp"
                                className="site-footer__social site-footer__social--whatsapp"
                            >
                                <IoLogoWhatsapp size={19} />
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <FooterColumn title="Company">
                        <FooterLink to="/">Home</FooterLink>
                        <FooterLink to="/about">About Us</FooterLink>
                        <FooterLink to="/contact">Contact</FooterLink>
                        <FooterLink to="/careers">Career</FooterLink>
                    </FooterColumn>

                    {/* Explore */}
                    <FooterColumn title="Explore">
                        <FooterLink to="/artist">Artists</FooterLink>
                        <FooterLink to="/categories">Categories</FooterLink>
                        <FooterLink to="/about">How It Works</FooterLink>
                    </FooterColumn>

                    {/* Legal */}
                    <FooterColumn title="Legal">
                        <FooterLink to="/privacy">Privacy Policy</FooterLink>
                        <FooterLink to="/terms">Terms of Service</FooterLink>
                        <FooterLink to="/refunds">Refund Policy</FooterLink>
                    </FooterColumn>
                </div>
            </div>

            <div className="site-footer__bottom">
                <p>
                    &copy; 2026{" "}
                    <span>
                        Artist Hood
                    </span>
                    . All rights reserved.
                </p>
            </div>
        </footer>
    );
}

/* ========================= */
/* Footer Column */
/* ========================= */

function FooterColumn({ title, children }) {
    return (
        <div className="site-footer__column">
            <h3>
                {title}
            </h3>

            <ul>
                {children}
            </ul>
        </div>
    );
}

/* ========================= */
/* Footer Link */
/* ========================= */

function FooterLink({ to, children }) {
    return (
        <li>
            <Link
                to={to}
                className="site-footer__link"
            >
                {children}
            </Link>
        </li>
    );
}
