import React from 'react'
import './Featured_artist.css'
import artists from "../json files/artist.json";
import { MdVerified } from "react-icons/md";



export default function Featured_artist() {

    return (
        <div>
            <div>
                <div className="TopCategories">
                    <p className="Explore">
                        HandPicked
                    </p>
                    <h3 className="Popular">
                        Feature Artist
                    </h3>
                    <div className="Artist_cardholder">
                        <Featured_artist_card />
                    </div>
                </div>

            </div>
        </div>
    )
}


export function Featured_artist_card() {
    return (

        <div className='artist_body'>
            
            {artists.map((Artist_api) => (

                <div className="artist_card" key={Artist_api.id}>
                    <div className="artist_img">
                        <img src={Artist_api.image} alt={Artist_api.name} />
                    </div>
                    <div className="artist_details">
                        <h1 className="artist_name">
                            {Artist_api.name}  <MdVerified />

                        </h1>
                        <p className="artist_rating_num">
                            {Artist_api.rating} &#9733; ( {Artist_api.reviews} )

                        </p>
                        <h5 className="artist_type">
                            {Artist_api.category}
                        </h5>
                        <h3 className="Artist_charegs">
                            &#8377;{Artist_api.price}
                        </h3>
                        <p className="artist_rating_num">
                            /  {Artist_api.priceType}
                        </p>
                        <button className="View_profile ">
                            View Profile
                        </button>
                    </div>
                </div>

            ))}

        </div>
    )
}
