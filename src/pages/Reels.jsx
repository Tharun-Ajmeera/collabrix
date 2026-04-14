import { useState } from "react";
import { useNavigate } from "react-router-dom";

const REELS = [
  {
    id: 1,
    title: "How to crack Smart India Hackathon in 7 days",
    creator: "Rahul Kumar",
    handle: "@rahulbuilds",
    avatar: "R",
    avatarColor: "#5340C8",
    category: "Hackathon Tips",
    views: "24.5K",
    likes: "1.2K",
    duration: "4:32",
    timeAgo: "2 hours ago",
    verified: true,
    followed: false,
    liked: false,
    saved: false,
    tags: ["SIH", "Hackathon", "Tips"],
  },
  {
    id: 2,
    title: "React hooks every developer must know in 2026",
    creator: "Priya Sharma",
    handle: "@priyacodes",
    avatar: "P",
    avatarColor: "#1D9E75",
    category: "Web Dev",
    views: "18.3K",
    likes: "956",
    duration: "6:15",
    timeAgo: "5 hours ago",
    verified: true,
    followed: false,
    liked: false,
    saved: false,
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: 3,
    title: "How I built an AI app and won ₹1 lakh at hackathon",
    creator: "Vikram Nair",
    handle: "@vikramtech",
    avatar: "V",
    avatarColor: "#EF9F27",
    category: "AI / ML",
    views: "31.2K",
    likes: "2.1K",
    duration: "8:44",
    timeAgo: "1 day ago",
    verified: true,
    followed: false,
    liked: false,
    saved: false,
    tags: ["AI", "Hackathon", "Python"],
  },
  {
    id: 4,
    title: "DSA roadmap for complete beginners — 2026 edition",
    creator: "Ananya Singh",
    handle: "@ananyacodes",
    avatar: "A",
    avatarColor: "#D4537E",
    category: "DSA",
    views: "45.8K",
    likes: "3.4K",
    duration: "12:20",
    timeAgo: "2 days ago",
    verified: false,
    followed: false,
    liked: false,
    saved: false,
    tags: ["DSA", "Coding", "Beginners"],
  },
  {
    id: 5,
    title: "Web3 and Blockchain explained in 5 minutes",
    creator: "Arjun Mehta",
    handle: "@arjunweb3",
    avatar: "A",
    avatarColor: "#7B6EE0",
    category: "Web3",
    views: "12.6K",
    likes: "780",
    duration: "5:10",
    timeAgo: "3 days ago",
    verified: true,
    followed: false,
    liked: false,
    saved: false,
    tags: ["Web3", "Blockchain", "Crypto"],
  },
  {
    id: 6,
    title: "How to build your student portfolio that gets you hired",
    creator: "Sneha Reddy",
    handle: "@snehadesigns",
    avatar: "S",
    avatarColor: "#185FA5",
    category: "Career",
    views: "28.9K",
    likes: "1.8K",
    duration: "7:55",
    timeAgo: "4 days ago",
    verified: true,
    followed: false,
    liked: false,
    saved: false,
    tags: ["Portfolio", "Career", "Students"],
  },
  {
    id: 7,
    title: "Top 5 open source projects to contribute to in 2026",
    creator: "Dev Patel",
    handle: "@devbuilds",
    avatar: "D",
    avatarColor: "#993C1D",
    category: "Open Source",
    views: "9.4K",
    likes: "620",
    duration: "6:30",
    timeAgo: "5 days ago",
    verified: false,
    followed: false,
    liked: false,
    saved: false,
    tags: ["OpenSource", "GitHub", "Coding"],
  },
  {
    id: 8,
    title: "System design basics every student must know",
    creator: "Kavya Iyer",
    handle: "@kavyatech",
    avatar: "K",
    avatarColor: "#1D9E75",
    category: "System Design",
    views: "22.1K",
    likes: "1.5K",
    duration: "9:18",
    timeAgo: "1 week ago",
    verified: true,
    followed: false,
    liked: false,
    saved: false,
    tags: ["SystemDesign", "Interview", "Tech"],
  },
  {
    id: 9,
    title: "How to find the perfect hackathon team using Collabrix India",
    creator: "Meera Pillai",
    handle: "@meerabuilds",
    avatar: "M",
    avatarColor: "#5340C8",
    category: "Hackathon Tips",
    views: "6.2K",
    likes: "445",
    duration: "3:45",
    timeAgo: "1 week ago",
    verified: false,
    followed: false,
    liked: false,
    saved: false,
    tags: ["Hackathon", "Team", "CollabrixIndia"],
  },
];

const CATEGORIES = ["All", "Hackathon Tips", "Web Dev", "AI / ML", "DSA", "Web3", "Career", "Open Source", "System Design"];

export default function Reels() {
  const navigate = useNavigate();
  const [reels, setReels] = useState(REELS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = reels.filter(r => {
    const matchCategory = activeCategory === "All" || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.creator.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const toggleLike = (id) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, liked: !r.liked } : r));
  };

  const toggleSave = (id) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
  };

  const toggleFollow = (id) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, followed: !r.followed } : r));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 7px 16px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .cat-btn:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .cat-btn.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .reel-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; transition: all 0.25s; }
        .reel-card:hover { background: rgba(83,64,200,0.07); border-color: rgba(139,124,246,0.25); transform: translateY(-2px); }
        .action-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 12px; padding: 6px 10px; border-radius: 8px; transition: all 0.2s; }
        .action-btn:hover { background: rgba(255,255,255,0.06); }
        .tag { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 500; margin: 2px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,8,12,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 500, color: "#fff", letterSpacing: "-0.4px" }}>
            Collab<span style={{ color: "#8B7CF6" }}>rix</span> India
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/events")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Events</button>
          <button onClick={() => navigate("/teammates")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Find Teammates</button>
          <button onClick={() => navigate("/profile")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>My Profile</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Header */}
        <div style={{ paddingTop: 40, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Learn</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>
            Knowledge Reels
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
            Pure tech knowledge — no entertainment, no distraction. Only growth. 🚀
          </p>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "12px 16px", marginBottom: 20,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search reels, creators or topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, padding: "14px 20px", background: "rgba(83,64,200,0.08)", border: "1px solid rgba(139,124,246,0.15)", borderRadius: 12 }}>
          {[["9", "Reels"], ["6", "Creators"], ["148K+", "Total Views"], ["100%", "Knowledge"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Reels Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎬</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>No reels found</div>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }}
              style={{ marginTop: 16, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.map(reel => (
              <div key={reel.id} className="reel-card">

                {/* Thumbnail */}
                <div style={{
                  height: 160, background: `linear-gradient(135deg, ${reel.avatarColor}33, rgba(8,8,12,0.8))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, border: "2px solid rgba(255,255,255,0.3)",
                  }}>▶</div>
                  <div style={{ position: "absolute", top: 10, left: 12 }}>
                    <span style={{ background: `${reel.avatarColor}33`, border: `1px solid ${reel.avatarColor}55`, color: reel.avatarColor, fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 999 }}>
                      {reel.category}
                    </span>
                  </div>
                  <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.8)", fontSize: 11, padding: "2px 8px", borderRadius: 6 }}>
                    {reel.duration}
                  </div>
                  <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    {reel.views} views
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px" }}>

                  {/* Creator */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${reel.avatarColor}, ${reel.avatarColor}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                        {reel.avatar}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>{reel.creator}</span>
                          {reel.verified && <span style={{ color: "#8B7CF6", fontSize: 12 }}>✓</span>}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{reel.handle} • {reel.timeAgo}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollow(reel.id)}
                      style={{
                        fontSize: 11, fontWeight: 500, padding: "5px 12px", borderRadius: 999, cursor: "pointer", transition: "all 0.2s",
                        background: reel.followed ? "rgba(255,255,255,0.05)" : "rgba(83,64,200,0.2)",
                        border: reel.followed ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(139,124,246,0.4)",
                        color: reel.followed ? "rgba(255,255,255,0.4)" : "#A899F0",
                      }}
                    >{reel.followed ? "Following" : "Follow"}</button>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 14, fontWeight: 500, color: "#fff", lineHeight: 1.5, marginBottom: 10 }}>
                    {reel.title}
                  </h3>

                  {/* Tags */}
                  <div style={{ marginBottom: 12 }}>
                    {reel.tags.map(t => <span key={t} className="tag">#{t}</span>)}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                    <button className="action-btn" onClick={() => toggleLike(reel.id)} style={{ color: reel.liked ? "#E24B4A" : "rgba(255,255,255,0.4)" }}>
                      <span>{reel.liked ? "♥" : "♡"}</span>
                      <span>{reel.likes}</span>
                    </button>
                    <button className="action-btn" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>💬</span>
                      <span style={{ fontSize: 12 }}>Comment</span>
                    </button>
                    <button className="action-btn" onClick={() => toggleSave(reel.id)} style={{ color: reel.saved ? "#EF9F27" : "rgba(255,255,255,0.4)", marginLeft: "auto" }}>
                      <span>{reel.saved ? "★" : "☆"}</span>
                      <span>{reel.saved ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload CTA */}
        <div style={{ marginTop: 48, padding: "28px", borderRadius: 16, background: "rgba(83,64,200,0.08)", border: "1px solid rgba(139,124,246,0.2)", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🎬</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Share your knowledge</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
            Are you a tech creator? Share your knowledge with thousands of Indian students!
          </p>
          <button style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Upload a reel →
          </button>
        </div>

      </div>
    </div>
  );
}