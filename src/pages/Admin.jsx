import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { db } from "../firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, query
} from "firebase/firestore";

// 🔐 Add your Gmail here — only these emails can access admin
const ADMIN_EMAILS = ["ajmeeratharun55@gmail.com"];

const EVENT_TYPES = ["Hackathon", "Startup Meet", "Tech Talk", "Workshop", "College Fest", "Coding Contest", "Internship Drive", "Open Source Sprint", "Bootcamp", "Networking Event"];
const DOMAINS = ["AI / ML", "Full Stack", "Web3 / Blockchain", "UI / UX", "Mobile Dev", "Cybersecurity", "Data Science", "Open Innovation", "FinTech", "EdTech", "HealthTech", "Game Dev", "Startup", "All Domains"];
const MODES = ["Online", "Offline", "Hybrid"];
const CITIES = ["Pan India", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Coimbatore", "Vellore", "Online"];

const EMPTY_FORM = {
  name: "", organiser: "", type: "Hackathon", domain: "Open Innovation",
  mode: "Online", city: "Online", date: "", registrationDeadline: "",
  prize: "", description: "", registrationLink: "", teamSize: "",
  eligibility: "All Students", tags: "",
};

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      // If no events yet, just set empty
      setEvents([]);
    }
    setLoadingEvents(false);
  };

  useEffect(() => {
    if (isAdmin) fetchEvents();
  }, [isAdmin]);

  // Save event
  const saveEvent = async () => {
    if (!form.name || !form.organiser || !form.date) {
      alert("Please fill in Name, Organiser and Date!");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "events"), { ...form, createdAt: serverTimestamp(), addedBy: user.email });
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
    }
    setSaving(false);
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
    setDeleting(null);
  };

  // Edit event
  const editEvent = (event) => {
    setForm({ ...EMPTY_FORM, ...event });
    setEditingId(event.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredEvents = events.filter(e =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.organiser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // Not logged in
  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 40 }}>🔐</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Please log in to access admin</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>Log in</button>
    </div>
  );

  // Not admin
  if (!isAdmin) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚫</div>
      <div style={{ fontSize: 18, color: "#fff", fontWeight: 600 }}>Access Denied</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>You don't have admin permissions</div>
      <button onClick={() => navigate("/")} style={{ padding: "10px 24px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>Go Home</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea, select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; padding: 10px 14px; font-size: 13px; width: 100%; outline: none; font-family: inherit; transition: border 0.2s; }
        input:focus, textarea:focus, select:focus { border-color: rgba(139,124,246,0.6); }
        select option { background: #1a1a2e; }
        ::placeholder { color: rgba(255,255,255,0.25); }
        label { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 5px; display: block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .event-row:hover { background: rgba(255,255,255,0.04) !important; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 8px 18px; font-size: 13px; font-weight: 500; border-radius: 999px; transition: all 0.2s; }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,8,12,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>Collab<span style={{ color: "#8B7CF6" }}>rix</span> India</span>
          <div style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)", color: "#A899F0", fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 999, marginLeft: 4 }}>ADMIN</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/events")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "7px 16px", borderRadius: 999, fontSize: 12, cursor: "pointer" }}>View Events →</button>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "7px 16px", borderRadius: 999, fontSize: 12, cursor: "pointer" }}>Home</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* Saved Toast */}
        {saved && (
          <div style={{ position: "fixed", top: 80, right: 24, zIndex: 200, background: "rgba(29,158,117,0.2)", border: "1px solid rgba(29,158,117,0.4)", color: "#5DCAA5", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, animation: "fadeIn 0.3s ease" }}>
            ✓ Event {editingId ? "updated" : "added"} successfully!
          </div>
        )}

        {/* Header */}
        <div style={{ paddingTop: 32, marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Admin Dashboard</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>Event Manager</h1>
            <button
              onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditingId(null); }}
              style={{ padding: "10px 22px", borderRadius: 999, fontSize: 13, fontWeight: 500, background: showForm ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #5340C8, #7B6EE0)", color: showForm ? "rgba(255,255,255,0.5)" : "#fff", border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none", cursor: "pointer" }}
            >
              {showForm ? "✕ Cancel" : "+ Add New Event"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total Events", value: events.length, color: "#8B7CF6" },
            { label: "Hackathons", value: events.filter(e => e.type === "Hackathon").length, color: "#5340C8" },
            { label: "Startup Meets", value: events.filter(e => e.type === "Startup Meet").length, color: "#1D9E75" },
            { label: "Online", value: events.filter(e => e.mode === "Online").length, color: "#EF9F27" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,124,246,0.25)", borderRadius: 16, padding: "24px", marginBottom: 28, animation: "fadeIn 0.3s ease" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              {editingId ? "✏️ Edit Event" : "➕ Add New Event"}
            </div>

            {/* Row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div>
                <label>Event Name *</label>
                <input type="text" placeholder="e.g. Smart India Hackathon 2026" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label>Organiser *</label>
                <input type="text" placeholder="e.g. Government of India" value={form.organiser} onChange={e => setForm(p => ({ ...p, organiser: e.target.value }))} />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div>
                <label>Event Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Domain</label>
                <select value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label>Mode</label>
                <select value={form.mode} onChange={e => setForm(p => ({ ...p, mode: e.target.value }))}>
                  {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label>City / Location</label>
                <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div>
                <label>Event Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label>Registration Deadline</label>
                <input type="date" value={form.registrationDeadline} onChange={e => setForm(p => ({ ...p, registrationDeadline: e.target.value }))} />
              </div>
              <div>
                <label>Prize Pool</label>
                <input type="text" placeholder="e.g. ₹1,00,000 or Global Recognition" value={form.prize} onChange={e => setForm(p => ({ ...p, prize: e.target.value }))} />
              </div>
              <div>
                <label>Team Size</label>
                <input type="text" placeholder="e.g. 2-4 members" value={form.teamSize} onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))} />
              </div>
            </div>

            {/* Row 4 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label>Registration Link</label>
                <input type="url" placeholder="https://devfolio.co/event/..." value={form.registrationLink} onChange={e => setForm(p => ({ ...p, registrationLink: e.target.value }))} />
              </div>
              <div>
                <label>Eligibility</label>
                <input type="text" placeholder="e.g. All Students, B.Tech only" value={form.eligibility} onChange={e => setForm(p => ({ ...p, eligibility: e.target.value }))} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <label>Description</label>
              <textarea placeholder="Describe the event — what it's about, who should apply, what they'll win..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ resize: "vertical" }} />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 20 }}>
              <label>Tags (comma separated)</label>
              <input type="text" placeholder="e.g. AI, sustainability, beginner-friendly" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
            </div>

            {/* Save Button */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={saveEvent} disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: 12, fontSize: 14, fontWeight: 500, color: "#fff", border: "none", background: "linear-gradient(135deg, #5340C8, #7B6EE0)", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 0 20px rgba(83,64,200,0.3)" }}>
                {saving ? "Saving..." : editingId ? "✓ Update Event" : "✓ Add Event"}
              </button>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null); }} style={{ padding: "12px 24px", borderRadius: 12, fontSize: 14, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Events List */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>

          {/* Table Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
              All Events <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>({filteredEvents.length})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 12px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 12, width: 140, padding: 0, borderRadius: 0 }} />
              </div>
            </div>
          </div>

          {/* Loading */}
          {loadingEvents && (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              Loading events...
            </div>
          )}

          {/* Empty State */}
          {!loadingEvents && events.length === 0 && (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 16, color: "#fff", marginBottom: 8 }}>No events yet!</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Click "Add New Event" to add your first event</div>
              <button onClick={() => setShowForm(true)} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>
                + Add First Event
              </button>
            </div>
          )}

          {/* Events Table */}
          {!loadingEvents && filteredEvents.length > 0 && (
            <div>
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="event-row" style={{ padding: "16px 20px", borderBottom: index < filteredEvents.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", display: "flex", alignItems: "center", gap: 16, transition: "background 0.2s" }}>

                  {/* Event Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{event.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(83,64,200,0.2)", color: "#A899F0", border: "1px solid rgba(139,124,246,0.3)" }}>{event.type}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>{event.mode}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>🏢 {event.organiser}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📅 {event.date}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📍 {event.city}</span>
                      {event.prize && <span style={{ fontSize: 11, color: "#EF9F27" }}>🏆 {event.prize}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => editEvent(event)} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(83,64,200,0.2)"; e.currentTarget.style.color = "#A899F0"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    >✏️ Edit</button>
                    <button onClick={() => deleteEvent(event.id)} disabled={deleting === event.id} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.2)", color: "#F09595", cursor: "pointer", opacity: deleting === event.id ? 0.5 : 1 }}>
                      {deleting === event.id ? "..." : "🗑 Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Popular Events */}
        {events.length === 0 && !loadingEvents && (
          <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8B7CF6", marginBottom: 12 }}>💡 Quick start — Add these popular events</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                "Smart India Hackathon 2026",
                "ETHIndia 2026",
                "Google Solution Challenge",
                "iStart Startup Meet Bangalore",
                "HackWithInfy 2026",
              ].map(name => (
                <button key={name} onClick={() => { setForm(p => ({ ...p, name })); setShowForm(true); }} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,124,246,0.4)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                >+ {name}</button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}