import React from "react";
import "../styles/pages/Discover.css";

const artists = [
  { name: "Aarav Nair", role: "DJ", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
  { name: "Meher Kapoor", role: "Singer", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
  { name: "Riya Menon", role: "Dancer", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80" },
  { name: "Kabir Shah", role: "Photographer", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
  { name: "Nia Bose", role: "Performer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" },
  { name: "Vikranth Rao", role: "Musician", image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80" },
];

const categories = ["Live music", "Wedding acts", "Event styling", "Creative reels", "Dance gigs", "Brand collabs"];

const randomPosts = [
  {
    id: 1,
    title: "Sunset soundcheck in Goa",
    caption: "A dreamy evening set with cinematic lighting, live percussion, and a packed dance floor.",
    artist: artists[0],
    tags: ["Live music", "Wedding"],
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    likes: 1248,
    comments: 58,
  },
  {
    id: 2,
    title: "Street jazz rehearsal",
    caption: "Quick movement drills before the big festival set. The energy was unreal and the crowd felt it.",
    artist: artists[1],
    tags: ["Dance", "Festival"],
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    likes: 920,
    comments: 41,
  },
  {
    id: 3,
    title: "Behind the scenes: styling board",
    caption: "Moodboards, fabrics, and tiny details that turn an ordinary venue into a memorable experience.",
    artist: artists[2],
    tags: ["Styling", "Brand"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    likes: 1105,
    comments: 37,
  },
  {
    id: 4,
    title: "Studio session with a cinematic feel",
    caption: "Layering vocals and guitars to capture the warm, intimate mood we wanted for the campaign reel.",
    artist: artists[3],
    tags: ["Studio", "Music"],
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    likes: 1403,
    comments: 64,
  },
  {
    id: 5,
    title: "City rooftop performance",
    caption: "One quick set, a crowd of strangers, and a perfect mix of energy and atmosphere.",
    artist: artists[4],
    tags: ["Performance", "City"],
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80",
    likes: 982,
    comments: 32,
  },
  {
    id: 6,
    title: "Brand collaboration teaser",
    caption: "New creative direction for a premium launch campaign, built to feel polished and personal.",
    artist: artists[5],
    tags: ["Collab", "Campaign"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    likes: 1560,
    comments: 71,
  },
];

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const posts = shuffleArray(randomPosts);

export default function Discover() {
  return (
    <div className="discover-page">
      <header className="discover-header">
        <div>
          <p className="discover-kicker">Discover</p>
          <h1>Fresh talent and new inspiration</h1>
        </div>
        <button type="button" className="primary-discover-btn">
          Follow creators
        </button>
      </header>

      <div className="discover-toolbar">
        {shuffleArray(categories).map((category, index) => (
          <button key={`${category}-${index}`} type="button" className="discover-tag">
            {category}
          </button>
        ))}
      </div>

      <div className="discover-layout">
        <main className="discover-feed">
          {posts.map((post) => (
            <article key={post.id} className="discover-post-card">
              <div className="post-author-row">
                <img src={post.artist.image} alt={post.artist.name} className="post-author-image" />
                <div>
                  <h3>{post.artist.name}</h3>
                  <p>{post.artist.role}</p>
                </div>
              </div>

              <div className="post-visual-wrap">
                <img src={post.image} alt={post.title} className="post-visual" />
              </div>

              <div className="post-content-box">
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={`${post.id}-${tag}`}>{tag}</span>
                  ))}
                </div>

                <h2>{post.title}</h2>
                <p>{post.caption}</p>

                <div className="post-meta-row">
                  <span>❤ {post.likes.toLocaleString()}</span>
                  <span>💬 {post.comments}</span>
                  <span>↗ Share</span>
                </div>
              </div>
            </article>
          ))}
        </main>

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
    </div>
  );
}

