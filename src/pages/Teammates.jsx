import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import BottomNav from "../components/BottomNav";

export default function Teammates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All");
  const [city, setCity] = useState("All");
  const [connected, setConnected] = useState([]);
  const [domains, setDomains] = useState(["All"]);
  const [cities, setCities] = useState(["All"]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(s => s.name && s.skills?.length > 0);
        setStudents(data);
        const allDomains = [...new Set(data.map(s => s.domain).filter(Boolean))];
        const allCities = [...new Set(data.map(s => s.city).filter(Boolean))];
        setDomains(["All", ...allDomains]);
        setCities(["All", ...allCities]);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.college?.toLowerCase().includes(search.toLowerCase()) ||
      s.skills?.some(sk => sk.toLowerCase().includes(search.toLowerCase()));
    const matchDomain = domain === "All" || s.domain === domain;
    const matchCity = city === "All" || s.city === city;
    const notSelf = s.id !== user?.uid;
    return matchSearch && matchDomain && matchCity && notSelf;
  });

  const toggleConnect = (id) => {
    if (!user) { navigate("/login"); return; }
    setConnected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleMessage = (studentId) => {
    if (!user) { navigate("/login"); return; }
    navigate(`/chat/${studentId}`);
  };

  const getAvatarColor = (name) => {
    const colors = ["#5340C8", "#1D9E75", "#D4537E", "#EF9F27", "#185FA5", "#993C1D", "#7B6EE0"];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 6px 14px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-btn:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .filter-btn.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .student-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; transition: all 0.25s; }
        .student-card:hover { background: rgba(83,64,200,0.06); border-color: rgba(139,124,246,0.25); transform: translateY(-2px); }
        .skill-tag { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 500; margin: 3px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
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
          <button onClick={() => navigate("/inbox")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>💬 Messages</button>
          <button onClick={() => navigate("/profile")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>My Profile</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Header */}
        <div style={{ paddingTop: 40, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Connect</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>Find Teammates</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
            {loading ? "Loading students..." : `${filtered.length} students found — connect for your next hackathon!`}
          </p>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search by name, college or skill..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        {/* Filters */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {domains.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 50 }}>Domain:</span>
                {domains.map(d => <button key={d} className={`filter-btn ${domain === d ? "active" : ""}`} onClick={() => setDomain(d)}>{d}</button>)}
              </div>
            )}
            {cities.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 50 }}>City:</span>
                {cities.map(c => <button key={c} className={`filter-btn ${city === c ? "active" : ""}`} onClick={() => setCity(c)}>{c}</button>)}
              </div>
            )}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22, animation: "pulse 1.5s infinite" }}>
                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8, width: "60%" }} />
                    <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "40%" }} />
                  </div>
                </div>
                <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "80%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <h2 style={{ fontSize: 20, color: "#fff", marginBottom: 8 }}>Be the first student!</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              No students yet. Complete your profile and be the first to show up here!
            </p>
            <button onClick={() => navigate(user ? "/profile" : "/login")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              {user ? "Complete My Profile →" : "Login & Create Profile →"}
            </button>
          </div>
        )}

        {/* No Filter Results */}
        {!loading && students.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>No students found matching your filters</div>
            <button onClick={() => { setSearch(""); setDomain("All"); setCity("All"); }} style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Students Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, animation: "fadeIn 0.5s ease" }}>
            {filtered.map(student => {
              const color = getAvatarColor(student.name);
              const isConnected = connected.includes(student.id);
              return (
                <div key={student.id} className="student-card">

                  {/* Card Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                    {student.photoURL ? (
                      <img src={student.photoURL} alt={student.name} style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${color}44`, flexShrink: 0, cursor: "pointer" }} onClick={() => navigate(`/chat/${student.id}`)} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: "#fff", border: `2px solid ${color}44`, flexShrink: 0, cursor: "pointer" }} onClick={() => navigate(`/chat/${student.id}`)}>
                        {student.name?.charAt(0)}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{student.name}</div>
                      {student.college && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{student.college}</div>}
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{[student.year, student.city].filter(Boolean).join(" • ")}</div>
                    </div>
                    {student.domain && (
                      <div style={{ background: `${color}22`, border: `1px solid ${color}44`, color, fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {student.domain}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {student.bio && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>
                      {student.bio.length > 100 ? student.bio.substring(0, 100) + "..." : student.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {student.skills?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      {student.skills.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
                      {student.skills.length > 5 && <span className="skill-tag">+{student.skills.length - 5} more</span>}
                    </div>
                  )}

                  {/* Social Links */}
                  {(student.github || student.linkedin || student.portfolio) && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                      {student.github && <a href={student.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: "#8B7CF6", textDecoration: "none", background: "rgba(139,124,246,0.1)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(139,124,246,0.2)" }}>🐙 GitHub</a>}
                      {student.linkedin && <a href={student.linkedin} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: "#5DCAA5", textDecoration: "none", background: "rgba(29,158,117,0.1)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(29,158,117,0.2)" }}>💼 LinkedIn</a>}
                      {student.portfolio && <a href={student.portfolio} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: "#EF9F27", textDecoration: "none", background: "rgba(239,159,39,0.1)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(239,159,39,0.2)" }}>🌐 Portfolio</a>}
                    </div>
                  )}

                  {/* Wins */}
                  {student.hackathonsWon > 0 && (
                    <div style={{ padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#EF9F27" }}>{student.hackathonsWon}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>Hackathon Wins 🏆</span>
                    </div>
                  )}

                  {/* Action Buttons — Team Request + Message */}
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <button
                      onClick={() => toggleConnect(student.id)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                        background: isConnected ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${color}, ${color}CC)`,
                        color: isConnected ? "rgba(255,255,255,0.5)" : "#fff",
                        border: isConnected ? "1px solid rgba(255,255,255,0.1)" : "none",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      {isConnected ? "✓ Requested" : "👥 Team Up"}
                    </button>
                    <button
                      onClick={() => handleMessage(student.id)}
                      style={{
                        padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                        background: "rgba(29,158,117,0.15)",
                        color: "#5DCAA5",
                        border: "1px solid rgba(29,158,117,0.3)",
                        cursor: "pointer", transition: "all 0.2s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.25)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(29,158,117,0.15)"}
                    >
                      💬 Message
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Login CTA */}
        {!user && !loading && students.length > 0 && (
          <div style={{ marginTop: 40, textAlign: "center", padding: "32px", background: "rgba(83,64,200,0.08)", border: "1px solid rgba(139,124,246,0.2)", borderRadius: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Want to connect with these students?</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Login to message and send team requests!</div>
            <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Login with Google →</button>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}