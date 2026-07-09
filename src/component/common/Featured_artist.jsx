import React from 'react'
import './Featured_artist.css'
import { FaStar } from "react-icons/fa";

export default function Featured_artist() {

    return (
        <div>
            <div>
                <div className="TopCategories">
                    <p className="Explore" className="">
                        HandPicked
                    </p>
                    <h3 className="Popular">
                        Feature Artist
                    </h3>
                    <div className="Artist_cardholder">
                        <Featured_artist_card/>
                        <Featured_artist_card/>
                        <Featured_artist_card/>
                       
                    </div>
                </div>

            </div>
        </div>
    )
}


export function Featured_artist_card() {
    
    return (
        <div>
            <div className="artist_card">
                <div className="artist_img">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRROvvfrOEhVpHSlE1iWBXKeWnv5ryjCPnJ4CROvbkTig&s=10" alt="master aazam" srcset="" />
                </div>
                <div className="artist_details">
                    <h1 className="artist_name">
                        Master Aazam
                    </h1>
                    <p className="artist_rating_num">
                        &#9733;&#9733;&#9733;&#9733;&#9733; ( 120 )

                    </p>
                    <h5 className="artist_type">
                        Poet
                    </h5>
                    <h3 className="Artist_charegs">
                       &#8377;15,000
                    </h3>
                    <p className="artist_rating_num">
                        / Per Event
                    </p>
                    <button className="View_profile ">
                        View Profile
                    </button>
                </div>
            </div>

        </div>
    )
}
