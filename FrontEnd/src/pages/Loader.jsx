import React from "react";
import "./css/Loader.css";
import useTitle from "./UseTitle";

export default function Loader() {
    useTitle("Loading")

    return (
        <div className="loading-page">
            <div className="loading-content">
                <h1>
                    ARTIST<span>HOOD</span>

                </h1>
            </div>
        </div>
    );
}
