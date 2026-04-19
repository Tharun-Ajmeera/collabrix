import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";

const STUDENTS = [
  {
    id: 1,
    name: "Priya Sharma",
    college: "IIT Bombay",
    year: "3rd Year",
    city: "Mumbai",
    domain: "AI / ML",
    skills: ["Python", "TensorFlow", "React", "Data Science"],
    wins: 4,
    events: 12,
    bio: "AI enthusiast building smart solutions. Won SIH 2024 and Google Solution Challenge finalist.",
    avatar: "P",
    color: "#5340C8",
    available: true,
  },
  {
    id: 2,
    name: "Arjun Mehta",
    college: "BITS Pilani",
    year: "2nd Year",
    city: "Pilani",
    domain: "Web3",
    skills: ["Solidity", "React", "Node.js", "Web3.js"],
    wins: 2,
    events: 8,
    bio: "Blockchain developer passionate about decentralized apps. ETHIndia 2024 winner.",
    avatar: "A",
    color: "#1D9E75",
    available: true,
  },
  {
    id: 3,
    name: "Sneha Reddy",
    college: "JNTU Hyderabad",
    year: "4th Year",
    city: "Hyderabad",
    domain: "UI / UX",
    skills: ["Figma", "React", "CSS", "Prototyping"],
    wins: 3,
    events: 10,
    bio: "Designer who codes. Creating beautiful products that are also functional and accessible.",
    avatar: "S",
    color: "#D4537E",
    available: true,
  },
  {
    id: 4,
    name: "Rahul Kumar",
    college: "NIT Trichy",
    year: "3rd Year",
    city: "Trichy",
    domain: "Full Stack",
    skills: ["React", "Node.js", "MongoDB", "Docker"],
    wins: 5,
    events: 15,
    bio: "Full stack dev who loves building scalable products. Open source contributor.",
    avatar: "R",
    color: "#EF9F27",
    available: false,
  },
  {
    id: 5,
    name: "Ananya Singh",
    college: "Delhi University",
    year: "2nd Year",
    city: "Delhi",
    domain: "AI / ML",
    skills: ["Python", "NLP", "Pandas", "Scikit-learn"],
    wins: 1,
    events: 5,
    bio: "NLP researcher working on vernacular language models for Indian languages.",
    avatar: "A",
    color: "#185FA5",
    available: true,
  },
  {
    id: 6,
    name: "Vikram Nair",
    college: "IIT Madras",
    year: "4th Year",
    city: "Chennai",
    domain: "Cybersecurity",
    skills: ["Python", "Ethical Hacking", "Linux", "Cryptography"],
    wins: 6,
    events: 18,
    bio: "Security researcher and CTF player. Bug bounty hunter with 50+ CVEs reported.",
    avatar: "V",
    color: "#993C1D",
    available: true,
  },
  {
    id: 7,
    name: "Kavya Iyer",
    college: "VIT Vellore",
    year: "3rd Year",
    city: "Vellore",
    domain: "Mobile Dev",
    skills: ["Flutter", "Dart", "Firebase", "React Native"],
    wins: 2,
    events: 7,
    bio: "Mobile app developer with 3 apps on Play Store. Passionate about cross-platform development.",
    avatar: "K",
    color: "#7B6EE0",
    available: true,
  },
  {
    id: 8,
    name: "Dev Patel",
    college: "DAIICT",
    year: "2nd Year",
    city: "Gandhinagar",
    domain: "Full Stack",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    wins: 3,
    events: 9,
    bio: "Building SaaS products on weekends. Interested in EdTech and FinTech domains.",
    avatar: "D",
    color: "#5340C8",
    available: true,
  },
  {
    id: 9,
    name: "Meera Pillai",
    college: "Amrita University",
    year: "3rd Year",
    city: "Coimbatore",
    domain: "Data Science",
    skills: ["Python", "R", "Tableau", "Machine Learning"],
    wins: 2,
    events: 6,
    bio: "Data storyteller who turns raw numbers into meaningful insights. Kaggle expert.",
    avatar: "M",
    color: "#1D9E75",
    available: false,
  },
];

const CITIES = ["All", "Mumbai", "Hyderabad", "Delhi", "Bangalore", "Chennai", "Pilani", "Trichy", "Vellore", "Gandhinagar", "Coimbatore"];
const DOMAINS = ["All", "AI / ML", "Web3", "UI / UX", "Full Stack", "Cybersecurity", "Mobile Dev", "Data Science"];
const SKILLS_LIST = ["All", "React", "Python", "Node.js", "Flutter", "Figma", "Solidity", "TypeScript", "Docker"];

export default function Teammates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [domain, setDomain] = useState("All");
  const [skill, setSkill] = useState("All");
  const [connected, setConnected] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.college.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()));
    const matchCity = city === "All" || s.city === city;
    const matchDomain = domain === "All" || s.domain === domain;
    const matchSkill = skill === "All" || s.skills.includes(skill);
    const matchAvailable = !availableOnly || s.available;
    return matchSearch && matchCity && matchDomain && matchSkill && matchAvailable;
  });

  const toggleConnect = (id) => {
        if (!user) {
        navigate("/login");
        return;
        }
        setConnected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .filter-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 6px 14px; border-radius: 999px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-btn:hover { border-color: rgba(139,124,246,0.4); color: #fff; }
        .filter-btn.active { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; font-weight: 500; }
        .student-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px; transition: all 0.25s; }
        .student-card:hover { background: rgba(83,64,200,0.06); border-color: rgba(139,124,246,0.25); transform: translateY(-2px); }
        .skill-tag { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 500; margin: 3px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .connect-btn { width: 100%; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; margin-top: 14px; }
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
          <button onClick={() => navigate("/events")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
            Events
          </button>
          <button onClick={() => navigate("/profile")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
            My Profile
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Header */}
        <div style={{ paddingTop: 40, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Connect</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>
            Find Teammates
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>
            {filtered.length} students found — connect with the right people for your next hackathon!
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
            placeholder="Search by name, college or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
          )}
        </div>

        {/* Available Only Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            onClick={() => setAvailableOnly(!availableOnly)}
            style={{
              width: 36, height: 20, borderRadius: 999, cursor: "pointer", transition: "all 0.2s",
              background: availableOnly ? "linear-gradient(135deg, #5340C8, #7B6EE0)" : "rgba(255,255,255,0.1)",
              position: "relative",
            }}
          >
            <div style={{
              width: 14, height: 14, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: availableOnly ? 19 : 3,
              transition: "left 0.2s",
            }} />
          </div>
          <span style={{ fontSize: 13, color: availableOnly ? "#A899F0" : "rgba(255,255,255,0.4)" }}>
            Show available for team only
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 50 }}>Domain:</span>
            {DOMAINS.map(d => (
              <button key={d} className={`filter-btn ${domain === d ? "active" : ""}`} onClick={() => setDomain(d)}>{d}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 50 }}>City:</span>
            {CITIES.map(c => (
              <button key={c} className={`filter-btn ${city === c ? "active" : ""}`} onClick={() => setCity(c)}>{c}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 50 }}>Skill:</span>
            {SKILLS_LIST.map(s => (
              <button key={s} className={`filter-btn ${skill === s ? "active" : ""}`} onClick={() => setSkill(s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Students Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>No students found matching your filters</div>
            <button onClick={() => { setSearch(""); setCity("All"); setDomain("All"); setSkill("All"); setAvailableOnly(false); }}
              style={{ marginTop: 16, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "8px 20px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map(student => (
              <div key={student.id} className="student-card">

                {/* Card Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${student.color}, ${student.color}99)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 600, color: "#fff",
                    border: `2px solid ${student.color}44`,
                  }}>{student.avatar}</div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{student.name}</div>
                      {student.available ? (
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", flexShrink: 0 }} title="Available for team" />
                      ) : (
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} title="Not available" />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{student.college}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{student.year} • {student.city}</div>
                  </div>

                  <div style={{ background: `${student.color}22`, border: `1px solid ${student.color}44`, color: student.color, fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
                    {student.domain}
                  </div>
                </div>

                {/* Bio */}
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>
                  {student.bio}
                </p>

                {/* Skills */}
                <div style={{ marginBottom: 14 }}>
                  {student.skills.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 16, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{student.wins}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Wins</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{student.events}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Events</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: student.available ? "#1D9E75" : "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                      {student.available ? "✓ Available for team" : "● In a team"}
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <button
                  className="connect-btn"
                  onClick={() => toggleConnect(student.id)}
                  style={{
                    background: connected.includes(student.id)
                      ? "rgba(255,255,255,0.05)"
                      : `linear-gradient(135deg, ${student.color}, ${student.color}CC)`,
                    color: connected.includes(student.id) ? "rgba(255,255,255,0.5)" : "#fff",
                    border: connected.includes(student.id) ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  {connected.includes(student.id) ? "✓ Request Sent" : "Send Team Request →"}
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}