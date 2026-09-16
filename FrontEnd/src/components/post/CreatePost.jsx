import { useEffect, useState } from "react";
import "../../styles/post/CreatePost.css";
import { getApiUrl } from "../../services/api";
import axios from "axios";
import useRequireAuth from "../../hooks/useRequireAuth";


export default function CreatePost() {
    useRequireAuth();

    const user = JSON.parse(localStorage.getItem("user"));

    const [postData, setPostData] = useState({
        userId: user?.id || "",
        media: null,
        caption: "",
        mediaType: "",
    });

    const [previewUrl, setPreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create preview URL for selected image
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

    const postHandler = async (e) => {
        e.preventDefault();

        if (!postData.userId) {
            alert("User not found. Please login again.");
            return;
        }

        if (!postData.media) {
            alert("Please select an image or video.");
            return;
        }

        if (!postData.caption.trim()) {
            alert("Please enter a caption.");
            return;
        }

        const formData = new FormData();

        formData.append("userId", postData.userId);
        formData.append("media", postData.media);
        formData.append("caption", postData.caption.trim());
        formData.append("mediaType", postData.mediaType);

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                getApiUrl("api/posts"),
                formData
            );

            console.log("Post created:", response.data);

            alert("Post created successfully!");

            setPostData((currentPost) => ({
                ...currentPost,
                media: null,
                caption: "",
                mediaType: "image",
            }));

            setPreviewUrl("");

            e.target.reset();
        } catch (error) {
            console.error(
                "Create post error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to create post. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="CreatePost">
            <header className="create-post-header">
                <div>
                    <p className="eyebrow">Community studio</p>

                    <h1>Create a post</h1>

                    <p className="intro">
                        Share a moment, a work in progress, or something worth
                        discovering.
                    </p>
                </div>

                <span className="post-step">01 / 01</span>
            </header>

            <div className="create-post-content">
                <form
                    className="create-post-form"
                    onSubmit={postHandler}
                >
                    {/* Media */}
                    <div className="form-group media-group">
                        <div className="field-heading">
                            <label htmlFor="post-media">
                                Your media
                            </label>

                            <span>Required</span>
                        </div>

                        <label
                            className={`upload-zone${postData.media ? " has-file" : ""
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

                        {previewUrl && (
                            <img
                                className="media-preview"
                                src={previewUrl}
                                alt="Selected media preview"
                            />
                        )}

                        {postData.media?.type.startsWith("video/") && (
                            <video
                                className="media-preview"
                                src={URL.createObjectURL(postData.media)}
                                controls
                            />
                        )}
                    </div>

                    {/* Caption */}
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
                                setPostData((currentPost) => ({
                                    ...currentPost,
                                    caption: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    {/* Footer */}
                    <div className="form-footer">
                        <p>
                            <span aria-hidden="true">●</span>{" "}
                            Your post will appear in the community feed.
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