import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import LeftNav from "./LeftNav";
import Header from "../home/Header";
import "../../styles/layout/AppLayout.css";

export default function AppLayout() {
    const [isLeftNavOpen, setIsLeftNavOpen] = useState(false);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setIsLeftNavOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, []);

    return (
        <div className="app-layout">
            <Header />
            <LeftNav
                isOpen={isLeftNavOpen}
                onClose={() => setIsLeftNavOpen(false)}
            />
            <Outlet />

            {isLeftNavOpen && (
                <button
                    className="left-nav-scrim"
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setIsLeftNavOpen(false)}
                />
            )}

            {!isLeftNavOpen && (
                <button
                    className="floating-left-nav-trigger"
                    type="button"
                    aria-label="Open navigation menu"
                    aria-expanded={false}
                    aria-controls="left-navigation"
                    onClick={() => setIsLeftNavOpen(true)}
                >
                    <FaBars aria-hidden="true" />
                </button>
            )}
        </div>
    );
}