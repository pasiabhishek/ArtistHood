import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// StrictMode helps catch unsafe React patterns while developing the app.
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
