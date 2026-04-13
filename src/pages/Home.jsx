import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["Events", "Find Teammates", "Reels", "About"];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 2rem", height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(8,8,12,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 46 46" fill="none">
            <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
            <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
            <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
            <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>
        <span style={{ fontSize: 18, fontWeight: 500, color: "#fff", letterSpacing: "-0.4px" }}>
          Collab<span style={{ color: "#8B7CF6" }}>rix</span> India
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-links-desktop">
        {NAV_LINKS.map((l) => (
          <a key={l} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
          >{l}</a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Log in</a>
        <button
          onClick={() => navigate("/profile")}
          style={{
            fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 18px", borderRadius: 999, cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >My Profile</button>
        <a href="#signup" style={{
          fontSize: 13, fontWeight: 500, color: "#fff", textDecoration: "none",
          padding: "8px 18px", borderRadius: 999,
          background: "linear-gradient(135deg, #5340C8, #7B6EE0)",
          border: "1px solid rgba(139,124,246,0.4)",
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >Get early access</a>
      </div>
    </nav>
  );
}

function FloatingOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(83,64,200,0.18) 0%, transparent 70%)",
        top: "-150px", left: "50%", transform: "translateX(-50%)",
        animation: "orb1 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,124,246,0.12) 0%, transparent 70%)",
        top: "200px", right: "-100px",
        animation: "orb2 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(83,64,200,0.1) 0%, transparent 70%)",
        top: "300px", left: "-80px",
        animation: "orb3 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
}

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 24px 80px", textAlign: "center",
      position: "relative",
    }}>
      <FloatingOrbs />

      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease", transitionDelay: "0.1s",
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 14px", borderRadius: 999, marginBottom: 28,
        background: "rgba(83,64,200,0.15)", border: "1px solid rgba(139,124,246,0.3)",
        fontSize: 12, color: "#8B7CF6", fontWeight: 500, letterSpacing: "0.02em",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B7CF6", display: "inline-block", animation: "pulse 2s infinite" }} />
        India's student knowledge & competition super-app
      </div>

      <h1 style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.8s ease", transitionDelay: "0.2s",
        fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 600,
        lineHeight: 1.08, letterSpacing: "-2px",
        color: "#fff", margin: "0 0 12px",
      }}>
        Discover. Connect.
      </h1>
      <h1 style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.8s ease", transitionDelay: "0.3s",
        fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 600,
        lineHeight: 1.08, letterSpacing: "-2px",
        background: "linear-gradient(135deg, #8B7CF6, #5340C8, #A899F0)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        margin: "0 0 28px",
      }}>
        Compete.
      </h1>

      <p style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease", transitionDelay: "0.4s",
        fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 520,
        lineHeight: 1.75, margin: "0 0 40px",
      }}>
        Find hackathons, build your skill profile, form teams across India,
        and grow through pure knowledge reels — all in one place.
      </p>

      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease", transitionDelay: "0.5s",
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
      }}>
        <a href="#signup" style={{
          padding: "13px 28px", borderRadius: 999, fontSize: 14, fontWeight: 500,
          color: "#fff", textDecoration: "none",
          background: "linear-gradient(135deg, #5340C8, #7B6EE0)",
          border: "1px solid rgba(139,124,246,0.5)",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 0 30px rgba(83,64,200,0.3)",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(83,64,200,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(83,64,200,0.3)"; }}
        >
          Get early access →
        </a>
        <a href="#features" style={{
          padding: "13px 28px", borderRadius: 999, fontSize: 14, fontWeight: 500,
          color: "rgba(255,255,255,0.6)", textDecoration: "none",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          See how it works
        </a>
      </div>

      <div style={{
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease", transitionDelay: "0.7s",
        display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap", justifyContent: "center",
      }}>
        {[["500+", "Events listed"], ["10K+", "Students joining"], ["Pan-India", "Coverage"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>{val}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { title: "Discover events", desc: "Browse hackathons, college fests and competitions from across India filtered by domain and city.", icon: "📋" },
  { title: "Find your squad", desc: "Build a skill profile and connect with talented students across cities based on actual skills.", icon: "👥" },
  { title: "Compete together", desc: "Form your team, apply to events directly and track your competition journey all in one place.", icon: "🏆" },
  { title: "Knowledge reels", desc: "Scroll through pure tech knowledge — tutorials, news, tips. No distraction, only growth.", icon: "🎬" },
  { title: "Follow creators", desc: "Follow your favourite tech creators and share your own knowledge within India's student community.", icon: "✨" },
  { title: "Build portfolio", desc: "Showcase your skills, hackathon wins and projects. Your personal brand as a student developer.", icon: "🚀" },
];

function FeatureCard({ feature, index }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      padding: "28px", borderRadius: 16,
      background: hovered ? "rgba(83,64,200,0.12)" : "rgba(255,255,255,0.03)",
      border: hovered ? "1px solid rgba(139,124,246,0.4)" : "1px solid rgba(255,255,255,0.07)",
      cursor: "default",
      transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, background 0.3s, border 0.3s`,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: 28, marginBottom: 16 }}>{feature.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 8 }}>{feature.title}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{feature.desc}</div>
    </div>
  );
}

function Features() {
  const [ref, inView] = useInView();
  return (
    <section id="features" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} style={{
        textAlign: "center", marginBottom: 56,
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease",
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Everything you need</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", margin: "0 0 12px" }}>Built for Indian students</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto" }}>One platform to discover, connect, learn and compete.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Create your profile", desc: "Add your skills, college, year and domain." },
    { num: "02", title: "Browse events", desc: "Discover hundreds of hackathons filtered by interest." },
    { num: "03", title: "Find teammates", desc: "Search students by skill across India. One tap to connect." },
    { num: "04", title: "Compete & grow", desc: "Apply together, win together, share your journey." },
  ];
  const [ref, inView] = useInView();
  return (
    <section style={{ padding: "80px 24px", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent, rgba(83,64,200,0.05), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7CF6", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", margin: 0 }}>From zero to competing</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              padding: "28px 24px",
              background: "rgba(255,255,255,0.02)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              borderLeft: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
              borderRight: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "rgba(139,124,246,0.2)", marginBottom: 16, letterSpacing: "-1px" }}>{s.num}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ref, inView] = useInView();

  return (
    <section id="signup" style={{ padding: "100px 24px", textAlign: "center" }}>
      <div ref={ref} style={{
        maxWidth: 560, margin: "0 auto",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s ease",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: 16, marginBottom: 24,
          background: "rgba(83,64,200,0.15)", border: "1px solid rgba(139,124,246,0.3)",
        }}>
          <svg width="28" height="28" viewBox="0 0 46 46" fill="none">
            <circle cx="11" cy="23" r="6.5" fill="#8B7CF6" />
            <circle cx="35" cy="11" r="6.5" fill="#8B7CF6" opacity="0.55" />
            <circle cx="35" cy="35" r="6.5" fill="#8B7CF6" opacity="0.55" />
            <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#8B7CF6" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#8B7CF6" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "#fff", letterSpacing: "-1px", margin: "0 0 16px" }}>
          Be the first to join
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, margin: "0 0 36px" }}>
          Collabrix India is launching soon. Get early access and be part of India's first student knowledge & competition super-app.
        </p>

        {submitted ? (
          <div style={{
            padding: "16px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500,
            background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.4)",
            color: "#A899F0", animation: "fadeIn 0.5s ease",
          }}>
            You're on the list! We'll notify you when Collabrix India launches 🎉
          </div>
        ) : (
          <div style={{
            display: "flex", gap: 10, maxWidth: 440, margin: "0 auto",
            padding: "6px 6px 6px 18px", borderRadius: 999,
            background: "rgba(255,255,255,0.04)",
            border: focused ? "1px solid rgba(139,124,246,0.6)" : "1px solid rgba(255,255,255,0.1)",
            transition: "border 0.2s",
            boxShadow: focused ? "0 0 24px rgba(83,64,200,0.2)" : "none",
          }}>
            <input
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === "Enter" && email.includes("@") && setSubmitted(true)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 14, color: "#fff", minWidth: 0,
              }}
            />
            <button
              onClick={() => email.includes("@") && setSubmitted(true)}
              style={{
                padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                color: "#fff", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #5340C8, #7B6EE0)",
                transition: "opacity 0.2s", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Get early access
            </button>
          </div>
        )}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 14 }}>No spam. Just your launch notification.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Collab<span style={{ color: "#8B7CF6" }}>rix</span> India</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 Collabrix India. Built for Indian students. 🇮🇳</p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#8B7CF6"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes orb1 { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-30px)} }
        @keyframes orb2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(20px)} }
        @keyframes orb3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .nav-links-desktop { display: flex; }
        @media (max-width: 768px) { .nav-links-desktop { display: none; } }
      `}</style>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Signup />
      <Footer />
    </div>
  );
}