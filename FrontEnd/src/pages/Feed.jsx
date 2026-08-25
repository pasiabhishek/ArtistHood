import React from "react";
import "./css/Feed.css";
import useTitle from "./UseTitle";

export default function AfterLogin() {

    useTitle("Feed")

    return (
        <div className="Feed">
            <div className="search">
                <form action="#">
                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" placeholder="Search artists, posts, or events" aria-label="Search artists, posts, or events" />
                </form>
            </div>

            <div className="Create_post">
                <div className="first_row">
                    <img src="favicon.ico" alt="profile picture" />
                    <textarea placeholder="Share something with the community..." />
                </div>
                <div className="sec_row">
                    <div className="post_icon">
                        <i class="fa-regular fa-image"></i>
                        <i class="fa-solid fa-video"></i>
                    </div>
                    <button>Post</button>
                </div>
            </div>
            <div className="posts">
                <div className="post-card">
                    <div className="first_row">
                        <img src="favicon.ico" alt="profile picture" />
                        <div className="post-heading">
                            <h3 id="post-heading-h3">MASTER AAZAM</h3>
                            <h5 id="post-heading-h5">Writer</h5>
                        </div>
                    </div>
                    <div className="sec_row">
                        <p>Grateful to perform live at Aarambha Collective Studio. Every stage is an opportunity to connect through poetry, storytelling, and creativity. Thank you to everyone who made this experience memorable. Looking forward to many more performances. 🎙️✨
                        </p>
                    </div>
                    <img src="https://media.licdn.com/dms/image/v2/D4D22AQG9KvIQjn37Xw/feedshare-shrink_480/B4DZ9jbcQmJwAo-/0/1784079566522?e=1788998400&v=beta&t=2mP5yYWanSKojiCwgCXQnubSKLRXX28H19RmFC8sYEI" alt="" />
                </div>
               
            </div>

        </div>
    );
}
