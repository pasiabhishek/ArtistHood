import { useState } from "react";
import React from "react";
import "./css/CreatePost.css";

export default function CreatePost() {
    const user = JSON.parse(localStorage.getItem("user"));
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const [postData, setPostData] = useState({
        userId: user?.id || null,
        media: null,
        caption: "",
        mediaType: "image",
    });

    const postHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userId", postData.userId);
        formData.append("media", postData.media);
        formData.append("caption", postData.caption);
        formData.append("mediaType", postData.mediaType);

        try {
            const res = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to create post");

            alert("Post created successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to create post");
        }
    };

    return (
        <div className="CreatePost">
            <div className="header">
                <h1>Create Post</h1>
            </div>

            <div className="content">
                <form className="create-post-form" onSubmit={postHandler}>
                    <div className="form-group">
                        <label>Media</label>
                        <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={(e) =>
                                setPostData({
                                    ...postData,
                                    media: e.target.files[0],
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Caption</label>
                        <textarea
                            value={postData.caption}
                            onChange={(e) =>
                                setPostData({
                                    ...postData,
                                    caption: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <button type="submit">Post</button>
                </form>
            </div>
        </div>
    );
}
