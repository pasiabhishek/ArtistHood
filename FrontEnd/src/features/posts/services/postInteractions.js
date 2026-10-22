const STORAGE_KEY = "artisthood_post_interactions";

function readInteractions() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Saved post interactions are invalid.");
    }
    return parsed;
}

function saveInteractions(interactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
}

export function getLocalPostInteractions(post, userId, followKey) {
    const interactions = readInteractions();
    const postId = String(post._id);
    const userKey = String(userId || "guest");
    const serverLiked = (post.likes || []).some(
        (like) => String(like?._id || like) === userKey
    );
    const localLiked = interactions.likes?.[postId]?.[userKey];
    const liked = typeof localLiked === "boolean" ? localLiked : serverLiked;
    const likeCount = Math.max(
        0,
        (post.likes || []).length +
            (liked === serverLiked ? 0 : liked ? 1 : -1)
    );

    const localFollowing = interactions.follows?.[String(followKey || "")]?.[userKey];

    return {
        liked,
        likeCount,
        following:
            typeof localFollowing === "boolean"
                ? localFollowing
                : Boolean(post.isFollowing),
        comments: [...(post.comments || []), ...(interactions.comments?.[postId] || [])],
    };
}

export function toggleLocalPostLike(post, userId) {
    const interactions = readInteractions();
    const postId = String(post._id);
    const userKey = String(userId || "guest");
    const serverLiked = (post.likes || []).some(
        (like) => String(like?._id || like) === userKey
    );
    const likesForPost = interactions.likes?.[postId] || {};
    const currentLiked =
        typeof likesForPost[userKey] === "boolean"
            ? likesForPost[userKey]
            : serverLiked;
    const liked = !currentLiked;

    interactions.likes = {
        ...interactions.likes,
        [postId]: { ...likesForPost, [userKey]: liked },
    };
    saveInteractions(interactions);

    return {
        liked,
        likeCount: Math.max(
            0,
            (post.likes || []).length +
                (liked === serverLiked ? 0 : liked ? 1 : -1)
        ),
    };
}

export function toggleLocalArtistFollow(username, userId, currentFollowing) {
    const interactions = readInteractions();
    const userKey = String(userId || "guest");
    const following = !currentFollowing;
    const followsForArtist = interactions.follows?.[username] || {};

    interactions.follows = {
        ...interactions.follows,
        [username]: { ...followsForArtist, [userKey]: following },
    };
    saveInteractions(interactions);

    return following;
}

export function addLocalPostComment(postId, user, text) {
    const interactions = readInteractions();
    const commentsForPost = interactions.comments?.[String(postId)] || [];
    const comment = {
        _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        createdAt: new Date().toISOString(),
        user: {
            username: user?.username || "You",
            fullName: user?.fullName || user?.username || "You",
        },
    };

    interactions.comments = {
        ...interactions.comments,
        [String(postId)]: [...commentsForPost, comment],
    };
    saveInteractions(interactions);

    return comment;
}
