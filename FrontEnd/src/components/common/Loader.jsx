import React from "react";
import "../../styles/common/Loader.css";
import useTitle from "../../hooks/useTitle";

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
