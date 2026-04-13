import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EVENTS = [
  {
    id: 1,
    name: "Smart India Hackathon 2026",
    org: "Government of India",
    domain: "Open Innovation",
    date: "June 15, 2026",
    location: "Pan India",
    prize: "₹1,00,000",
    mode: "Offline",
    tag: "Hackathon",
    color: "#5340C8",
  },
  {
    id: 2,
    name: "HackWithInfy 2026",
    org: "Infosys",
    domain: "AI / ML",
    date: "July 10, 2026",
    location: "Bangalore",
    prize: "₹50,000",
    mode: "Hybrid",
    tag: "Hackathon",
    color: "#1D9E75",
  },
  {
    id: 3,
    name: "Google Solution Challenge",
    org: "Google",
    domain: "Social Impact",
    date: "Aug 5, 2026",
    location: "Online",
    prize: "Global Recognition",
    mode: "Online",
    tag: "Challenge",
    color: "#E24B4A",
  },
  {
    id: 4,
    name: "Flipkart GRiD 6.0",
    org: "Flipkart",
    domain: "E-Commerce Tech",
    date: "Aug 20, 2026",
    location: "Online",
    prize: "₹75,000",
    mode: "Online",
    tag: "Challenge",
    color: "#EF9F27",
  },
  {
    id: 5,
    name: "HackCBS 9.0",
    org: "Shaheed Sukhdev College",
    domain: "Open Theme",
    date: "Sep 12, 2026",
    location: "Delhi",
    prize: "₹30,000",
    mode: "Offline",
    tag: "Hackathon",
    color: "#5340C8",
  },
  {
    id: 6,
    name: "ETHIndia 2026",
    org: "Devfolio",
    domain: "Web3 / Blockchain",
    date: "Oct 1, 2026",
    location: "Bangalore",
    prize: "$50,000",
    mode: "Offline",
    tag: "Hackathon",
    color: "#7B6EE0",
  },
  {
    id: 7,
    name: "CodeChef SnackDown",
    org: "CodeChef",
    domain: "Competitive Coding",
    date: "Oct 15, 2026",
    location: "Online",
    prize: "₹5,00,000",
    mode: "Online",
    tag: "Contest",
    color: "#1D9E75",
  },
  {
    id: 8,
    name: "Microsoft Imagine Cup",
    org: "Microsoft",
    domain: "AI / Tech for Good",
    date: "Nov 3, 2026",
    location: "Online",
    prize: "$100,000",
    mode: "Online",
    tag: "Challenge",
    color: "#185FA5",
  },
  {
    id: 9,
    name: "Myntra HackerRamp",
    org: "Myntra",
    domain: "Fashion Tech",
    date: "Nov 20, 2026",
    location: "Bangalore",
    prize: "₹40,000",
    mode: "Hybrid",
    tag: "Hackathon",
    color: "#D4537E",
  },
];

const DOMAINS = ["All", "AI / ML", "Web3 / Blockchain", "Open Innovation", "Social Impact", "Competitive Coding", "E-Commerce Tech", "Fashion Tech"];
const MODES = ["All", "Online", "Offline", "Hybrid"];
const TAGS = ["All", "Hackathon", "Challenge", "Contest"];

export default function Events() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All");
  const [mode, setMode] = useState("All");
  const [tag, setTag] = useState("All");
  const [saved, setSaved] = useState([]);

  const filtered = EVENTS.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.org.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domain === "All" || e.domain === domain;
    const matchMode = mode === "All" || e.mode === mode;
    const matchTag = tag === "All" || e.tag === tag;
    return matchSearch && matchDomain && matchMode && matchTag;
  });

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 7px 16px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-btn:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .filter-btn.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .event-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; transition: all 0.25s; cursor: pointer; }
        .event-card:hover { background: rgba(83,64,200,0.08); border-color: rgba(139,124,246,0.35); transform: translateY(-2px); }
        .tag-pill { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 500; }
        .register-btn { width: 100%; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; margin-top: 16px; color: #fff; }
        .register-btn:hover { opacity: 0.85; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a2e; color: #fff; }
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
          <button onClick={() => navigate("/profile")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
            My Profile
          </button>
          <button style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
            Find Teammates
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Header */}
        <div style={{ paddingTop: 40, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Discover</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>
            Hackathons & Events
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
            {filtered.length} events found across India — find your next competition!
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
            placeholder="Search events or organisations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginRight: 4 }}>Mode:</span>
            {MODES.map(m => (
              <button key={m} className={`filter-btn ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>{m}</button>
            ))}
          </div>
          <div style={{ width: "100%", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginRight: 4 }}>Type:</span>
            {TAGS.map(t => (
              <button key={t} className={`filter-btn ${tag === t ? "active" : ""}`} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
          <div style={{ width: "100%", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginRight: 4 }}>Domain:</span>
            {DOMAINS.map(d => (
              <button key={d} className={`filter-btn ${domain === d ? "active" : ""}`} onClick={() => setDomain(d)}>{d}</button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>No events found matching your filters</div>
            <button onClick={() => { setSearch(""); setDomain("All"); setMode("All"); setTag("All"); }} style={{ marginTop: 16, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.map(event => (
              <div key={event.id} className="event-card">

                {/* Card Top */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${event.color}22`, border: `1px solid ${event.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      🏆
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{event.org}</div>
                      <span className="tag-pill" style={{ background: `${event.color}22`, color: event.color, border: `1px solid ${event.color}44`, marginTop: 2 }}>{event.tag}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSave(event.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: saved.includes(event.id) ? "#EF9F27" : "rgba(255,255,255,0.2)", transition: "all 0.2s" }}
                  >
                    {saved.includes(event.id) ? "★" : "☆"}
                  </button>
                </div>

                {/* Event Name */}
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 12, lineHeight: 1.4 }}>{event.name}</h3>

                {/* Event Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", width: 60 }}>📅 Date</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{event.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", width: 60 }}>📍 Venue</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{event.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", width: 60 }}>💡 Domain</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{event.domain}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", width: 60 }}>🌐 Mode</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{event.mode}</span>
                  </div>
                </div>

                {/* Prize */}
                <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Prize Pool</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#EF9F27" }}>{event.prize}</span>
                </div>

                {/* Register Button */}
                <button
                  className="register-btn"
                  style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}CC)` }}
                >
                  Register Now →
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}