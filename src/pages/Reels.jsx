import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const REELS = [
  { id: 1, title: "How to win your first hackathon 🏆", creator: "Arjun Codes", handle: "@arjuncodes", category: "Hackathon Tips", views: "24K", likes: 2100, duration: "8:42", avatar: "A", color: "#5340C8", desc: "Complete guide to hackathon strategy — from idea to presentation in 24 hours. Learn how top teams think!", thumbnail: "🏆" },
  { id: 2, title: "React hooks explained in 10 mins ⚛️", creator: "Priya Dev", handle: "@priyadev", category: "Web Dev", views: "18K", likes: 980, duration: "10:15", avatar: "P", color: "#1D9E75", desc: "useState, useEffect, useContext — all the hooks you actually need. With real examples!", thumbnail: "⚛️" },
  { id: 3, title: "Machine Learning roadmap 2026 🤖", creator: "Rahul AI", handle: "@rahulai", category: "AI / ML", views: "32K", likes: 3200, duration: "12:30", avatar: "R", color: "#E24B4A", desc: "From Python basics to deploying ML models — the complete 6 month roadmap for students.", thumbnail: "🤖" },
  { id: 4, title: "DSA patterns every coder must know 💻", creator: "Sneha DSA", handle: "@snehadsa", category: "DSA", views: "41K", likes: 4100, duration: "15:20", avatar: "S", color: "#EF9F27", desc: "The 10 patterns that cover 90% of coding interview questions. Sliding window, two pointers and more!", thumbnail: "💻" },
  { id: 5, title: "Web3 development from scratch 🌐", creator: "Vikram Web3", handle: "@vikramweb3", category: "Web3", views: "15K", likes: 870, duration: "20:10", avatar: "V", color: "#7B6EE0", desc: "Build your first dApp on Ethereum. Solidity + React + MetaMask complete walkthrough.", thumbnail: "🌐" },
  { id: 6, title: "Get your first tech job in 90 days 💼", creator: "Meera Career", handle: "@meeracareer", category: "Career", views: "55K", likes: 5200, duration: "11:45", avatar: "M", color: "#D4537E", desc: "Resume tips, LinkedIn hacks, cold emailing templates — everything that actually works for freshers.", thumbnail: "💼" },
  { id: 7, title: "Open source contribution guide 🌟", creator: "Dev OSS", handle: "@devoss", category: "Open Source", views: "12K", likes: 760, duration: "9:30", avatar: "D", color: "#185FA5", desc: "How to find good first issues, make your first PR and build a strong GitHub profile.", thumbnail: "🌟" },
  { id: 8, title: "System design for college students 📐", creator: "Kavya Systems", handle: "@kavyasystems", category: "System Design", views: "28K", likes: 1800, duration: "18:00", avatar: "K", color: "#1D9E75", desc: "Load balancing, caching, databases — explained simply. Nail your system design interviews!", thumbnail: "📐" },
  { id: 9, title: "Flutter app in 60 minutes 📱", creator: "Ananya Mobile", handle: "@ananyamobile", category: "Web Dev", views: "19K", likes: 1100, duration: "58:00", avatar: "A", color: "#5340C8", desc: "Build a complete todo app with Flutter from scratch. Cross-platform mobile development made easy!", thumbnail: "📱" },
];

const CATEGORIES = ["All", "Hackathon Tips", "Web Dev", "AI / ML", "DSA", "Web3", "Career", "Open Source", "System Design"];

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function Reels() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [energised, setEnergised] = useState([]);
  const [saved, setSaved] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [animDir, setAnimDir] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [pop, setPop] = useState(false);
  const searchRef = useRef(null);

  const reelList = isSearchMode
    ? REELS.filter(r => {
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.creator.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === "All" || r.category === category;
        return matchSearch && matchCat;
      })
    : REELS;

  const reel = reelList[currentIndex] || reelList[0];

  const goTo = (dir) => {
    if (animating) return;
    const next = currentIndex + dir;
    if (next < 0 || next >= reelList.length) return;
    setAnimDir(dir > 0 ? "up" : "down");
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(next);
      setAnimating(false);
      setAnimDir(null);
    }, 280);
  };

  // Touch swipe
  const onTouchStart = e => setTouchStart(e.targetTouches[0].clientY);
  const onTouchMove = e => setTouchEnd(e.targetTouches[0].clientY);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? 1 : -1);
    setTouchStart(null); setTouchEnd(null);
  };

  // Keyboard
  useEffect(() => {
    const fn = e => {
      if (e.key === "ArrowDown") goTo(1);
      if (e.key === "ArrowUp") goTo(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [currentIndex, animating]);

  const toggleEnergise = (id) => {
    setPop(true);
    setTimeout(() => setPop(false), 400);
    setEnergised(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const applyCategory = (cat) => {
    setCategory(cat);
    setCurrentIndex(0);
    setIsSearchMode(cat !== "All" || search !== "");
  };

  const applySearch = (val) => {
    setSearch(val);
    setCurrentIndex(0);
    setIsSearchMode(val !== "" || category !== "All");
  };

  const clearAll = () => {
    setSearch(""); setCategory("All");
    setIsSearchMode(false); setCurrentIndex(0);
    setShowSearch(false);
  };

  if (!reel) return (
    <div style={{ height: "100vh", background: "#08080C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <div style={{ fontSize: 16, color: "#fff" }}>No reels found</div>
      <button onClick={clearAll} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>Clear filters</button>
      <BottomNav />
    </div>
  );

  const isEnergised = energised.includes(reel.id);
  const isSaved = saved.includes(reel.id);

  return (
    <div style={{ height: "100vh", background: "#08080C", overflow: "hidden", position: "relative", fontFamily: "'Inter', sans-serif" }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp { from{opacity:0;transform:translateY(70px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-70px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.5)} 100%{transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .reel-bg { animation: ${animDir === "up" ? "slideUp" : animDir === "down" ? "slideDown" : "fadeIn"} 0.28s ease; }
        .bolt-pop { animation: pop 0.35s ease; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        ::-webkit-scrollbar { display: none; }
        .pill-btn { display: flex; align-items: center; gap: 6px; border-radius: 20px; padding: 7px 14px; cursor: pointer; border: none; transition: all 0.2s; }
        .pill-btn:active { transform: scale(0.94); }
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
      `}</style>

      {/* BG */}
      <div className="reel-bg" style={{ position: "absolute", inset: 0, background: `linear-gradient(150deg, ${reel.color}55 0%, #08080C 45%, #0a0a14 100%)` }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 140, opacity: 0.12, userSelect: "none" }}>{reel.thumbnail}</div>
      </div>

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 28%, transparent 52%, rgba(0,0,0,0.9) 100%)", pointerEvents: "none" }} />

      {/* ───── TOP BAR ───── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, padding: "14px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("/")}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 46 46" fill="none">
                <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
                <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
                <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
                <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>Reels</span>
          </div>

          {/* Search input */}
          {showSearch && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "7px 14px", border: "1px solid rgba(255,255,255,0.25)" }}>
              <input ref={searchRef} autoFocus type="text" placeholder="Search reels, creators..." value={search} onChange={e => applySearch(e.target.value)}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13 }} />
              {search && <span onClick={() => applySearch("")} style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 16 }}>×</span>}
            </div>
          )}

          {!showSearch && <div style={{ flex: 1 }} />}

          {/* Counter */}
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: 999, backdropFilter: "blur(8px)" }}>
            {currentIndex + 1} / {reelList.length}
          </div>

          {/* Search toggle */}
          <button onClick={() => { setShowSearch(!showSearch); if (showSearch) clearAll(); }}
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, color: "#fff" }}>
            {showSearch ? "✕" : "🔍"}
          </button>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => applyCategory(cat)} style={{
              padding: "5px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: category === cat ? "#fff" : "rgba(255,255,255,0.12)",
              color: category === cat ? "#08080C" : "rgba(255,255,255,0.8)",
              border: "none", cursor: "pointer", whiteSpace: "nowrap",
              backdropFilter: "blur(10px)", transition: "all 0.2s", flexShrink: 0,
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ───── SEARCH RESULTS ───── */}
      {isSearchMode && (
        <div style={{ position: "absolute", top: 108, left: 0, right: 0, bottom: 80, zIndex: 15, overflowY: "auto", padding: "8px 16px" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
            {reelList.length} reels found
            <span onClick={clearAll} style={{ marginLeft: 10, color: "#8B7CF6", cursor: "pointer", textDecoration: "underline" }}>Clear</span>
          </div>
          {reelList.map((r, idx) => (
            <div key={r.id} onClick={() => { setCurrentIndex(idx); setIsSearchMode(false); setShowSearch(false); }}
              style={{ display: "flex", gap: 12, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 12, marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              <div style={{ width: 80, height: 64, borderRadius: 10, background: `linear-gradient(135deg,${r.color}44,${r.color}22)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{r.thumbnail}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 3, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>{r.creator} • {r.views} views</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: `${r.color}33`, color: r.color, border: `1px solid ${r.color}44` }}>{r.category}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{r.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ───── FULL SCREEN VIEW ───── */}
      {!isSearchMode && (
        <>
          {/* Progress dots */}
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 5, zIndex: 10 }}>
            {reelList.map((_, i) => (
              <div key={i} onClick={() => setCurrentIndex(i)} style={{ width: 3, height: i === currentIndex ? 22 : 7, borderRadius: 2, background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.25)", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>

          {/* ───── RIGHT SIDE ACTIONS ───── */}
          <div style={{ position: "absolute", right: 16, bottom: 110, display: "flex", flexDirection: "column", gap: 12, zIndex: 10, alignItems: "flex-end" }}>

            {/* ⚡ ENERGISE — dark circle style like screenshot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <button
                onClick={() => toggleEnergise(reel.id)}
                className={pop && !isEnergised ? "bolt-pop" : ""}
                style={{
                  width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: isEnergised ? "rgba(239,159,39,0.25)" : "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(10px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, transition: "all 0.2s",
                  boxShadow: isEnergised ? "0 0 16px rgba(239,159,39,0.4)" : "none",
                }}
              >⚡</button>
              <span style={{ fontSize: 12, fontWeight: 700, color: isEnergised ? "#EF9F27" : "#fff" }}>
                {formatCount(isEnergised ? reel.likes + 1 : reel.likes)}
              </span>
            </div>

            {/* 💬 DISCUSS — glass pill */}
            <button className="pill-btn" style={{ background: "rgba(139,124,246,0.2)", border: "1px solid rgba(139,124,246,0.5)", backdropFilter: "blur(10px)" }}>
              <span style={{ fontSize: 18 }}>💬</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#A899F0" }}>Discuss</span>
            </button>

            {/* 🔖 SAVE — glass pill */}
            <button className="pill-btn" onClick={() => setSaved(prev => prev.includes(reel.id) ? prev.filter(s => s !== reel.id) : [...prev, reel.id])}
              style={{ background: isSaved ? "rgba(29,158,117,0.3)" : "rgba(29,158,117,0.15)", border: `1px solid ${isSaved ? "rgba(29,158,117,0.7)" : "rgba(29,158,117,0.4)"}`, backdropFilter: "blur(10px)" }}>
              <span style={{ fontSize: 18 }}>{isSaved ? "🔖" : "🏷️"}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#5DCAA5" }}>{isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* 📤 SHARE — glass pill */}
            <button className="pill-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(10px)" }}>
              <span style={{ fontSize: 18 }}>📤</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Share</span>
            </button>

          </div>

          {/* ───── BOTTOM INFO ───── */}
          <div style={{ position: "absolute", bottom: 80, left: 0, right: 90, padding: "0 20px", zIndex: 10 }}>

            {/* Creator row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${reel.color},${reel.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
                {reel.avatar}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{reel.creator}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{reel.handle}</div>
              </div>
              <div style={{ marginLeft: 8, background: "rgba(0,0,0,0.45)", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {reel.duration}
              </div>
            </div>

            {/* Category */}
            <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: `${reel.color}44`, color: reel.color, border: `1px solid ${reel.color}66`, marginBottom: 8, backdropFilter: "blur(10px)" }}>
              {reel.category}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              {reel.title}
            </h2>

            {/* Description */}
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {reel.desc}
            </p>

            {/* Views */}
            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              👁 {reel.views} views
            </div>
          </div>

          {/* Desktop nav arrows */}
          <button className="desktop-only" onClick={() => goTo(-1)} disabled={currentIndex === 0}
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 116, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: currentIndex === 0 ? 0.2 : 0.7, zIndex: 10, color: "#fff", fontSize: 16, backdropFilter: "blur(10px)" }}>↑</button>

          <button className="desktop-only" onClick={() => goTo(1)} disabled={currentIndex >= reelList.length - 1}
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 88, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: currentIndex >= reelList.length - 1 ? 0.2 : 0.7, zIndex: 10, color: "#fff", fontSize: 16, backdropFilter: "blur(10px)" }}>↓</button>

          {/* Swipe hint */}
          {currentIndex < reelList.length - 1 && (
            <div style={{ position: "absolute", bottom: 88, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "rgba(255,255,255,0.25)", zIndex: 10, whiteSpace: "nowrap" }}>
              ↕ swipe for next reel
            </div>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}
