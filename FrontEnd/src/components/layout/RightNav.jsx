import React from 'react'
import '../../styles/pages/Discover.css'
import artists from "../../data/artists.json"
export default function RightNav() {
    // The right rail is reserved for recommendations and activity widgets.
    return (
        <div>
            <div className="Right_Nav">

                <aside className="discover-sidebar">
                    <div className="sidebar-panel">
                        <h3>Featured creators</h3>
                        {artists.slice(0, 4).map((artist) => (
                            <div key={artist.name} className="creator-row">
                                <img src={artist.image} alt={artist.name} />
                                <div>
                                    <strong>{artist.name}</strong>
                                    <span>{artist.role}</span>
                                </div>
                                <button type="button">Follow</button>
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-panel">
                        <h3>Trending now</h3>
                        <ul className="trend-list">
                            <li>Wedding DJs</li>
                            <li>Live acoustic sets</li>
                            <li>Stage choreography</li>
                            <li>Performance reels</li>
                        </ul>
                    </div>
                </aside>



            </div>
        </div >
    )
}
