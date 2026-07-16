import React from 'react'

export default function SignUp() {
  return (
    <div>
        <div className="hero " style={{ margin: "0px" }}>

            {/* nav */}
            <nav className="nav">
                <div className="logo">
                    ARTIST<span>HOOD</span>
                </div>
            </nav>

            <div className="w-[300px] md:w-[400px] h-110  justify-center items-center flex flex-col rounded-3xl bg-gray-950 border-1 border-gray-800 text-amber-50" style={{ margin: "5px 70px 50px 70px" }}>
                <h2 className="text-2xl font-bold">Welcome back!</h2>

                <p className="text-[8px] md:text-[10px] font-bold p-2">Login to yout account and <span className="text-[var(--btn-bg)]">continue your journey.</span></p>

                <form className="flex flex-col justify-around h-auto rounded-3xl bg-gray-950" style={{ padding: "15px", margin: "20px" }}>

                    <label htmlFor="email">Email Address</label>
                    <input
                        type="Email"
                        id="Email"
                        placeholder="Enter your Email Address"
                        className=" border-2 border-gray-600 w-50 md:w-70 text-sm rounded-md" style={{ padding: "5px", margin: "5px 0px" }}
                        required

                    />
                    <label htmlFor="email">Password </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your Password"
                        className=" border-2 border-gray-600 w-50 md:w-70 text-sm rounded-md" style={{ padding: "5px", margin: "5px 0px" }}
                        required

                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="checkbox"
                            className="border-2 border-gray-600"
                            required
                        />

                        <label htmlFor="checkbox">
                            Remember me
                        </label>
                    </div>



                    <button
                        type="submit"
                        className="
                            w-full
                            mt-4
                            py-4
                            h-8
                            rounded-lg
                            bg-[var(--btn-bg)]
                            text-white
                            font-bold
                            transition
                            duration-300
                            hover:scale-105
                            hover:opacity-90
                            active:scale-95
                        "
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
 
    </div>
  )
}
