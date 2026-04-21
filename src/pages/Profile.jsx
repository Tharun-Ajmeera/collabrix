import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SUGGESTED_SKILLS = ["React", "Python", "Node.js", "Flutter", "Figma", "UI/UX", "Machine Learning", "DSA", "Web3", "Solidity", "TypeScript", "Docker", "AWS", "MongoDB", "Java", "C++", "Data Science", "NLP", "Cybersecurity", "Next.js", "Vue.js", "Angular", "Swift", "Kotlin", "Unity", "Blender", "AR/VR", "Robotics", "IoT", "Rust", "Go", "DevOps"];
const SUGGESTED_DOMAINS = ["AI / ML", "Full Stack", "Web3 / Blockchain", "UI / UX", "Mobile Dev", "Cybersecurity", "Data Science", "Open Innovation", "FinTech", "EdTech", "HealthTech", "Game Dev", "AR / VR", "Robotics", "IoT", "Cloud Computing", "DevOps", "Social Impact"];
const SUGGESTED_CITIES = ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Coimbatore", "Vellore", "Mysuru", "Nagpur", "Bhopal", "Lucknow", "Kochi", "Visakhapatnam", "Indore", "Chandigarh", "Shivamogga", "Mangalore", "Manipal", "Warangal", "Tirupati", "Online"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Alumni"];

// Tag Input Component
function TagInput({ label, tags, setTags, suggestions, placeholder, color = "#A899F0", bg = "rgba(139,124,246,0.1)", border = "rgba(139,124,246,0.3)" }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  ).slice(0, 6);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, display: "block" }}>{label}</label>

      {/* Tags Display */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12, minHeight: 46, alignItems: "center", position: "relative",
      }}>
        {tags.map(tag => (
          <span key={tag} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500,
            background: bg, border: `1px solid ${border}`, color,
          }}>
            {tag}
            <span
              onClick={() => removeTag(tag)}
              style={{ cursor: "pointer", fontSize: 14, opacity: 0.6, lineHeight: 1 }}
            >×</span>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "#fff", fontSize: 13, minWidth: 120, flex: 1,
          }}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (input ? filtered : suggestions.filter(s => !tags.includes(s)).slice(0, 8)).length > 0 && (
        <div style={{
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: 6, marginTop: 4,
          display: "flex", flexWrap: "wrap", gap: 6,
        }}>
          {(input ? filtered : suggestions.filter(s => !tags.includes(s)).slice(0, 8)).map(s => (
            <span
              key={s}
              onMouseDown={() => addTag(s)}
              style={{
                padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >{s}</span>
          ))}
          {input && !suggestions.includes(input) && (
            <span
              onMouseDown={() => addTag(input)}
              style={{
                padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)",
                color: "#A899F0",
              }}
            >+ Add "{input}"</span>
          )}
        </div>
      )}
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
        Click suggestions or type your own and press Enter
      </p>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [profileData, setProfileData] = useState({
    college: "", year: "", city: "", domain: "",
    bio: "", skills: [], lookingFor: [], openToCities: [],
    github: "", linkedin: "", portfolio: "", hackathonsWon: 0,
  });
  const [tempData, setTempData] = useState({ ...profileData });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setTempData(data);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...tempData,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: new Date().toISOString(),
      });
      setProfileData(tempData);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving:", err);
    }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Please log in to view your profile</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14 }}>Log in</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 20px; font-size: 13px; font-weight: 500; border-radius: 999px; transition: all 0.2s; }
        input[type="text"], input[type="url"], input[type="number"], textarea, select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; padding: 10px 14px; font-size: 14px; width: 100%; outline: none; font-family: inherit; transition: border 0.2s; }
        input:focus, textarea:focus, select:focus { border-color: rgba(139,124,246,0.6); }
        select option { background: #1a1a2e; }
        ::placeholder { color: rgba(255,255,255,0.25); }
        label { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px; display: block; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
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
          <button onClick={() => navigate("/teammates")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Find Teammates</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Saved Toast */}
        {saved && (
          <div style={{
            position: "fixed", top: 80, right: 24, zIndex: 200,
            background: "rgba(29,158,117,0.2)", border: "1px solid rgba(29,158,117,0.4)",
            color: "#5DCAA5", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
            animation: "fadeIn 0.3s ease",
          }}>✓ Profile saved successfully!</div>
        )}

        {/* Profile Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: "40px 0 28px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} style={{ width: 90, height: 90, borderRadius: "50%", border: "3px solid rgba(139,124,246,0.4)", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #5340C8, #8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
              {user.displayName?.charAt(0)}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>{user.displayName}</h1>
              {profileData.domain && (
                <div style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)", color: "#A899F0", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999 }}>
                  {profileData.domain}
                </div>
              )}
            </div>
            {profileData.college && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{profileData.college} {profileData.year && `• ${profileData.year}`}</p>}
            {profileData.city && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>📍 {profileData.city}</p>}
            {profileData.bio && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, marginBottom: 12 }}>{profileData.bio}</p>}

            {/* Social Links */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {profileData.github && (
                <a href={profileData.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#8B7CF6", textDecoration: "none", background: "rgba(139,124,246,0.1)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(139,124,246,0.2)" }}>
                  🐙 GitHub
                </a>
              )}
              {profileData.linkedin && (
                <a href={profileData.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#5DCAA5", textDecoration: "none", background: "rgba(29,158,117,0.1)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(29,158,117,0.2)" }}>
                  💼 LinkedIn
                </a>
              )}
              {profileData.portfolio && (
                <a href={profileData.portfolio} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#EF9F27", textDecoration: "none", background: "rgba(239,159,39,0.1)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(239,159,39,0.2)" }}>
                  🌐 Portfolio
                </a>
              )}
            </div>

            {!profileData.college && !editing && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 16, fontStyle: "italic" }}>Complete your profile so students can find you! 👇</p>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => { setEditing(!editing); setTempData(profileData); }}
                style={{
                  padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  background: editing ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #5340C8, #7B6EE0)",
                  color: editing ? "rgba(255,255,255,0.5)" : "#fff",
                  border: editing ? "1px solid rgba(255,255,255,0.1)" : "none",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >{editing ? "Cancel" : "✏️ Edit Profile"}</button>
              {editing && (
                <button onClick={saveProfile} disabled={saving} style={{
                  padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  background: "linear-gradient(135deg, #1D9E75, #0F6E56)",
                  color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}>{saving ? "Saving..." : "✓ Save Profile"}</button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div style={{ padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>Edit Your Profile</div>

            {/* Basic Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label>College / University</label>
                <input type="text" placeholder="e.g. JNTU Hyderabad" value={tempData.college} onChange={e => setTempData(p => ({ ...p, college: e.target.value }))} />
              </div>
              <div>
                <label>Year</label>
                <select value={tempData.year} onChange={e => setTempData(p => ({ ...p, year: e.target.value }))}>
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Bio</label>
              <textarea placeholder="Tell other students about yourself, your projects and what you're passionate about..." value={tempData.bio} onChange={e => setTempData(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ resize: "vertical" }} />
            </div>

            {/* Hackathons Won */}
            <div style={{ marginBottom: 20 }}>
              <label>Hackathons Won</label>
              <input type="number" min="0" placeholder="0" value={tempData.hackathonsWon || ""} onChange={e => setTempData(p => ({ ...p, hackathonsWon: parseInt(e.target.value) || 0 }))} style={{ width: 120 }} />
            </div>

            {/* Social Links */}
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Social Links</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label>GitHub URL</label>
                <input type="url" placeholder="https://github.com/username" value={tempData.github || ""} onChange={e => setTempData(p => ({ ...p, github: e.target.value }))} />
              </div>
              <div>
                <label>LinkedIn URL</label>
                <input type="url" placeholder="https://linkedin.com/in/username" value={tempData.linkedin || ""} onChange={e => setTempData(p => ({ ...p, linkedin: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label>Portfolio Website</label>
              <input type="url" placeholder="https://yourportfolio.com" value={tempData.portfolio || ""} onChange={e => setTempData(p => ({ ...p, portfolio: e.target.value }))} />
            </div>

            {/* Tag Inputs */}
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Skills & Preferences</div>

            <TagInput
              label="Your Skills"
              tags={tempData.skills || []}
              setTags={tags => setTempData(p => ({ ...p, skills: tags }))}
              suggestions={SUGGESTED_SKILLS}
              placeholder="Type a skill e.g. React, Python..."
              color="#A899F0"
              bg="rgba(139,124,246,0.15)"
              border="rgba(139,124,246,0.4)"
            />

            <TagInput
              label="Primary Domain (what you build in)"
              tags={tempData.domain ? [tempData.domain] : []}
              setTags={tags => setTempData(p => ({ ...p, domain: tags[tags.length - 1] || "" }))}
              suggestions={SUGGESTED_DOMAINS}
              placeholder="e.g. AI / ML, Full Stack..."
              color="#A899F0"
              bg="rgba(139,124,246,0.15)"
              border="rgba(139,124,246,0.4)"
            />

            <TagInput
              label="Looking for teammates in (domains)"
              tags={tempData.lookingFor || []}
              setTags={tags => setTempData(p => ({ ...p, lookingFor: tags }))}
              suggestions={SUGGESTED_DOMAINS}
              placeholder="e.g. Web3, HealthTech..."
              color="#5DCAA5"
              bg="rgba(29,158,117,0.15)"
              border="rgba(29,158,117,0.4)"
            />

            <TagInput
              label="Open to events in (cities)"
              tags={tempData.openToCities || []}
              setTags={tags => setTempData(p => ({ ...p, openToCities: tags }))}
              suggestions={SUGGESTED_CITIES}
              placeholder="e.g. Bangalore, Mysuru, Online..."
              color="#EF9F27"
              bg="rgba(239,159,39,0.15)"
              border="rgba(239,159,39,0.4)"
            />

            <TagInput
              label="Your City"
              tags={tempData.city ? [tempData.city] : []}
              setTags={tags => setTempData(p => ({ ...p, city: tags[tags.length - 1] || "" }))}
              suggestions={SUGGESTED_CITIES}
              placeholder="Type your city..."
              color="#EF9F27"
              bg="rgba(239,159,39,0.15)"
              border="rgba(239,159,39,0.4)"
            />

            <button onClick={saveProfile} disabled={saving} style={{
              marginTop: 8, width: "100%", padding: "13px", borderRadius: 12,
              fontSize: 14, fontWeight: 500, color: "#fff", border: "none",
              background: "linear-gradient(135deg, #5340C8, #7B6EE0)",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              boxShadow: "0 0 20px rgba(83,64,200,0.3)",
            }}>
              {saving ? "Saving..." : "✓ Save Profile"}
            </button>
          </div>
        )}

        {/* Tabs — View Mode */}
        {!editing && (
          <>
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
                  {/* Stats */}
                  {profileData.hackathonsWon > 0 && (
                    <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 600, color: "#EF9F27" }}>{profileData.hackathonsWon}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Hackathons Won</div>
                      </div>
                    </div>
                  )}

                  {profileData.skills?.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Skills</h3>
                      <div>{profileData.skills.map(s => (
                        <span key={s} style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, margin: 4, background: "rgba(139,124,246,0.1)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0" }}>{s}</span>
                      ))}</div>
                    </div>
                  )}

                  {profileData.lookingFor?.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Looking for teammates in</h3>
                      <div>{profileData.lookingFor.map(d => (
                        <span key={d} style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, margin: 4, background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)", color: "#5DCAA5" }}>{d}</span>
                      ))}</div>
                    </div>
                  )}

                  {profileData.openToCities?.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Open to events in</h3>
                      <div>{profileData.openToCities.map(c => (
                        <span key={c} style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, margin: 4, background: "rgba(239,159,39,0.1)", border: "1px solid rgba(239,159,39,0.3)", color: "#EF9F27" }}>📍 {c}</span>
                      ))}</div>
                    </div>
                  )}

                  {!profileData.skills?.length && !profileData.lookingFor?.length && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Click "Edit Profile" to add your skills and info!</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "events" && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎪</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>No events participated yet</div>
                  <button onClick={() => navigate("/events")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>Browse Events →</button>
                </div>
              )}

              {activeTab === "reels" && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>No reels posted yet</div>
                  <button onClick={() => navigate("/reels")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>Watch Reels →</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}