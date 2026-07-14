import React from "react";

export default function Login() {
    return (
        <div className="hero ">

            {/* nav */}
            <nav className="nav">
                <div className="logo">
                    ARTIST<span>HOOD</span>
                </div>
            </nav>

            <div className="w-[250px] md:w-[400px] h-110  justify-center items-center flex flex-col rounded-3xl bg-gray-950 border-2 border-red-50 text-amber-50" style={{ margin: "50px" }}>
                <form className="w-[250px] md:w-[400px] h-110  flex flex-col rounded-3xl bg-gray-950 border-2 border-red-50" style={{ padding: "10px" }}>
                    <h2 className="text-[20px] font-bold">Welcome back !</h2>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="w-50 border-2 bg-amber-600"
                    />
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="w-50 border-2 bg-amber-600"
                    />
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="w-50 border-2 bg-amber-600"
                    />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}