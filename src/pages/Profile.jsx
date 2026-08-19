import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";

const SUGGESTED_SKILLS = ["React", "Python", "Node.js", "Flutter", "Figma", "UI/UX", "Machine Learning", "DSA", "Web3", "Solidity", "TypeScript", "Docker", "AWS", "MongoDB", "Java", "C++", "Data Science", "NLP", "Cybersecurity", "Next.js", "Vue.js", "Angular", "Swift", "Kotlin", "Unity", "Blender", "AR/VR", "Robotics", "IoT", "Rust", "Go", "DevOps"];
const SUGGESTED_DOMAINS = ["AI / ML", "Full Stack", "Web3 / Blockchain", "UI / UX", "Mobile Dev", "Cybersecurity", "Data Science", "Open Innovation", "FinTech", "EdTech", "HealthTech", "Game Dev", "AR / VR", "Robotics", "IoT", "Cloud Computing", "DevOps", "Social Impact"];
const SUGGESTED_CITIES = ["All over India", "Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Coimbatore", "Vellore", "Mysuru", "Nagpur", "Bhopal", "Lucknow", "Kochi", "Visakhapatnam", "Indore", "Chandigarh", "Shivamogga", "Mangalore", "Manipal", "Warangal", "Tirupati", "Online"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Alumni"];
const TYPE_ICONS = { "Hackathon": "🏆", "Startup Meet": "🚀", "Tech Talk": "🎤", "Workshop": "🛠", "College Fest": "🎓", "Coding Contest": "💻", "Internship Drive": "💼" };

// ─── Tag Input ───────────────────────────────
function TagInput({ label, tags, setTags, suggestions, placeholder, color = "#A899F0", bg = "rgba(139,124,246,0.1)", border = "rgba(139,124,246,0.3)" }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)).slice(0, 6);
  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setInput(""); setShowSuggestions(false);
  };
  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && tags.length > 0) removeTag(tags[tags.length - 1]);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, display: "block" }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, minHeight: 46, alignItems: "center" }}>
        {tags.map(tag => (
          <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: bg, border: `1px solid ${border}`, color }}>
            {tag}<span onClick={() => removeTag(tag)} style={{ cursor: "pointer", fontSize: 14, opacity: 0.6 }}>×</span>
          </span>
        ))}
        <input type="text" value={input} onChange={e => { setInput(e.target.value); setShowSuggestions(true); }} onKeyDown={handleKeyDown} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? placeholder : "Add more..."} style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13, minWidth: 120, flex: 1 }} />
      </div>
      {showSuggestions && (input ? filtered : suggestions.filter(s => !tags.includes(s)).slice(0, 8)).length > 0 && (
        <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 6, marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(input ? filtered : suggestions.filter(s => !tags.includes(s)).slice(0, 8)).map(s => (
            <span key={s} onMouseDown={() => addTag(s)} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
              onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >{s}</span>
          ))}
          {input && !suggestions.includes(input) && (
            <span onMouseDown={() => addTag(input)} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)", color: "#A899F0" }}>+ Add "{input}"</span>
          )}
        </div>
      )}
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Click suggestions or type and press Enter</p>
    </div>
  );
}

// ─── Saved Events (Only for own profile) ───────────────────────────────
function SavedEvents({ userId, navigate }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchSaved = async () => {
      try {
        const snap = await getDoc(doc(db, "savedEvents", userId));
        if (snap.exists()) {
          const ids = snap.data().eventIds || [];
          if (ids.length === 0) { setLoading(false); return; }
          const eventDocs = await Promise.all(ids.map(id => getDoc(doc(db, "events", id))));
          setSavedEvents(eventDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchSaved();
  }, [userId]);

  if (loading) return <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.4)" }}>Loading saved events...</div>;

  if (savedEvents.length === 0) return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>No saved events yet</div>
      <button onClick={() => navigate("/events")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>Browse Events →</button>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>⭐ {savedEvents.length} saved event{savedEvents.length > 1 ? "s" : ""}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {savedEvents.map(event => (
          <div key={event.id} onClick={() => navigate(`/events/${event.id}`)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(83,64,200,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          >
            <div style={{ fontSize: 26, flexShrink: 0 }}>{TYPE_ICONS[event.type] || "📋"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 3 }}>{event.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{[event.organiser, event.city].filter(Boolean).join(" • ")}</div>
            </div>
            {event.prize && <div style={{ fontSize: 13, fontWeight: 600, color: "#EF9F27", flexShrink: 0 }}>{event.prize}</div>}
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.2)" }}>›</div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/events")} style={{ marginTop: 16, width: "100%", padding: "11px", borderRadius: 12, fontSize: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
        Browse more events →
      </button>
    </div>
  );
}

// ─── Collabs Tab (Pending requests + Accepted friends) ───────────────────────────────
function CollabRequests({ userId }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchRequests = async () => {
      try {
        // Fetch requests sent TO this user
        // Fetch requests sent TO me
const q1 = query(
  collection(db, "teamRequests"),
  where("toId", "==", userId)
);

// Fetch requests I SENT that were accepted
const q2 = query(
  collection(db, "teamRequests"),
  where("fromId", "==", userId),
  where("status", "==", "accepted")
);

const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

// For sent requests, swap fromId/toId for display
const received = snap1.docs.map(d => ({ id: d.id, ...d.data() }));
const sent = snap2.docs.map(d => ({
  id: d.id,
  ...d.data(),
  // Swap so display shows the OTHER person
  fromId: d.data().toId,
  fromName: d.data().toName,
  fromPhoto: d.data().toPhoto || "",
}));

// Merge and deduplicate
const all = [...received];
sent.forEach(s => {
  if (!all.find(r => r.fromId === s.fromId)) all.push(s);
});
setRequests(all);


      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchRequests();
  }, [userId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleRequest = async (requestId, fromId, action) => {
    try {
      await updateDoc(doc(db, "teamRequests", requestId), { status: action });
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: action } : r));
      if (action === "accepted") {
        showToast("✅ Collab Accepted! Opening chat...");
        setTimeout(() => navigate(`/chat/${fromId}`), 1000);
      } else {
        showToast("Request declined");
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.4)" }}>Loading collabs...</div>;

  const pending = requests.filter(r => r.status === "pending");
  const accepted = requests.filter(r => r.status === "accepted");

  if (requests.length === 0) return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>No collab requests yet</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginBottom: 20 }}>When someone sends you a collab request it appears here!</div>
      <button onClick={() => navigate("/teammates")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>
        Find Students to Collab →
      </button>
    </div>
  );

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 300, background: "rgba(29,158,117,0.9)", border: "1px solid rgba(29,158,117,0.5)", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {/* ── PENDING REQUESTS ── */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#EF9F27", marginBottom: 12 }}>
            ⏳ Pending Requests ({pending.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.map(req => (
              <div key={req.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "rgba(83,64,200,0.08)", border: "1px solid rgba(139,124,246,0.2)", borderRadius: 14 }}>

                {/* Avatar */}
                {req.fromPhoto ? (
                  <img src={req.fromPhoto} alt={req.fromName} style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(139,124,246,0.4)", flexShrink: 0, cursor: "pointer" }} onClick={() => navigate(`/user/${req.fromId}`)} />
                ) : (
                  <div onClick={() => navigate(`/user/${req.fromId}`)} style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#5340C8,#8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0, cursor: "pointer" }}>
                    {req.fromName?.charAt(0)}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2, cursor: "pointer" }} onClick={() => navigate(`/user/${req.fromId}`)}>
                    {req.fromName}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Wants to Collab with you! ⚡</div>
                </div>

                {/* Accept / Decline */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleRequest(req.id, req.fromId, "accepted")}
                    style={{ padding: "8px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg,#1D9E75,#0F6E56)", color: "#fff", border: "none", cursor: "pointer" }}>
                    ✓ Accept
                  </button>
                  <button onClick={() => handleRequest(req.id, req.fromId, "declined")}
                    style={{ padding: "8px 14px", borderRadius: 999, fontSize: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MY COLLABS (Accepted friends) ── */}
      {accepted.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#5DCAA5", marginBottom: 12 }}>
            ✅ My Collabs ({accepted.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {accepted.map(req => (
              <div key={req.id}
                style={{ background: "rgba(29,158,117,0.08)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 14, padding: "16px", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(29,158,117,0.08)"}
              >
                {/* Avatar + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {req.fromPhoto ? (
                    <img src={req.fromPhoto} alt={req.fromName} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(29,158,117,0.5)", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#1D9E75,#5DCAA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {req.fromName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{req.fromName}</div>
                    <div style={{ fontSize: 11, color: "#5DCAA5" }}>✅ Collab Accepted</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigate(`/user/${req.fromId}`)}
                    style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                    👤 Profile
                  </button>
                  <button onClick={() => navigate(`/chat/${req.fromId}`)}
                    style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, background: "rgba(139,124,246,0.15)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", cursor: "pointer", fontWeight: 500 }}>
                    💬 Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No accepted yet but has pending */}
      {pending.length > 0 && accepted.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          Accept requests above to add them to your Collabs!
        </div>
      )}
    </div>
  );
}

// ─── Main Profile ───────────────────────────────
export default function Profile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { userId } = useParams();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [profileData, setProfileData] = useState({
    college: "", year: "", city: "", domain: "", bio: "",
    skills: [], lookingFor: [], openToCities: [],
    github: "", linkedin: "", portfolio: "", hackathonsWon: 0,
  });
  const [tempData, setTempData] = useState({ ...profileData });
  const [collabStatus, setCollabStatus] = useState(null);
  const [sendingCollab, setSendingCollab] = useState(false);
  const [collabToast, setCollabToast] = useState("");

  const viewingUserId = userId || user?.uid;
  const isOwnProfile = !userId || userId === user?.uid;
  const displayName = isOwnProfile ? user?.displayName : profileData.name;
  const displayPhoto = isOwnProfile ? user?.photoURL : profileData.photoURL;

  // Own profile → About | Events | Collabs | Reels
  // Other's profile → About | Reels (NO events, NO collabs)
  const TABS = isOwnProfile
    ? ["about", "events", "collabs", "reels"]
    : ["about", "reels"];

  const TAB_LABELS = {
    about: "About",
    events: "⭐ Events",
    collabs: "⚡ Collabs",
    reels: "Reels",
  };

  useEffect(() => {
    if (!viewingUserId) return;
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", viewingUserId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setTempData(data);
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [viewingUserId]);

  // Check collab request status
  useEffect(() => {
    if (!user || isOwnProfile || !viewingUserId) return;
    const checkCollabStatus = async () => {
      try {
        const q = query(
          collection(db, "teamRequests"),
          where("fromId", "==", user.uid),
          where("toId", "==", viewingUserId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setCollabStatus(snap.docs[0].data().status);
        }
      } catch (err) { console.error(err); }
    };
    checkCollabStatus();
  }, [user, viewingUserId, isOwnProfile]);

  const sendCollabRequest = async () => {
    if (!user) { navigate("/login"); return; }
    setSendingCollab(true);
    try {
      await addDoc(collection(db, "teamRequests"), {
        fromId: user.uid,
        fromName: user.displayName,
        fromPhoto: user.photoURL || "",
        toId: viewingUserId,
        toName: profileData.name || "",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setCollabStatus("pending");
      setCollabToast("⚡ Collab request sent!");
      setTimeout(() => setCollabToast(""), 2500);
    } catch (err) { console.error(err); }
    setSendingCollab(false);
  };

  const getCollabButton = () => {
    if (sendingCollab) return { label: "Sending...", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", disabled: true };
    if (collabStatus === "accepted") return { label: "✅ Collab Accepted", bg: "rgba(29,158,117,0.15)", color: "#5DCAA5", border: "1px solid rgba(29,158,117,0.35)", disabled: true };
    if (collabStatus === "pending") return { label: "⏳ Request Sent", bg: "rgba(239,159,39,0.15)", color: "#EF9F27", border: "1px solid rgba(239,159,39,0.35)", disabled: true };
    return { label: "⚡ Collab", bg: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", disabled: false };
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...tempData, name: user.displayName, email: user.email,
        photoURL: user.photoURL, updatedAt: new Date().toISOString(),
      });
      setProfileData(tempData);
      setEditing(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user && isOwnProfile) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 40 }}>👤</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Please log in to view your profile</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14 }}>Log in with Google</button>
      <BottomNav />
    </div>
  );

  const collabBtn = getCollabButton();

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 18px; font-size: 13px; font-weight: 500; border-radius: 999px; transition: all 0.2s; white-space: nowrap; }
        input[type="text"], input[type="url"], input[type="number"], textarea, select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; padding: 10px 14px; font-size: 14px; width: 100%; outline: none; font-family: inherit; }
        input:focus, textarea:focus, select:focus { border-color: rgba(139,124,246,0.6); }
        select option { background: #1a1a2e; }
        ::placeholder { color: rgba(255,255,255,0.25); }
        label { font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px; display: block; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) { .desktop-nav-btns { display: none; } }
      `}</style>

      {/* Collab Toast */}
      {collabToast && (
        <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 300, background: "rgba(83,64,200,0.95)", border: "1px solid rgba(139,124,246,0.5)", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", backdropFilter: "blur(10px)" }}>
          {collabToast}
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 40px" }}>

        {/* Saved Toast */}
        {savedToast && (
          <div style={{ position: "fixed", top: 80, right: 24, zIndex: 200, background: "rgba(29,158,117,0.2)", border: "1px solid rgba(29,158,117,0.4)", color: "#5DCAA5", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, animation: "fadeIn 0.3s ease" }}>
            ✓ Profile saved successfully!
          </div>
        )}

        {/* Profile Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: "40px 0 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" }}>
          {displayPhoto ? (
            <img 
              src={displayPhoto} 
              alt={displayName}
              referrerPolicy="no-referrer"
            style={{ width: 90, height: 90, borderRadius: "50%", border: "3px solid rgba(139,124,246,0.4)", flexShrink: 0, objectFit: "cover" }} 
/>
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #5340C8, #8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
              {displayName?.charAt(0) || "?"}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>{displayName}</h1>
              {profileData.domain && (
                <div style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)", color: "#A899F0", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999 }}>{profileData.domain}</div>
              )}
              {collabStatus === "accepted" && !isOwnProfile && (
                <div style={{ background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)", color: "#5DCAA5", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999 }}>✅ Collab Accepted</div>
              )}
            </div>

            {profileData.college && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{profileData.college}{profileData.year && ` • ${profileData.year}`}</p>}
            {profileData.city && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>📍 {profileData.city}</p>}
            {profileData.bio && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, marginBottom: 12 }}>{profileData.bio}</p>}

            {/* Social Links */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {profileData.github && <a href={profileData.github} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#8B7CF6", textDecoration: "none", background: "rgba(139,124,246,0.1)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(139,124,246,0.2)" }}>🐙 GitHub</a>}
              {profileData.linkedin && <a href={profileData.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#5DCAA5", textDecoration: "none", background: "rgba(29,158,117,0.1)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(29,158,117,0.2)" }}>💼 LinkedIn</a>}
              {profileData.portfolio && <a href={profileData.portfolio} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#EF9F27", textDecoration: "none", background: "rgba(239,159,39,0.1)", padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(239,159,39,0.2)" }}>🌐 Portfolio</a>}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              {isOwnProfile ? (
                <>
                  <button onClick={() => { setEditing(!editing); setTempData(profileData); }}
                    style={{ padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 500, background: editing ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #5340C8, #7B6EE0)", color: editing ? "rgba(255,255,255,0.5)" : "#fff", border: editing ? "1px solid rgba(255,255,255,0.1)" : "none", cursor: "pointer" }}>
                    {editing ? "Cancel" : "✏️ Edit Profile"}
                  </button>
                  {editing && (
                    <button onClick={saveProfile} disabled={saving}
                      style={{ padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 500, background: "linear-gradient(135deg, #1D9E75, #0F6E56)", color: "#fff", border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                      {saving ? "Saving..." : "✓ Save Profile"}
                    </button>
                  )}
                  <button onClick={() => navigate("/inbox")}
                    style={{ padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500, background: "rgba(139,124,246,0.15)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", cursor: "pointer" }}>
                    💬 Messages
                  </button>
                </>
              ) : (
                <>
                  {/* ⚡ Collab Button */}
                  <button
                    onClick={collabBtn.disabled ? null : sendCollabRequest}
                    disabled={collabBtn.disabled}
                    style={{ padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: collabBtn.bg, color: collabBtn.color, border: collabBtn.border || "none", cursor: collabBtn.disabled ? "default" : "pointer", transition: "all 0.2s" }}>
                    {collabBtn.label}
                  </button>

                  {/* 💬 Message Button */}
                  <button onClick={() => { if (!user) { navigate("/login"); return; } navigate(`/chat/${viewingUserId}`); }}
                    style={{ padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500, background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.35)", color: "#5DCAA5", cursor: "pointer" }}>
                    💬 Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && isOwnProfile && (
          <div style={{ padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>Edit Your Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div><label>College / University</label><input type="text" placeholder="e.g. JNTU Hyderabad" value={tempData.college} onChange={e => setTempData(p => ({ ...p, college: e.target.value }))} /></div>
              <div><label>Year</label><select value={tempData.year} onChange={e => setTempData(p => ({ ...p, year: e.target.value }))}><option value="">Select year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            </div>
            <div style={{ marginBottom: 16 }}><label>Bio</label><textarea placeholder="Tell other students about yourself..." value={tempData.bio} onChange={e => setTempData(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ resize: "vertical" }} /></div>
           
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Social Links</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
              <div><label>GitHub URL</label><input type="url" placeholder="https://github.com/username" value={tempData.github || ""} onChange={e => setTempData(p => ({ ...p, github: e.target.value }))} /></div>
              <div><label>LinkedIn URL</label><input type="url" placeholder="https://linkedin.com/in/username" value={tempData.linkedin || ""} onChange={e => setTempData(p => ({ ...p, linkedin: e.target.value }))} /></div>
            </div>
            <div style={{ marginBottom: 24 }}><label>Portfolio Website</label><input type="url" placeholder="https://yourportfolio.com" value={tempData.portfolio || ""} onChange={e => setTempData(p => ({ ...p, portfolio: e.target.value }))} /></div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Skills & Preferences</div>
            <TagInput label="Your Skills" tags={tempData.skills || []} setTags={tags => setTempData(p => ({ ...p, skills: tags }))} suggestions={SUGGESTED_SKILLS} placeholder="Type a skill e.g. React, Python..." color="#A899F0" bg="rgba(139,124,246,0.15)" border="rgba(139,124,246,0.4)" />
            <TagInput label="Primary Domain" tags={tempData.domain ? [tempData.domain] : []} setTags={tags => setTempData(p => ({ ...p, domain: tags[tags.length - 1] || "" }))} suggestions={SUGGESTED_DOMAINS} placeholder="e.g. AI / ML, Full Stack..." color="#A899F0" bg="rgba(139,124,246,0.15)" border="rgba(139,124,246,0.4)" />
            <TagInput label="Looking for teammates in" tags={tempData.lookingFor || []} setTags={tags => setTempData(p => ({ ...p, lookingFor: tags }))} suggestions={SUGGESTED_DOMAINS} placeholder="e.g. Web3, HealthTech..." color="#5DCAA5" bg="rgba(29,158,117,0.15)" border="rgba(29,158,117,0.4)" />
            <TagInput label="Open to events in" tags={tempData.openToCities || []} setTags={tags => setTempData(p => ({ ...p, openToCities: tags }))} suggestions={SUGGESTED_CITIES} placeholder="e.g. Bangalore, Online..." color="#EF9F27" bg="rgba(239,159,39,0.15)" border="rgba(239,159,39,0.4)" />
            <TagInput label="Your City" tags={tempData.city ? [tempData.city] : []} setTags={tags => setTempData(p => ({ ...p, city: tags[tags.length - 1] || "" }))} suggestions={SUGGESTED_CITIES} placeholder="Type your city..." color="#EF9F27" bg="rgba(239,159,39,0.15)" border="rgba(239,159,39,0.4)" />
            <button onClick={saveProfile} disabled={saving} style={{ marginTop: 8, width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 500, color: "#fff", border: "none", background: "linear-gradient(135deg, #5340C8, #7B6EE0)", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "✓ Save Profile"}
            </button>
          </div>
        )}

        {/* Tabs */}
        {!editing && (
          <>
            <div style={{ display: "flex", gap: 4, padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", overflowX: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
              {TABS.map(tab => (
                <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)}
                  style={{ background: activeTab === tab ? "rgba(83,64,200,0.2)" : "transparent", color: activeTab === tab ? "#A899F0" : "rgba(255,255,255,0.4)", border: activeTab === tab ? "1px solid rgba(139,124,246,0.3)" : "1px solid transparent" }}>
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            <div style={{ paddingTop: 24 }}>

              {/* About Tab */}
              {activeTab === "about" && (
                <div>
                  {profileData.hackathonsWon > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 20px", textAlign: "center", display: "inline-block" }}>
                        <div style={{ fontSize: 22, fontWeight: 600, color: "#EF9F27" }}>{profileData.hackathonsWon}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Hackathons Won 🏆</div>
                      </div>
                    </div>
                  )}
                  {profileData.skills?.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Skills</h3>
                      <div>{profileData.skills.map(s => <span key={s} style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, margin: 4, background: "rgba(139,124,246,0.1)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0" }}>{s}</span>)}</div>
                    </div>
                  )}
                  {profileData.lookingFor?.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Looking for teammates in</h3>
                      <div>{profileData.lookingFor.map(d => <span key={d} style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, margin: 4, background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)", color: "#5DCAA5" }}>{d}</span>)}</div>
                    </div>
                  )}
                  {!profileData.skills?.length && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
                        {isOwnProfile ? 'Click "Edit Profile" to add your skills!' : "This student hasn't added their skills yet."}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab — ONLY own profile */}
              {activeTab === "events" && isOwnProfile && (
                <SavedEvents userId={viewingUserId} navigate={navigate} />
              )}

              {/* Collabs Tab — ONLY own profile */}
              {activeTab === "collabs" && isOwnProfile && (
                <CollabRequests userId={user?.uid} />
              )}

              {/* Reels Tab */}
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
      <BottomNav />
    </div>
  );
}