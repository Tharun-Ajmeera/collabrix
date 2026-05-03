import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../useAuth";
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

const TYPE_ICONS = {
  "Hackathon": "🏆",
  "Startup Meet": "🚀",
  "Tech Talk": "🎤",
  "Workshop": "🛠",
  "College Fest": "🎓",
  "Coding Contest": "💻",
  "Internship Drive": "💼",
  "Open Source Sprint": "🌐",
  "Bootcamp": "📚",
  "Networking Event": "🤝",
};

function CountdownTimer({ dateStr }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const target = new Date(dateStr);
      const diff = target - now;
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };
    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [dateStr]);

  if (timeLeft.expired) return (
    <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#F09595", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
      ⏰ Registration Closed
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {[["Days", timeLeft.days], ["Hours", timeLeft.hours], ["Mins", timeLeft.minutes]].map(([label, val]) => (
        <div key={label} style={{ flex: 1, textAlign: "center", background: "rgba(83,64,200,0.15)", border: "1px solid rgba(139,124,246,0.3)", borderRadius: 10, padding: "10px 8px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{String(val).padStart(2, "0")}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docSnap = await getDoc(doc(db, "events", id));
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch { return dateStr; }
  };

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today!";
    return `${days} days left`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // Not found
  if (!event) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48 }}>😕</div>
      <div style={{ fontSize: 18, color: "#fff" }}>Event not found!</div>
      <button onClick={() => navigate("/events")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>← Back to Events</button>
    </div>
  );

  const color = TYPE_COLORS[event.type] || "#5340C8";
  const icon = TYPE_ICONS[event.type] || "📋";
  const deadlineDaysLeft = getDaysLeft(event.registrationDeadline);

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .info-row { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .info-row:last-child { border-bottom: none; }
        .desktop-nav-btns { display: flex; gap: 12px; }
        @media (max-width: 768px) { 
        .desktop-nav-btns { display: none; }
        .event-detail-grid { grid-template-columns: 1fr !important; }
}
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,8,12,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/events")}>
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
          <button onClick={() => navigate("/events")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>← All Events</button>
          <button onClick={() => navigate("/teammates")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>Find Teammates</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 100px", animation: "fadeIn 0.4s ease" }}>

        {/* Back Button */}
        <button onClick={() => navigate("/events")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 24, marginTop: 24, padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
        >
          ← Back to Events
        </button>

        <div className="event-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24,      alignItems:  "start" }}>

          {/* LEFT COLUMN */}
          <div>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: `${color}22`, color, border: `1px solid ${color}44` }}>{event.type}</span>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{event.mode}</span>
                    {event.domain && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>{event.domain}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>by {event.organiser}</div>
                </div>
              </div>

              <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 16 }}>
                {event.name}
              </h1>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => setSaved(!saved)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 999, fontSize: 13, background: saved ? "rgba(239,159,39,0.15)" : "rgba(255,255,255,0.05)", border: saved ? "1px solid rgba(239,159,39,0.4)" : "1px solid rgba(255,255,255,0.1)", color: saved ? "#EF9F27" : "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }}>
                  {saved ? "★ Saved" : "☆ Save"}
                </button>
                <button onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 999, fontSize: 13, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }}>
                  {copied ? "✓ Copied!" : "🔗 Share"}
                </button>
                <button onClick={() => navigate("/teammates")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 999, fontSize: 13, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", cursor: "pointer" }}>
                  👥 Find Teammates
                </button>
              </div>
            </div>

            {/* About */}
            {event.description && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>About this Event</h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{event.description}</p>
              </div>
            )}

            {/* Event Details */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Event Details</h2>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 16px" }}>
                {[
                  ["📅", "Event Date", formatDate(event.date)],
                  event.registrationDeadline && ["⏰", "Registration Deadline", `${formatDate(event.registrationDeadline)} ${deadlineDaysLeft ? `(${deadlineDaysLeft})` : ""}`],
                  ["📍", "Location", event.city],
                  ["🌐", "Mode", event.mode],
                  event.teamSize && ["👥", "Team Size", event.teamSize],
                  event.eligibility && ["🎓", "Eligibility", event.eligibility],
                  event.prize && ["🏆", "Prize Pool", event.prize],
                ].filter(Boolean).map(([icon, label, val]) => (
                  <div key={label} className="info-row">
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, color: label === "Prize Pool" ? "#EF9F27" : "#fff", fontWeight: label === "Prize Pool" ? 600 : 400 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {event.tags && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Tags</h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {event.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Find Teammates CTA */}
            <div style={{ background: "rgba(83,64,200,0.1)", border: "1px solid rgba(139,124,246,0.25)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Looking for teammates? 👥</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Find students with the right skills for this event</div>
              </div>
              <button onClick={() => navigate("/teammates")} style={{ padding: "10px 20px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
                Find Teammates →
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Register Card */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "24px", overflow: "hidden" }}>

              {/* Prize highlight */}
              {event.prize && (
                <div style={{ textAlign: "center", marginBottom: 20, padding: "16px", background: `${color}15`, borderRadius: 12, border: `1px solid ${color}33` }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Prize Pool</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#EF9F27", letterSpacing: "-0.5px" }}>{event.prize}</div>
                </div>
              )}

              {/* Countdown */}
              {event.registrationDeadline && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textAlign: "center" }}>Registration closes in</div>
                  <CountdownTimer dateStr={event.registrationDeadline} />
                </div>
              )}

              {/* Register Button */}
              {event.registrationLink ? (
                <a href={event.registrationLink} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none", textAlign: "center", background: `linear-gradient(135deg, ${color}, ${color}CC)`, boxShadow: `0 0 24px ${color}44`, transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Register Now →
                </a>
              ) : (
                <button style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600, color: "#fff", border: "none", background: `linear-gradient(135deg, ${color}, ${color}CC)`, cursor: "pointer" }}>
                  View Details →
                </button>
              )}

              {/* Quick info */}
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["📅", event.date ? formatDate(event.date) : "TBA"],
                  ["📍", event.city || "Online"],
                  event.teamSize && ["👥", event.teamSize],
                  event.eligibility && ["🎓", event.eligibility],
                ].filter(Boolean).map(([icon, val]) => (
                  <div key={val} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <button onClick={copyLink} style={{ marginTop: 16, width: "100%", padding: "10px", borderRadius: 10, fontSize: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }}>
                {copied ? "✓ Link Copied!" : "🔗 Share this event"}
              </button>
            </div>
          </div>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}