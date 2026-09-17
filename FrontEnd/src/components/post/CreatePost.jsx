import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/post/CreatePost.css";
import { getApiUrl } from "../../services/api";

export default function CreatePost() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [postData, setPostData] = useState({
        media: null,
        caption: "",
        mediaType: "",
    });

    const [previewUrl, setPreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ==============================
    // IMAGE PREVIEW
    // ==============================
    useEffect(() => {
        if (!postData.media) {
            setPreviewUrl("");
            return;
        }

        if (!postData.media.type.startsWith("image/")) {
            setPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(postData.media);

        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [postData.media]);

    // ==============================
    // MEDIA CHANGE
    // ==============================
    const handleMediaChange = (event) => {
        const media = event.target.files?.[0];

        if (!media) return;

        // 10 MB limit
        if (media.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10 MB.");
            event.target.value = "";
            return;
        }

        const mediaType = media.type.split("/")[0];

        if (mediaType !== "image" && mediaType !== "video") {
            alert("Only images and videos are allowed.");
            event.target.value = "";
            return;
        }

        setPostData((currentPost) => ({
            ...currentPost,
            media,
            mediaType,
        }));
    };

    // ==============================
    // CREATE POST
    // ==============================
    const postHandler = async (e) => {
        e.preventDefault();

        // Get logged-in user
        const currentUser = JSON.parse(
            localStorage.getItem("user")
        );

        if (!currentUser) {
            alert("User not found. Please login again.");
            return;
        }

        // Get token from stored user
        const token = currentUser.token;

        if (!token) {
            alert("No token provided. Please login again.");
            return;
        }

        // Check media
        if (!postData.media) {
            alert("Please select an image or video.");
            return;
        }

        // Check caption
        if (!postData.caption.trim()) {
            alert("Please enter a caption.");
            return;
        }

        const formData = new FormData();

        formData.append(
            "media",
            postData.media
        );

        formData.append(
            "caption",
            postData.caption.trim()
        );

        formData.append(
            "mediaType",
            postData.mediaType
        );

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                getApiUrl("api/posts/create"),
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "Post created:",
                response.data
            );

            alert("Post created successfully!");

            // Reset
            setPostData({
                media: null,
                caption: "",
                mediaType: "",
            });

            setPreviewUrl("");

            e.target.reset();

        } catch (error) {
            console.error(
                "Create post error:",
                error.response?.data || error.message
            );

            if (error.response?.status === 401) {
                alert(
                    "Authentication failed. Please login again."
                );
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to create post. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="CreatePost">

            <header className="create-post-header">
                <div>
                    <p className="eyebrow">
                        Community studio
                    </p>

                    <h1>
                        Create a post
                    </h1>

                    <p className="intro">
                        Share a moment, a work in progress,
                        or something worth discovering.
                    </p>
                </div>

                <span className="post-step">
                    01 / 01
                </span>
            </header>

            <div className="create-post-content">

                <form
                    className="create-post-form"
                    onSubmit={postHandler}
                >

                    {/* MEDIA */}

                    <div className="form-group media-group">

                        <div className="field-heading">

                            <label htmlFor="post-media">
                                Your media
                            </label>

                            <span>
                                Required
                            </span>

                        </div>

                        <label
                            className={`upload-zone${
                                postData.media
                                    ? " has-file"
                                    : ""
                            }`}
                            htmlFor="post-media"
                        >

                            <span
                                className="upload-icon"
                                aria-hidden="true"
                            >
                                +
                            </span>

                            <span className="upload-copy">

                                <strong>
                                    {postData.media
                                        ? "Replace media"
                                        : "Choose a file"}
                                </strong>

                                <small>
                                    Image or video up to 10 MB
                                </small>

                            </span>

                            {postData.media && (
                                <span className="file-name">
                                    {postData.media.name}
                                </span>
                            )}

                        </label>

                        <input
                            id="post-media"
                            className="media-input"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaChange}
                            required={!postData.media}
                        />

                        {/* IMAGE */}

                        {previewUrl && (
                            <img
                                className="media-preview"
                                src={previewUrl}
                                alt="Selected media preview"
                            />
                        )}

                        {/* VIDEO */}

                        {postData.media?.type.startsWith(
                            "video/"
                        ) && (
                            <video
                                className="media-preview"
                                src={URL.createObjectURL(
                                    postData.media
                                )}
                                controls
                            />
                        )}

                    </div>

                    {/* CAPTION */}

                    <div className="form-group">

                        <div className="field-heading">

                            <label htmlFor="post-caption">
                                Caption
                            </label>

                            <span>
                                {postData.caption.length}/500
                            </span>

                        </div>

                        <textarea
                            id="post-caption"
                            value={postData.caption}
                            maxLength={500}
                            placeholder="Tell the community what is happening here..."
                            onChange={(e) =>
                                setPostData(
                                    (currentPost) => ({
                                        ...currentPost,
                                        caption:
                                            e.target.value,
                                    })
                                )
                            }
                            required
                        />

                    </div>

                    {/* FOOTER */}

                    <div className="form-footer">

                        <p>
                            <span aria-hidden="true">
                                ●
                            </span>{" "}
                            Your post will appear in the
                            community feed.
                        </p>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Publishing..."
                                : "Publish post"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}