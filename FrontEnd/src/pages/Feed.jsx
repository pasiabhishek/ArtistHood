import React from "react";
import { Link } from "react-router-dom";
import "./css/Feed.css";
import useTitle from "./UseTitle";

export default function AfterLogin() {
    
    useTitle("Feed")

    return (
        <div className="Feed">
            <div className="search">
                <form action="#">
                <input type="search" />

                </form>
            </div>
        </div>
    );
}
