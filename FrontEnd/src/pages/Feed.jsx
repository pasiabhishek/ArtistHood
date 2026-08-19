import React from "react";
import { Link } from "react-router-dom";
import "./css/Feed.css";
import useTitle from "./UseTitle";
import Left_nav from "../components/feed/Left_nav";

export default function AfterLogin() {
    
    useTitle("Feed")

    return (
        <div className="Feed">
            <Left_nav/>
        </div>
    );
}
