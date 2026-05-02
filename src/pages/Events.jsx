import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import BottomNav from "../components/BottomNav";

const TYPE_COLORS = {
  "Hackathon": "#5340C8",
  "Startup Meet": "#1D9E75",
  "Tech Talk": "#E24B4A",
  "Workshop": "#EF9F27",
  "College Fest": "#D4537E",
  "Coding Contest": "#7B6EE0",
  "Internship Drive": "#185FA5",
  "Open Source Sprint": "#993C1D",
  "Bootcamp": "#1D9E75",
  "Networking Event": "#5340C8",
};

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  const [saved, setSaved] = useState([]);
  const [types, setTypes] = useState(["All"]);
  const [domains, setDomains] = useState(["All"]);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(data);

        // Build dynamic filters
        const allTypes = [...new Set(data.map(e => e.type).filter(Boolean))];
        const allDomains = [...new Set(data.map(e => e.domain).filter(Boolean))];
        setTypes(["All", ...allTypes]);
        setDomains(["All", ...allDomains]);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.organiser?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || e.type === typeFilter;
    const matchMode = modeFilter === "All" || e.mode === modeFilter;
    const matchDomain = domainFilter === "All" || e.domain === domainFilter;
    return matchSearch && matchType && matchMode && matchDomain;
  });

  const toggleSave = (id) => setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const getColor = (type) => TYPE_COLORS[type] || "#5340C8";

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return dateStr; }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 7px 16px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-btn:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .filter-btn.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .event-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; transition: all 0.25s; display: flex; flex-direction: column; }
        .event-card:hover { background: rgba(83,64,200,0.08); border-color: rgba(139,124,246,0.35); transform: translateY(-2px); }
        .register-btn { width: 100%; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; margin-top: auto; padding-top: 12px; color: #fff; text-decoration: none; display: block; text-align: center; }
        .register-btn:hover { opacity: 0.85; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
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
          <button onClick={() => navigate("/profile")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>My Profile</button>
          <button onClick={() => navigate("/teammates")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Find Teammates</button>
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
            {loading ? "Loading events..." : `${filtered.length} events found across India — find your next opportunity!`}
          </p>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search events, organisers..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        {/* Filters */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 44 }}>Mode:</span>
              {["All", "Online", "Offline", "Hybrid"].map(m => (
                <button key={m} className={`filter-btn ${modeFilter === m ? "active" : ""}`} onClick={() => setModeFilter(m)}>{m}</button>
              ))}
            </div>
            {types.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 44 }}>Type:</span>
                {types.map(t => (
                  <button key={t} className={`filter-btn ${typeFilter === t ? "active" : ""}`} onClick={() => setTypeFilter(t)}>{t}</button>
                ))}
              </div>
            )}
            {domains.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 44 }}>Domain:</span>
                {domains.map(d => (
                  <button key={d} className={`filter-btn ${domainFilter === d ? "active" : ""}`} onClick={() => setDomainFilter(d)}>{d}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, animation: "pulse 1.5s infinite" }}>
                <div style={{ height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 12, width: "70%" }} />
                <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "60%" }} />
              </div>
            ))}
          </div>
        )}

        {/* No Events Yet */}
        {!loading && events.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎪</div>
            <h2 style={{ fontSize: 20, color: "#fff", marginBottom: 8 }}>No events yet!</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 400, margin: "0 auto 24px" }}>
              Events will appear here once the admin adds them. Check back soon!
            </p>
          </div>
        )}

        {/* No Filter Results */}
        {!loading && events.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>No events found matching your filters</div>
            <button onClick={() => { setSearch(""); setTypeFilter("All"); setModeFilter("All"); setDomainFilter("All"); }} style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, animation: "fadeIn 0.5s ease" }}>
            {filtered.map(event => {
              const color = getColor(event.type);
              const isSaved = saved.includes(event.id);
              return (
                <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)} style={{ cursor: "pointer" }}>

                  {/* Card Top */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {event.type === "Hackathon" ? "🏆" :
                          event.type === "Startup Meet" ? "🚀" :
                            event.type === "Tech Talk" ? "🎤" :
                              event.type === "Workshop" ? "🛠" :
                                event.type === "College Fest" ? "🎓" :
                                  event.type === "Coding Contest" ? "💻" :
                                    event.type === "Internship Drive" ? "💼" : "📋"}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{event.organiser}</div>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 500, background: `${color}22`, color, border: `1px solid ${color}44`, marginTop: 2 }}>{event.type}</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleSave(event.id); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: isSaved ? "#EF9F27" : "rgba(255,255,255,0.2)", transition: "all 0.2s", flexShrink: 0 }}>
                      {isSaved ? "★" : "☆"}
                    </button>
                  </div>

                  {/* Event Name */}
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 12, lineHeight: 1.4 }}>{event.name}</h3>

                  {/* Description */}
                  {event.description && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>
                      {event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
                    </p>
                  )}

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    {[
                      ["📅", "Date", formatDate(event.date)],
                      ["📍", "Venue", event.city],
                      ["💡", "Domain", event.domain],
                      ["🌐", "Mode", event.mode],
                      event.teamSize && ["👥", "Team", event.teamSize],
                      event.registrationDeadline && ["⏰", "Deadline", formatDate(event.registrationDeadline)],
                    ].filter(Boolean).map(([icon, label, val]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", width: 80, flexShrink: 0 }}>{icon} {label}</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  {event.tags && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {event.tags.split(",").map(tag => tag.trim()).filter(Boolean).map(tag => (
                        <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Prize */}
                  {event.prize && (
                    <div style={{ marginTop: "auto", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Prize Pool</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#EF9F27" }}>{event.prize}</span>
                    </div>
                  )}

                  {/* Register Button */}
                  {event.registrationLink ? (
                    <a href={event.registrationLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="register-btn" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
                     Register Now →
                    </a>
                  ) : (
                    <button className="register-btn" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, border: "none" }}>
                      View Details →
                    </button>
                  )}

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