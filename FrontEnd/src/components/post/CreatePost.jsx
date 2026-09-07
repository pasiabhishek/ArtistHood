import { useEffect, useState } from "react";
import "../../styles/post/CreatePost.css";

export default function CreatePost() {
    // Use the saved account so the API knows who owns the new post.
    const user = JSON.parse(localStorage.getItem("user"));
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const [postData, setPostData] = useState({
        userId: user?.id || null,
        media: null,
        caption: "",
        mediaType: "image",
    });
    const [previewUrl, setPreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create a temporary image URL for instant feedback before publishing.
    useEffect(() => {
        if (!postData.media || !postData.media.type.startsWith("image/")) {
            setPreviewUrl("");
            return undefined;
        }

        const objectUrl = URL.createObjectURL(postData.media);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [postData.media]);

    const handleMediaChange = (event) => {
        const media = event.target.files[0];

        if (!media) return;

        // Infer the media type from the selected file instead of asking twice.
        setPostData((currentPost) => ({
            ...currentPost,
            media,
            mediaType: media.type.split("/")[0],
        }));
    };

    const postHandler = async (e) => {
        e.preventDefault();

        // FormData lets the caption and binary media travel in one request.
        const formData = new FormData();
        formData.append("userId", postData.userId);
        formData.append("media", postData.media);
        formData.append("caption", postData.caption);
        formData.append("mediaType", postData.mediaType);

        // Disable the button while the upload is in progress.
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/create`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to create post");

            alert("Post created successfully!");
            setPostData((currentPost) => ({
                ...currentPost,
                media: null,
                caption: "",
            }));
            e.target.reset();
        } catch (error) {
            console.error(error);
            alert("Failed to create post");
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
                    <p className="intro">Share a moment, a work in progress, or something worth discovering.</p>
                </div>
                <span className="post-step">01 / 01</span>
            </header>

            <div className="create-post-content">
                <form className="create-post-form" onSubmit={postHandler}>
                    <div className="form-group media-group">
                        <div className="field-heading">
                            <label htmlFor="post-media">Your media</label>
                            <span>Required</span>
                        </div>
                        <label className={`upload-zone${postData.media ? " has-file" : ""}`} htmlFor="post-media">
                            <span className="upload-icon" aria-hidden="true">+</span>
                            <span className="upload-copy">
                                <strong>{postData.media ? "Replace media" : "Choose a file"}</strong>
                                <small>Image or video up to 10 MB</small>
                            </span>
                            {postData.media && <span className="file-name">{postData.media.name}</span>}
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
                            <img className="media-preview" src={previewUrl} alt="Selected media preview" />
                        )}
                    </div>

                    <div className="form-group">
                        <div className="field-heading">
                            <label htmlFor="post-caption">Caption</label>
                            <span>{postData.caption.length}/500</span>
                        </div>
                        <textarea
                            id="post-caption"
                            value={postData.caption}
                            maxLength="500"
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

                    <div className="form-footer">
                        <p><span aria-hidden="true">●</span> Your post will appear in the community feed.</p>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Publishing..." : "Publish post"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
