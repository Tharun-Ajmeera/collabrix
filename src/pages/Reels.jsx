import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const REELS = [
  { id: 1, title: "How to win your first hackathon", creator: "Arjun Codes", category: "Hackathon Tips", views: "24K", likes: 1200, duration: "8:42", avatar: "A", color: "#5340C8", desc: "Complete guide to hackathon strategy — from idea to presentation in 24 hours." },
  { id: 2, title: "React hooks explained in 10 mins", creator: "Priya Dev", category: "Web Dev", views: "18K", likes: 980, duration: "10:15", avatar: "P", color: "#1D9E75", desc: "useState, useEffect, useContext — all the hooks you actually need to know." },
  { id: 3, title: "Machine Learning roadmap 2026", creator: "Rahul AI", category: "AI / ML", views: "32K", likes: 2100, duration: "12:30", avatar: "R", color: "#E24B4A", desc: "From Python basics to deploying ML models — the complete 6 month roadmap." },
  { id: 4, title: "DSA patterns for interviews", creator: "Sneha DSA", category: "DSA", views: "41K", likes: 3200, duration: "15:20", avatar: "S", color: "#EF9F27", desc: "The 10 patterns that cover 90% of coding interview questions. With examples." },
  { id: 5, title: "Web3 development from scratch", creator: "Vikram Web3", category: "Web3", views: "15K", likes: 870, duration: "20:10", avatar: "V", color: "#7B6EE0", desc: "Build your first dApp on Ethereum. Solidity + React + MetaMask walkthrough." },
  { id: 6, title: "How to get your first tech job", creator: "Meera Career", category: "Career", views: "55K", likes: 4100, duration: "11:45", avatar: "M", color: "#D4537E", desc: "Resume tips, LinkedIn optimization, cold emailing — everything that actually works." },
  { id: 7, title: "Open source contribution guide", creator: "Dev OSS", category: "Open Source", views: "12K", likes: 760, duration: "9:30", avatar: "D", color: "#185FA5", desc: "How to find good first issues, make PRs and build your GitHub profile." },
  { id: 8, title: "System design basics for students", creator: "Kavya Systems", category: "System Design", views: "28K", likes: 1800, duration: "18:00", avatar: "K", color: "#1D9E75", desc: "Load balancing, caching, databases — explained simply for college students." },
  { id: 9, title: "Flutter app in 1 hour", creator: "Ananya Mobile", category: "Web Dev", views: "19K", likes: 1100, duration: "58:00", avatar: "A", color: "#5340C8", desc: "Build a full todo app with Flutter from scratch. Perfect for beginners." },
];

const CATEGORIES = ["All", "Hackathon Tips", "Web Dev", "AI / ML", "DSA", "Web3", "Career", "Open Source", "System Design"];

export default function Reels() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [liked, setLiked] = useState([]);
  const [playing, setPlaying] = useState(null);

  const filtered = REELS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.creator.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || r.category === category;
    return matchSearch && matchCat;
  });

  const toggleLike = (id) => setLiked(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 6px 14px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-btn:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .filter-btn.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .reel-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; transition: all 0.25s; }
        .reel-card:hover { background: rgba(83,64,200,0.06); border-color: rgba(139,124,246,0.25); transform: translateY(-2px); }
        input::placeholder { color: rgba(255,255,255,0.25); }
        .desktop-nav-btns { display: flex; gap: 12px; }
        @media (max-width: 768px) { .desktop-nav-btns { display: none; } }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,8,12,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
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
          <span style={{ fontSize: 17, fontWeight: 500, color: "#fff", letterSpacing: "-0.4px" }}>Collab<span style={{ color: "#8B7CF6" }}>rix</span> India</span>
        </div>
        <div className="desktop-nav-btns">
          <button onClick={() => navigate("/events")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Events</button>
          <button onClick={() => navigate("/profile")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>My Profile</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Header */}
        <div style={{ paddingTop: 40, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Learn</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>Knowledge Reels</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>Pure tech knowledge — no entertainment, no distraction. Only growth. 🚀</p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
          {[["9", "Reels"], ["6", "Creators"], ["148K+", "Total Views"], ["100%", "Knowledge"]].map(([val, label]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search reels, creators or topics..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`filter-btn ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>

        {/* Reels Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>No reels found</div>
            <button onClick={() => { setSearch(""); setCategory("All"); }} style={{ marginTop: 16, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map(reel => {
              const isLiked = liked.includes(reel.id);
              const isPlaying = playing === reel.id;
              return (
                <div key={reel.id} className="reel-card">
                  {/* Thumbnail */}
                  <div style={{ height: 160, background: `linear-gradient(135deg, ${reel.color}33, ${reel.color}11)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}
                    onClick={() => setPlaying(isPlaying ? null : reel.id)}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: isPlaying ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 20 }}>{isPlaying ? "⏸" : "▶"}</div>
                    </div>
                    <div style={{ position: "absolute", top: 12, left: 12, background: `${reel.color}33`, border: `1px solid ${reel.color}55`, color: reel.color, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                      {reel.category}
                    </div>
                    <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>
                      {reel.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>{reel.title}</h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>{reel.desc}</p>

                    {/* Creator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${reel.color}, ${reel.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>
                        {reel.avatar}
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{reel.creator}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 16 }}>
                        <button onClick={() => toggleLike(reel.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: isLiked ? "#E24B4A" : "rgba(255,255,255,0.4)", fontSize: 12, transition: "color 0.2s" }}>
                          {isLiked ? "❤️" : "🤍"} {isLiked ? reel.likes + 1 : reel.likes}
                        </button>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 4 }}>
                          👁 {reel.views}
                        </span>
                      </div>
                      <button style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "6px 14px", borderRadius: 999, fontSize: 12, cursor: "pointer" }}>
                        Watch →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}