import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function Reels() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .shimmer {
          background: linear-gradient(90deg, #5340C8, #8B7CF6, #A899F0, #5340C8);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .feature-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 18px; border-radius: 999px;
          font-size: 13px; font-weight: 500;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          transition: all 0.2s;
        }
        .notify-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 999px;
          font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #5340C8, #7B6EE0);
          color: #fff; border: none; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 0 30px rgba(83,64,200,0.4);
          transition: all 0.3s;
        }
        .notify-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(83,64,200,0.5); }
      `}</style>

      <Navbar />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", position: "relative", overflow: "hidden" }}>

        {/* Background orbs */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(83,64,200,0.15) 0%, transparent 70%)", pointerEvents: "none", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,159,39,0.1) 0%, transparent 70%)", pointerEvents: "none", animation: "float 10s ease-in-out infinite 2s" }} />

        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", mask: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 620, width: "100%", textAlign: "center", position: "relative", zIndex: 1, animation: "fadeIn 0.6s ease" }}>

          {/* Lock icon with glow */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: 28, background: "linear-gradient(135deg, rgba(83,64,200,0.3), rgba(139,124,246,0.1))", border: "1px solid rgba(139,124,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, animation: "float 4s ease-in-out infinite", boxShadow: "0 0 40px rgba(83,64,200,0.3)" }}>
              🔒
            </div>
            {/* Orbiting dots */}
            <div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#EF9F27", border: "2px solid #08080C", animation: "pulse 2s infinite" }} />
            <div style={{ position: "absolute", bottom: -4, left: -4, width: 14, height: 14, borderRadius: "50%", background: "#5340C8", border: "2px solid #08080C", animation: "pulse 2s infinite 1s" }} />
          </div>

          {/* Coming soon badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,159,39,0.15)", border: "1px solid rgba(239,159,39,0.35)", borderRadius: 999, padding: "6px 16px", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF9F27", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "#EF9F27", fontWeight: 600 }}>Coming Soon — Big Launch!</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, color: "#fff", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 16 }}>
            Knowledge Reels<br />
            <span className="shimmer">is launching soon</span>
          </h1>

          {/* Description */}
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 36px" }}>
            We're building something special 🎬 Short knowledge reels made by students, for students — DSA, AI/ML, Web Dev, Career tips and more.
          </p>

          {/* What's coming */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
            {[
              { icon: "🧠", text: "Student-created reels" },
              { icon: "⚡", text: "Energise & save reels" },
              { icon: "🎯", text: "Topic-based filter" },
              { icon: "📱", text: "TikTok-style scroll" },
            ].map((f, i) => (
              <div key={i} className="feature-pill">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <button className="notify-btn" onClick={() => navigate("/profile")}>
              🔔 Notify me at Launch
            </button>
            <button onClick={() => navigate("/events")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              🏆 Browse Events
            </button>
          </div>

          {/* Why locked message */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", maxWidth: 440, margin: "0 auto" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 8 }}>🚀 Why is it locked?</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              We want to launch Reels as a <span style={{ color: "#EF9F27", fontWeight: 600 }}>big update</span> once our community grows. The more students join now, the better the content will be at launch! Share Collabrix India with your friends and help us get there faster 💪
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}