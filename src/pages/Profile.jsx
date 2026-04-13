import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SKILLS = ["React", "Python", "UI/UX", "Machine Learning", "Node.js", "Figma", "DSA", "Flutter"];

const EVENTS = [
  { name: "Smart India Hackathon 2025", result: "Winner 🏆", date: "Dec 2025" },
  { name: "HackWithInfy", result: "Top 10 🥈", date: "Oct 2025" },
  { name: "Google Solution Challenge", result: "Participant", date: "Aug 2025" },
];

const REELS = [
  { title: "How to crack SIH in 7 days", views: "12.4K", time: "3:24" },
  { title: "React hooks explained simply", views: "8.1K", time: "2:45" },
  { title: "Best DSA resources for beginners", views: "5.6K", time: "4:10" },
];

export default function Profile() {
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 20px; font-size: 13px; font-weight: 500; border-radius: 999px; transition: all 0.2s; }
        .skill-tag { display: inline-block; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 500; margin: 4px; background: rgba(139,124,246,0.1); border: 1px solid rgba(139,124,246,0.3); color: #A899F0; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; margin-bottom: 12px; transition: all 0.2s; }
        .card:hover { background: rgba(83,64,200,0.08); border-color: rgba(139,124,246,0.3); }
        .connect-btn { padding: 12px 32px; border-radius: 999px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; }
      `}</style>

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
          <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
            Messages
          </button>
          <button style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
            My Profile
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 28, padding: "40px 0 32px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #5340C8, #8B7CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, fontWeight: 600, color: "#fff",
            border: "3px solid rgba(139,124,246,0.4)",
          }}>T</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 24, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>Tharun Ajmeera</h1>
              <div style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)", color: "#A899F0", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999 }}>
                Builder 🏆
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>B.Tech CSE • 3rd Year • JNTU Hyderabad</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>📍 Hyderabad, Telangana</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, marginBottom: 20 }}>
              Full stack developer passionate about building products that solve real problems. Founded Collabrix India to help students find teammates and grow together. 🚀
            </p>

            <div style={{ display: "flex", gap: 28, marginBottom: 20 }}>
              {[["324", "Followers"], ["128", "Following"], ["12", "Events"], ["3", "Wins"]].map(([val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="connect-btn" onClick={() => setConnected(!connected)} style={{
                background: connected ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #5340C8, #7B6EE0)",
                color: connected ? "rgba(255,255,255,0.6)" : "#fff",
                border: connected ? "1px solid rgba(255,255,255,0.1)" : "none",
                boxShadow: connected ? "none" : "0 0 20px rgba(83,64,200,0.3)",
              }}>
                {connected ? "✓ Connected" : "Connect for team"}
              </button>
              <button className="connect-btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Follow</button>
              <button className="connect-btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Message</button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {["about", "events", "reels"].map(tab => (
            <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? "rgba(83,64,200,0.2)" : "transparent",
              color: activeTab === tab ? "#A899F0" : "rgba(255,255,255,0.4)",
              border: activeTab === tab ? "1px solid rgba(139,124,246,0.3)" : "1px solid transparent",
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ paddingTop: 24 }}>
          {activeTab === "about" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Skills</h3>
                <div>{SKILLS.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Looking for teammates in</h3>
                <div>{["AI/ML", "Web3", "HealthTech", "EdTech"].map(domain => (
                  <span key={domain} className="skill-tag" style={{ background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)", color: "#5DCAA5" }}>{domain}</span>
                ))}</div>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Open to events in</h3>
                <div>{["Hyderabad", "Bangalore", "Chennai", "Online"].map(city => (
                  <span key={city} className="skill-tag" style={{ background: "rgba(239,159,39,0.1)", border: "1px solid rgba(239,159,39,0.3)", color: "#EF9F27" }}>📍 {city}</span>
                ))}</div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Hackathons & Competitions</h3>
              {EVENTS.map((event) => (
                <div key={event.name} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{event.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{event.date}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#A899F0", background: "rgba(83,64,200,0.15)", padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(139,124,246,0.2)" }}>
                    {event.result}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reels" && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Knowledge Reels</h3>
              {REELS.map((reel) => (
                <div key={reel.title} className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg, #5340C8, #8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>▶</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{reel.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{reel.views} views • {reel.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}