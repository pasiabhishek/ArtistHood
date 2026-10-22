import React from "react";
import "../../styles/common/Loader.css";
import useTitle from "../../hooks/useTitle";

export default function Loader() {
    useTitle("Loading");

    return (
        <div className="loading-page" role="status" aria-live="polite">
            <div className="loading-content">
                <h1>
                    ARTIST<span>HOOD</span>
                </h1>
                <div className="loading-bar" aria-hidden="true">
                    <i />
                </div>
            </div>
        </div>
    );
}
