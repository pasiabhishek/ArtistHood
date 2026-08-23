import React from "react";
import { Link } from "react-router-dom";
import "./css/Feed.css";
import useTitle from "./UseTitle";

export default function AfterLogin() {

    useTitle("Feed")

    return (
        <div className="Feed">
            <div className="feed_header">
                <img src="favicon.ico" alt="" />
                <div className="search">
                    <form action="#">
                        <input type="search" />
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </form>
                </div>
            </div>

            <div className="Create_post">

            </div>
        </div>
    );
}
