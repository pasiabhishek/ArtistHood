import React from "react";
import "./css/Feed.css";
import useTitle from "./UseTitle";

export default function AfterLogin() {

    useTitle("Feed")

    return (
        <div className="Feed">
            <div className="search">
                <form action="#">
                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" placeholder="Search artists, posts, or events" aria-label="Search artists, posts, or events" />
                </form>
            </div>

            <div className="Create_post">

            </div>
        </div>
    );
}
