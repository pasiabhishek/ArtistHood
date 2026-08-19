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
        <div className="Feed">
            
        </div>
    );
}
