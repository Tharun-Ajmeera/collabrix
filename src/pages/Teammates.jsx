import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";

export default function Teammates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");
  const [domains, setDomains] = useState(["All"]);
  const [cities, setCities] = useState(["All"]);
  const [skills, setSkills] = useState(["All"]);
  const [activeFilter, setActiveFilter] = useState("domain");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(s => s.name && s.id !== user?.uid)
          .sort((a, b) => {
            // Sort by profile completeness first
            const scoreA = (a.skills?.length || 0) + (a.college ? 2 : 0) + (a.city ? 1 : 0);
            const scoreB = (b.skills?.length || 0) + (b.college ? 2 : 0) + (b.city ? 1 : 0);
            return scoreB - scoreA;
          });

        setStudents(data);

        // Build dynamic filters from real data
        const allDomains = [...new Set(data.map(s => s.domain).filter(Boolean))];
        const allCities = [...new Set(data.map(s => s.city).filter(Boolean))];
        const allSkills = [...new Set(data.flatMap(s => s.skills || []).filter(Boolean))].slice(0, 20);

        setDomains(["All", ...allDomains]);
        setCities(["All", ...allCities]);
        setSkills(["All", ...allSkills]);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
      setLoading(false);
    };
    fetchStudents();
  }, [user]);

  const filtered = students.filter(s => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.college?.toLowerCase().includes(search.toLowerCase()) ||
      s.skills?.some(sk => sk.toLowerCase().includes(search.toLowerCase())) ||
      s.city?.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domainFilter === "All" || s.domain === domainFilter;
    const matchCity = cityFilter === "All" || s.city === cityFilter;
    const matchSkill = skillFilter === "All" || s.skills?.includes(skillFilter);
    return matchSearch && matchDomain && matchCity && matchSkill;
  });

  const clearFilters = () => {
    setSearch("");
    setDomainFilter("All");
    setCityFilter("All");
    setSkillFilter("All");
  };

  const hasActiveFilters = search || domainFilter !== "All" || cityFilter !== "All" || skillFilter !== "All";

  const getAvatarColor = (name) => {
    const colors = ["#5340C8", "#1D9E75", "#D4537E", "#EF9F27", "#185FA5", "#7B6EE0", "#E24B4A"];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 6px 14px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-chip:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .filter-chip.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .filter-tab { background: none; border: none; cursor: pointer; padding: 8px 16px; font-size: 12px; font-weight: 500; border-radius: 999px; transition: all 0.2s; color: rgba(255,255,255,0.4); }
        .filter-tab.active { background: rgba(83,64,200,0.2); color: #A899F0; border: 1px solid rgba(139,124,246,0.3); }
        .student-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; transition: all 0.2s; cursor: pointer; }
        .student-card:hover { background: rgba(83,64,200,0.08); border-color: rgba(139,124,246,0.3); transform: translateY(-2px); }
        .student-card:active { transform: translateY(0); }
        .skill-tag { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; margin: 2px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @media (max-width: 768px) { .desktop-nav-btns { display: none; } }
        .filters-scroll { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; -ms-overflow-style: none; scrollbar-width: none; }
        .filters-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Navbar */}
     <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* Header */}
        <div style={{ paddingTop: 32, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Connect</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, color: "#fff", letterSpacing: "-1px", marginBottom: 6 }}>Find Teammates</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                {loading ? "Loading students..." : `${filtered.length} student${filtered.length !== 1 ? "s" : ""} found — connect for your next hackathon!`}
              </p>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{ padding: "8px 16px", borderRadius: 999, fontSize: 12, background: "rgba(226,75,74,0.15)", border: "1px solid rgba(226,75,74,0.3)", color: "#F09595", cursor: "pointer" }}>
                ✕ Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Search by name, college, skill or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>}
        </div>

        {/* Filter tabs */}
        {!loading && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {["domain", "city", "skill"].map(tab => (
                <button key={tab} className={`filter-tab ${activeFilter === tab ? "active" : ""}`} onClick={() => setActiveFilter(tab)}>
                  {tab === "domain" ? "🎯 Domain" : tab === "city" ? "📍 City" : "💡 Skill"}
                </button>
              ))}
            </div>

            {/* Domain filters */}
            {activeFilter === "domain" && domains.length > 1 && (
              <div className="filters-scroll">
                {domains.map(d => (
                  <button key={d} className={`filter-chip ${domainFilter === d ? "active" : ""}`} onClick={() => setDomainFilter(d)}>{d}</button>
                ))}
              </div>
            )}

            {/* City filters */}
            {activeFilter === "city" && cities.length > 1 && (
              <div className="filters-scroll">
                {cities.map(c => (
                  <button key={c} className={`filter-chip ${cityFilter === c ? "active" : ""}`} onClick={() => setCityFilter(c)}>{c}</button>
                ))}
              </div>
            )}

            {/* Skill filters */}
            {activeFilter === "skill" && skills.length > 1 && (
              <div className="filters-scroll">
                {skills.map(s => (
                  <button key={s} className={`filter-chip ${skillFilter === s ? "active" : ""}`} onClick={() => setSkillFilter(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active filter badges */}
        {hasActiveFilters && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {domainFilter !== "All" && (
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", display: "flex", alignItems: "center", gap: 6 }}>
                🎯 {domainFilter} <span onClick={() => setDomainFilter("All")} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
              </span>
            )}
            {cityFilter !== "All" && (
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, background: "rgba(239,159,39,0.15)", border: "1px solid rgba(239,159,39,0.3)", color: "#EF9F27", display: "flex", alignItems: "center", gap: 6 }}>
                📍 {cityFilter} <span onClick={() => setCityFilter("All")} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
              </span>
            )}
            {skillFilter !== "All" && (
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)", color: "#5DCAA5", display: "flex", alignItems: "center", gap: 6 }}>
                💡 {skillFilter} <span onClick={() => setSkillFilter("All")} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
              </span>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, animation: "pulse 1.5s infinite" }}>
                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8, width: "60%" }} />
                    <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "40%" }} />
                  </div>
                </div>
                <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "70%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && students.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>👥</div>
            <h2 style={{ fontSize: 20, color: "#fff", marginBottom: 8 }}>Be the first student!</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 360, margin: "0 auto 24px", lineHeight: 1.6 }}>
              No students yet. Complete your profile and be the first to show up here!
            </p>
            <button onClick={() => navigate(user ? "/profile" : "/login")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              {user ? "Complete My Profile →" : "Login & Create Profile →"}
            </button>
          </div>
        )}

        {/* No filter results */}
        {!loading && students.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>No students found matching your filters</div>
            <button onClick={clearFilters} style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Students Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, animation: "fadeIn 0.4s ease" }}>
            {filtered.map(student => {
              const color = getAvatarColor(student.name);
              return (
                <div
                  key={student.id}
                  className="student-card"
                  onClick={() => navigate(`/user/${student.id}`)}
                >
                  {/* Card Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                    {student.photoURL ? (
                      <img src={student.photoURL} alt={student.name} style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${color}55`, flexShrink: 0, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", border: `2px solid ${color}55`, flexShrink: 0 }}>
                        {student.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{student.name}</div>
                      {student.college && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{student.college}</div>}
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                        {[student.year, student.city].filter(Boolean).join(" • ")}
                      </div>
                    </div>

                    {student.domain && (
                      <div style={{ background: `${color}22`, border: `1px solid ${color}44`, color, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {student.domain.length > 12 ? student.domain.substring(0, 12) + "..." : student.domain}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {student.bio && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>
                      {student.bio.length > 90 ? student.bio.substring(0, 90) + "..." : student.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {student.skills?.length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      {student.skills.slice(0, 4).map(s => <span key={s} className="skill-tag">{s}</span>)}
                      {student.skills.length > 4 && <span className="skill-tag">+{student.skills.length - 4}</span>}
                    </div>
                  ) : (
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>Profile not completed yet</span>
                    </div>
                  )}

                  {/* Social links */}
                  {(student.github || student.linkedin) && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                      {student.github && (
                        <a href={student.github} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 11, color: "#8B7CF6", textDecoration: "none", background: "rgba(139,124,246,0.1)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(139,124,246,0.2)" }}>
                          🐙 GitHub
                        </a>
                      )}
                      {student.linkedin && (
                        <a href={student.linkedin} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 11, color: "#5DCAA5", textDecoration: "none", background: "rgba(29,158,117,0.1)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(29,158,117,0.2)" }}>
                          💼 LinkedIn
                        </a>
                      )}
                    </div>
                  )}

                  {/* Hackathon wins */}
                  {student.hackathonsWon > 0 && (
                    <div style={{ padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#EF9F27" }}>{student.hackathonsWon}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>Hackathon Win{student.hackathonsWon > 1 ? "s" : ""} 🏆</span>
                    </div>
                  )}

                  {/* View Profile CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                      Click to view full profile
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); if (!user) { navigate("/login"); return; } navigate(`/chat/${student.id}`); }}
                        style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, background: "rgba(139,124,246,0.15)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", cursor: "pointer" }}
                      >
                        💬
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/user/${student.id}`); }}
                        style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Login CTA for non-logged in users */}
        {!user && !loading && students.length > 0 && (
          <div style={{ marginTop: 40, textAlign: "center", padding: "28px", background: "rgba(83,64,200,0.08)", border: "1px solid rgba(139,124,246,0.2)", borderRadius: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 6 }}>Want to connect with these students?</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Login to send team requests and start chatting!</div>
            <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              Login with Google →
            </button>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}