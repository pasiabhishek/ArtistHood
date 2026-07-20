import React from 'react'
import { Link } from 'react-router-dom'

export default function Error404() {
  return (
    <div className="hero" style={{ margin: "0px" }}>
      {/* nav */}
      <nav className="nav">
        <div className="logo">
          ARTIST<span>HOOD</span>
        </div>
      </nav>

      <div className="w-[320px] md:w-[450px] justify-center items-center flex flex-col rounded-3xl bg-gray-950 border-1 border-gray-800 text-amber-50" style={{ margin: "5px 70px 50px 70px" }}>
        
        {/* Animated Icon */}
        <div style={{ fontSize: "60px", margin: "25px 0px 15px 0px", animation: "bounce 2s infinite" }}>
          🎭
        </div>

        {/* Error Code */}
        <div className="text-6xl md:text-7xl font-black" style={{ color: "rgb(75, 58, 185)", fontFamily: "'Poppins', sans-serif", margin: "10px 0px 5px 0px", letterSpacing: "-2px" }}>
          404
        </div>

        {/* Divider */}
        <div style={{ height: "2px", width: "60px", background: "linear-gradient(to right, rgb(49, 37, 127), rgb(75, 58, 185))", margin: "10px 0px 15px 0px", borderRadius: "1px" }}></div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center" style={{ fontFamily: "'Poppins', sans-serif", marginBottom: "8px" }}>
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-[10px] md:text-[11px] font-medium p-2 text-center text-gray-400" style={{ margin: "0px 10px 20px 10px" }}>
          The page you're looking for doesn't exist. It might have been moved or you may have taken a wrong turn!
        </p>

        {/* Content Area */}
        <div className="flex flex-col justify-around h-auto rounded-3xl bg-gray-950 w-full" style={{ padding: "20px 15px", margin: "10px 20px 20px 20px", border: "1px solid rgba(75, 58, 185, 0.2)" }}>
          
          {/* Helpful Info */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
              Here's what you can do:
            </p>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-center gap-2 justify-center">
                <span style={{color: "rgb(75, 58, 185)"}}>✓</span> Go back to the home page
              </li>
              <li className="flex items-center gap-2 justify-center">
                <span style={{color: "rgb(75, 58, 185)"}}>✓</span> Browse our amazing artists
              </li>
              <li className="flex items-center gap-2 justify-center">
                <span style={{color: "rgb(75, 58, 185)"}}>✓</span> Check the navigation menu
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(75, 58, 185, 0.3)", margin: "15px 0px" }}></div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/" className="w-full">
              <button
                className="
                  w-full
                  mt-4
                  py-4
                  rounded-lg
                  bg-[var(--btn-bg)]
                  text-white
                  font-bold
                  transition
                  duration-300
                  hover:scale-105
                  hover:opacity-90
                  active:scale-95
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span>🏠</span> Back to Home
              </button>
            </Link>

            <Link to="/" className="w-full">
              <button
                className="
                  w-full
                  mt-4
                  py-4
                  rounded-lg
                  border-2
                  text-white
                  font-bold
                  transition
                  duration-300
                  hover:scale-105
                  hover:opacity-90
                  active:scale-95
                  bg-transparent
                  flex
                  items-center
                  justify-center
                  gap-2
                "
                style={{ borderColor: "rgb(75, 58, 185)" }}
              >
                <span>🎤</span> Browse Artists
              </button>
            </Link>
          </div>

          {/* Footer Help Text */}
          <p className="text-[8px] text-gray-500 text-center mt-4">
            Need help? <span style={{color: "rgb(75, 58, 185)", cursor: "pointer"}}>Contact us</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
