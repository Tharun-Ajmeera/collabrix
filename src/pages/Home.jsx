import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, start]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

const FEATURES = [
  { icon: "🏆", title: "Discover Hackathons", desc: "SIH, ETHIndia, Microsoft Imagine Cup — never miss a competition that matters.", color: "#5340C8", glow: "rgba(83,64,200,0.3)" },
  { icon: "⚡", title: "Send Collab Requests", desc: "Find students by skill. One click to collab. Build your dream team in minutes.", color: "#EF9F27", glow: "rgba(239,159,39,0.3)" },
  { icon: "🧠", title: "Knowledge Reels", desc: "Short reels on DSA, AI/ML, Web Dev — made by students, for students.", color: "#1D9E75", glow: "rgba(29,158,117,0.3)" },
  { icon: "💬", title: "Team Group Chat", desc: "Create a team chat for your hackathon group. Coordinate in real time.", color: "#D4537E", glow: "rgba(212,83,126,0.3)" },
];

const RECENT_ACTIVITY = [
  { avatar: "R", name: "Rahul K.", action: "joined from IIT Bombay", time: "2m ago", color: "#5340C8" },
  { avatar: "P", name: "Priya S.", action: "sent a collab request", time: "5m ago", color: "#1D9E75" },
  { avatar: "A", name: "Arjun M.", action: "saved ETHIndia 2026", time: "8m ago", color: "#EF9F27" },
  { avatar: "S", name: "Sneha R.", action: "joined from BITS Pilani", time: "12m ago", color: "#D4537E" },
  { avatar: "V", name: "Vikram P.", action: "created a team chat", time: "15m ago", color: "#7B6EE0" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, events: 0 });
  const [statsRef, statsInView] = useInView(0.3);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [activityIndex, setActivityIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const userCount = useCounter(stats.users, 1500, statsInView);
  const eventCount = useCounter(stats.events, 1500, statsInView);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, e] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "events")),
        ]);
        setStats({ users: u.size, events: e.size });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  // Rotate activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex(i => (i + 1) % RECENT_ACTIVITY.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax for hero
  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const activity = RECENT_ACTIVITY[activityIndex];

  return (
    <div style={{ minHeight: "100vh", background: "#06060E", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0px) rotate(0deg)} 33%{transform:translateY(-12px) rotate(1deg)} 66%{transform:translateY(-6px) rotate(-1deg)} }
        @keyframes pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(83,64,200,0.3)} 50%{box-shadow:0 0 40px rgba(83,64,200,0.6)} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }

        .hero-title {
          font-size: clamp(44px, 6vw, 80px);
          font-weight: 900;
          letter-spacing: -3px;
          line-height: 1.05;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #5340C8, #8B7CF6, #A899F0, #5340C8);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s;
          border-radius: 20px;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,0.15);
        }
        .feature-card:hover::before { opacity: 1; }

        .cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 999px;
          font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #5340C8, #7B6EE0);
          color: #fff; border: none; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 0 0 0 rgba(83,64,200,0.5);
          transition: all 0.3s;
          animation: glow 3s ease-in-out infinite;
        }
        .cta-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 32px rgba(83,64,200,0.5);
        }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 999px;
          font-size: 15px; font-weight: 600;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          cursor: pointer; font-family: inherit;
          transition: all 0.3s;
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          color: #fff;
          transform: translateY(-2px);
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px 32px;
          text-align: center;
          transition: all 0.3s;
          flex: 1;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-4px);
        }
        .nav-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; border: none; font-family: inherit;
          transition: all 0.2s;
        }

        @media (max-width: 768px) {
          .hero-title { letter-spacing: -2px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column !important; gap: 12px !important; }
          .cta-row { flex-direction: column !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      <Navbar hideBack={true} />

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "90px 24px 60px", overflow: "hidden" }}>

        {/* Animated background mesh */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {/* Moving orbs */}
          <div style={{ position: "absolute", top: "15%", left: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(83,64,200,0.18) 0%, transparent 65%)", transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`, transition: "transform 0.5s ease", animation: "float 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 65%)", transform: `translate(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px)`, transition: "transform 0.5s ease", animation: "float 10s ease-in-out infinite 2s" }} />
          <div style={{ position: "absolute", top: "40%", right: "20%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,83,126,0.1) 0%, transparent 65%)", animation: "float 7s ease-in-out infinite 4s" }} />

          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", mask: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)" }} />
        </div>

        <div style={{ maxWidth: 920, width: "100%", position: "relative", zIndex: 1 }}>

          {/* Live activity pill */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div key={activityIndex} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 16px", animation: "slideIn 0.4s ease" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${activity.color}, ${activity.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {activity.avatar}
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                <span style={{ color: "#fff", fontWeight: 600 }}>{activity.name}</span> {activity.action}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{activity.time}</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", animation: "pulse 2s infinite", flexShrink: 0 }} />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="hero-title" style={{ textAlign: "center", color: "#fff", marginBottom: 24 }}>
            India's home for<br />
            <span className="shimmer-text">student builders</span>
          </h1>

          <p style={{ textAlign: "center", fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 44px", fontWeight: 400 }}>
            Discover hackathons. Find teammates by skill. Watch knowledge reels. Build your team — all in one place built for Indian college students.
          </p>

          {/* CTA buttons */}
          <div className="cta-row" style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 72, flexWrap: "wrap" }}>
            <button className="cta-primary" onClick={() => navigate(user ? "/events" : "/login")}>
              {user ? "🏆 Browse Events" : "🚀 Get Started Free"}
            </button>
            <button className="cta-secondary" onClick={() => navigate("/teammates")}>
              👥 Find Teammates
            </button>
            <button className="cta-secondary" onClick={() => navigate("/reels")}>
              ⚡ Watch Reels
            </button>
          </div>

          {/* Social proof avatars */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 52 }}>
            <div style={{ display: "flex" }}>
              {["#5340C8", "#1D9E75", "#EF9F27", "#D4537E", "#7B6EE0"].map((color, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, border: "2px solid #06060E", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {["T", "P", "R", "S", "A"][i]}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              Join <span style={{ color: "#fff", fontWeight: 600 }}>students from IIT, BITS, NIT</span> and more
            </div>
          </div>

          {/* App preview cards */}
          <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, maxWidth: 800, margin: "0 auto" }}>
            {/* Event card preview */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(83,64,200,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 20 }}>🏆</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#5340C8" }}>Hackathon</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>ETHIndia 2026</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Prize: $50,000 • Bangalore</div>
              <div style={{ background: "linear-gradient(135deg,#5340C8,#7B6EE0)", borderRadius: 8, padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#fff" }}>View Details →</div>
            </div>

            {/* Teammate card preview */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(29,158,117,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1D9E75,#5DCAA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>P</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Priya Sharma</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>IIT Bombay • AI/ML</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                {["React", "Python", "ML"].map(s => <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(29,158,117,0.15)", color: "#5DCAA5", border: "1px solid rgba(29,158,117,0.3)" }}>{s}</span>)}
              </div>
              <div style={{ background: "rgba(29,158,117,0.2)", borderRadius: 8, padding: "6px 0", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#5DCAA5", border: "1px solid rgba(29,158,117,0.3)" }}>⚡ Collab</div>
            </div>

            {/* Reel card preview */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(239,159,39,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ background: "linear-gradient(160deg,#EF9F2744,#08080C)", borderRadius: 10, height: 70, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 10 }}>🤖</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>ML Roadmap 2026</div>
              <div style={{ display: "flex", alignItems: "center", justify: "space-between", gap: 6 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>32K views</span>
                <span style={{ fontSize: 18 }}>⚡</span>
                <span style={{ fontSize: 11, color: "#EF9F27", fontWeight: 600 }}>2.1K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section ref={statsRef} style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div className="stats-row" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { value: statsInView ? userCount : 0, suffix: "+", label: "Students on platform", sublabel: "and growing every day", color: "#8B7CF6", icon: "👥" },
            { value: statsInView ? eventCount : 0, suffix: "+", label: "Events listed", sublabel: "hackathons, workshops & more", color: "#5DCAA5", icon: "🏆" },
            { value: "Pan", suffix: "-India", label: "Coverage", sublabel: "from IIT to state colleges", color: "#EF9F27", icon: "🗺️" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: stat.color, letterSpacing: "-2px", lineHeight: 1 }}>
                {stat.value}{stat.suffix}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginTop: 6, marginBottom: 3 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} style={{ padding: "60px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#8B7CF6", letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(83,64,200,0.12)", border: "1px solid rgba(139,124,246,0.25)", padding: "5px 16px", borderRadius: 999, marginBottom: 16 }}>
            Everything in one app
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: 14 }}>
            Built for students who<br />want to <span className="shimmer-text">actually compete</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 460, margin: "0 auto" }}>
            No more jumping between 5 apps. Everything you need to find, form, and win — right here.
          </p>
        </div>

        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card"
              style={{ opacity: featuresInView ? 1 : 0, transform: featuresInView ? "translateY(0)" : "translateY(30px)", transition: `all 0.5s ease ${i * 0.1}s` }}
              onMouseEnter={e => { e.currentTarget.style.background = `${f.color}11`; e.currentTarget.style.borderColor = `${f.color}44`; e.currentTarget.style.boxShadow = `0 20px 40px ${f.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${f.color}20`, border: `1px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 18 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{f.desc}</p>
              <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: f.color }}>
                Explore → 
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: "40px 24px 120px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", padding: "64px 40px", textAlign: "center" }}>
          {/* Background */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(83,64,200,0.25) 0%, rgba(139,124,246,0.1) 50%, rgba(29,158,117,0.1) 100%)", border: "1px solid rgba(139,124,246,0.2)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: "#5DCAA5", fontWeight: 600 }}>Students are joining right now</span>
            </div>

            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: 14 }}>
              Your next team is<br />waiting for you 🚀
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
              Join students from IIT, BITS, NIT and top colleges across India. Find teammates, compete and win.
            </p>

            <div className="bottom-grid" style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: 12, justifyContent: "center" }}>
              <button className="cta-primary" onClick={() => navigate(user ? "/events" : "/login")}
                style={{ background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none" }}>
                {user ? "🏆 Find Events" : "🚀 Join Free"}
              </button>
              <button className="cta-secondary" onClick={() => navigate("/teammates")}>
                👥 Find Teammates
              </button>
              <button className="cta-secondary" onClick={() => navigate("/reels")}>
                ⚡ Watch Reels
              </button>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}