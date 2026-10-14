import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    artistDisplayName,
    artistUsernameOf,
    flattenArtistRecord,
    getSessionUser,
} from "../../services/api";
import {
    addLocalPostComment,
    getLocalPostInteractions,
    toggleLocalArtistFollow,
    toggleLocalPostLike,
} from "../../services/postInteractions";
import "../../styles/post/PostCard.css";

export default function PostCard({
    post,
    showActions = true,
    linkToPost = true,
    className = "",
}) {
    const artist = flattenArtistRecord(post.artist) || post.artist;
    const username =
        artistUsernameOf(artist) || post.username || post.user?.username || "";
    const artistId = String(
        artist?._id ||
            post.artist?._id ||
            (typeof post.artist === "string" ? post.artist : "")
    );
    const followKey = username
        ? `username:${username.toLowerCase()}`
        : artistId
          ? `id:${artistId}`
          : "";
    const authorName = artist ? artistDisplayName(artist) : username || "Artist";
    const profilePath = username ? `/artists/${username}` : "/artists";
    const postPath = post._id ? `/posts/${post._id}` : null;
    const detailLink = linkToPost ? postPath : null;
    const sessionUser = getSessionUser();
    const sessionUserId = String(sessionUser?.id || sessionUser?._id || "");
    const serverLiked = (post.likes || []).some(
        (like) => String(like?._id || like) === sessionUserId
    );
    const [liked, setLiked] = useState(serverLiked);
    const [likeCount, setLikeCount] = useState((post.likes || []).length);
    const [following, setFollowing] = useState(Boolean(post.isFollowing));
    const [comments, setComments] = useState(post.comments || []);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [interactionMessage, setInteractionMessage] = useState("");
    const [interactionMessageType, setInteractionMessageType] = useState("error");
    const [shareUrl, setShareUrl] = useState("");
    const isOwnArtistPost = Boolean(
        (sessionUser?.username &&
            username &&
            sessionUser.username.toLowerCase() === username.toLowerCase()) ||
        (sessionUserId && artistId && sessionUserId === artistId)
    );

    useEffect(() => {
        try {
            const interactions = getLocalPostInteractions(post, sessionUserId, followKey);
            setLiked(interactions.liked);
            setLikeCount(interactions.likeCount);
            setFollowing(interactions.following);
            setComments(interactions.comments);
        } catch (error) {
            console.error("Could not load saved post interactions:", error);
            setInteractionMessage("Could not load saved interactions from this browser.");
        }
    }, [post, sessionUserId, followKey]);

    const toggleLike = () => {
        setInteractionMessage("");
        setInteractionMessageType("error");
        try {
            const result = toggleLocalPostLike(post, sessionUserId);
            setLiked(result.liked);
            setLikeCount(result.likeCount);
        } catch {
            setInteractionMessage("Could not save your like in this browser.");
        }
    };

    const toggleFollow = () => {
        if (!followKey) {
            setInteractionMessage("This author's profile cannot be identified for following.");
            return;
        }
        setInteractionMessage("");
        setInteractionMessageType("error");
        try {
            setFollowing(
                toggleLocalArtistFollow(followKey, sessionUserId, following)
            );
        } catch {
            setInteractionMessage("Could not save your follow in this browser.");
        }
    };

    const submitComment = (event) => {
        event.preventDefault();
        const text = commentText.trim();
        if (!text) return;
        setInteractionMessage("");
        setInteractionMessageType("error");
        try {
            const comment = addLocalPostComment(post._id, sessionUser, text);
            setComments((current) => [...current, comment]);
            setCommentText("");
        } catch {
            setInteractionMessage("Could not save your comment in this browser.");
        }
    };

    const sharePost = async () => {
        const url = `${window.location.origin}${postPath || window.location.pathname}`;
        setInteractionMessage("");
        setInteractionMessageType("error");
        setShareUrl("");
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "ArtistHood Post",
                    text: post.caption || "Check out this post",
                    url,
                });
                setInteractionMessageType("success");
                setInteractionMessage("Post shared.");
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                setInteractionMessageType("success");
                setInteractionMessage("Post link copied.");
            } else {
                setShareUrl(url);
                setInteractionMessage(
                    "Sharing is unavailable here. Copy the post link below."
                );
            }
        } catch (error) {
            if (error.name === "AbortError") return;
            if (navigator.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(url);
                    setInteractionMessageType("success");
                    setInteractionMessage("Post link copied.");
                    return;
                } catch (clipboardError) {
                    console.error("Could not copy post link:", clipboardError);
                }
            }
            setShareUrl(url);
            if (error.name !== "AbortError") {
                setInteractionMessage("Could not share or copy the post link.");
            }
        }
    };

    const copyShareUrl = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setInteractionMessageType("success");
            setInteractionMessage("Post link copied.");
            setShareUrl("");
        } catch (error) {
            console.error("Could not copy post link:", error);
            setInteractionMessage("Copy is unavailable. Select and copy the link below.");
        }
    };

    return (
        <article className={`post-card-template ${className}`.trim()}>
            <div className="post-card-template-header">
                <Link to={profilePath} className="post-card-template-profile-link">
                    <img
                        className="post-card-template-avatar"
                        src={artist?.profileImage || "/favicon.ico"}
                        alt=""
                    />
                </Link>
                <div className="post-card-template-author">
                    <Link to={profilePath} className="post-card-template-author-link">
                        <h3>{authorName}</h3>
                    </Link>
                    <span>{artist?.category || (username ? `@${username}` : "Artist")}</span>
                </div>
              </div>

            <div className="post-card-template-content">
                {post.caption && (
                    detailLink ? (
                        <Link to={detailLink} className="post-card-template-caption-link">
                            <p>{post.caption}</p>
                        </Link>
                    ) : (
                        <p>{post.caption}</p>
                    )
                )}
                {post.mediaType === "image" && post.media && (
                    detailLink ? (
                        <Link to={detailLink} aria-label="Open post">
                            <img
                                className="post-card-template-media"
                                src={post.media}
                                alt={post.caption || "Post"}
                            />
                        </Link>
                    ) : (
                        <img
                            className="post-card-template-media"
                            src={post.media}
                            alt={post.caption || "Post"}
                        />
                    )
                )}
                {post.mediaType === "video" && post.media && (
                    <video
                        className="post-card-template-media"
                        src={post.media}
                        controls
                        preload="metadata"
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
                {post.mediaType === "audio" && post.media && (
                    <audio
                        className="post-card-template-audio"
                        src={post.media}
                        controls
                        preload="metadata"
                    >
                        Your browser does not support the audio element.
                    </audio>
                )}
                {detailLink && post.mediaType === "video" && (
                    <Link to={detailLink} className="post-card-template-detail-link">
                        Open post
                    </Link>
                )}
            </div>

            {showActions && (
                <>
                    <div className="post-actions">
                    <button
                        type="button"
                        className={`post-action ${liked ? "is-active" : ""}`}
                        onClick={toggleLike}
                        aria-pressed={liked}
                    >
                        <i className={`fa-${liked ? "solid" : "regular"} fa-heart`} aria-hidden="true"></i>
                        <span>Like{likeCount ? ` · ${likeCount}` : ""}</span>
                    </button>
                    <button
                        type="button"
                        className="post-action"
                        onClick={() => setCommentsOpen((open) => !open)}
                        aria-expanded={commentsOpen}
                    >
                        <i className="fa-regular fa-comment" aria-hidden="true"></i>
                        <span>Comment{comments.length ? ` · ${comments.length}` : ""}</span>
                    </button>
                    <button type="button" className="post-action" onClick={sharePost}>
                        <i className="fa-solid fa-share" aria-hidden="true"></i>
                        <span>Share</span>
                    </button>
                    </div>
                    {interactionMessage && (
                        <p
                            className={`post-interaction-message is-${interactionMessageType}`}
                            role="status"
                        >
                            {interactionMessage}
                        </p>
                    )}
                    {shareUrl && (
                        <div className="post-share-copy">
                            <input
                                type="url"
                                aria-label="Post share link"
                                value={shareUrl}
                                readOnly
                                onFocus={(event) => event.target.select()}
                            />
                            {navigator.clipboard?.writeText && (
                                <button type="button" onClick={copyShareUrl}>
                                    Copy link
                                </button>
                            )}
                        </div>
                    )}
                    {commentsOpen && (
                        <section className="post-comments" aria-label="Post comments">
                            <div className="post-comments-list">
                                {comments.length ? comments.map((comment) => (
                                    <article className="post-comment" key={comment._id}>
                                        <strong>
                                            {comment.user?.fullName ||
                                                comment.user?.username ||
                                                "ArtistHood member"}
                                        </strong>
                                        <p>{comment.text}</p>
                                    </article>
                                )) : <p className="post-no-comments">No comments yet.</p>}
                            </div>
                            <form className="post-comment-form" onSubmit={submitComment}>
                                <label className="visually-hidden" htmlFor={`comment-${post._id}`}>
                                    Add a comment
                                </label>
                                <input
                                    id={`comment-${post._id}`}
                                    type="text"
                                    value={commentText}
                                    onChange={(event) => setCommentText(event.target.value)}
                                    maxLength={1000}
                                    placeholder="Write a comment..."
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                >
                                    Post
                                </button>
                            </form>
                        </section>
                    )}
                </>
            )}
        </article>
    );
}
