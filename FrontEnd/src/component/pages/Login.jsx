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

            <div className="m-10 " style={{margin:"0px 50px"}}>
                <form className="w-[40vw] h-110  justify-center items-center flex bg-red-400 flex-col rounded-3xl">
                    <h2 className="text-3xl font-bold">Login</h2>
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