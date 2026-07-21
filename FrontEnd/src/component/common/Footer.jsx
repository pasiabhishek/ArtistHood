import React from 'react'
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { Link } from "react-router-dom";


export default function Footer() {
    return (
        <div>
        <div style={{ margin: " 40px auto 0px auto " }} className="footer_body w-100vw bg-gray-950 flex justify-center items-center flex-col sm:flex-row sm:h-50 ">
            <div style={{ padding: " 15px" }} className="inner_conatiner flex justify-around items-center flex-col sm:flex-row sm:h-30 ">

                {/* first coloum */}
                <div className="firstCol m-10 gap-1.5  items-center  w-30 text-center">
                    <div className="text-[18px] text-amber-50 font-bold " style={{ margin: " 7px auto 0px auto " }}>
                        ARTIST<span className="" style={{ color: "var(--btn-bg)" }}
                        >HOOD</span>
                    </div>
                    <p className="text-taupe-100  text-[6.5px] text-center justify-center items-center  w-30 m-2" style={{ margin: " 1px auto 2px auto " }}>
                        India's Premium Artist Booking Platform.
                    </p>
                    <ul className='flex flex-row justify-around items-center  w-30 text-center text-amber-50 ' style={{ margin: " 5px auto 12px auto " }}>
                        <li className='m-2'  ><a href="#"><FaInstagram />
                        </a></li>
                        <li><a href="#"><FaFacebookSquare />
                        </a></li>
                        <li><a href="#"><FaYoutube />
                        </a></li>
                        <li><a href="#"><IoLogoWhatsapp />
                        </a></li>

                    </ul>

                </div>

                {/* Second coloum */}
                <div className="SecondCol m-10 font-light text-[10px] gap-1.5 text-gray-400 items-center flex flex-col w-30 text-center">
                    <h6 className='text-red-50 font-bold'>Company</h6>
                    <ul className='flex flex-col justify-around items-center  w-30 text-center text-amber-50 ' style={{ margin: " 5px auto 12px auto " }}>
                        <li className='m-2'  >
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link to="/careers">
                                Career
                            </Link>
                        </li>
                    </ul>
                </div>

                {      /* Second coloum */}
                <div className="SecondCol m-10 font-light text-[10px] gap-1.5 text-gray-400 items-center flex flex-col w-30 text-center">
                    <h6 className='text-red-50 font-bold'>Explore</h6>
                    <ul className='flex flex-col justify-around items-center  w-30 text-center text-amber-50 ' style={{ margin: " 5px auto 12px auto " }}>
                        <li className='m-2'  >
                            <Link to="/artist">
                                Artist
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories">Categories</Link>
                        </li>
                        <li>
                            <Link to="/about">
                                How it Works
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Second coloum */}
                <div className="SecondCol m-10 font-light text-[10px] gap-1.5 text-gray-400 items-center flex flex-col w-30 text-center">
                    <h6 className='text-red-50 font-bold'>Legal</h6>
                    <ul className='flex flex-col justify-around items-center  w-30 text-center text-amber-50 ' style={{ margin: " 5px auto 12px auto " }}>
                        <li className='m-2'  >
                            <Link to="/privacy">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms">
                                Terms of Service
                            </Link>
                        </li>
                        <li>
                            <Link to="/refunds">
                                Refund Policy
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
            </div>
            <div className='w-100vw text-emerald-50 text-[12px] bg-gray-950 flex justify-center items-center'>
                &copy; 2026 Artist Hood. All rights reserved
            </div>

        </div>
    )
}
