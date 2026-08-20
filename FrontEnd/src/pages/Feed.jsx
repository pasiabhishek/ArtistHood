import React from "react";
import { Link } from "react-router-dom";
import "./css/Feed.css";
import useTitle from "./UseTitle";

export default function AfterLogin() {
    
    useTitle("Feed")

    return (
        <div className="Feed">
            <h1>hello</h1>
        </div>
    );
}
