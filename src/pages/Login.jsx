import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/profile");
    } catch (err) {
      setError("Login failed. Please try again!");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="30" height="30" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" }}>
            Collab<span style={{ color: "#8B7CF6" }}>rix</span> India
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
            Discover. Connect. Compete.
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 8, letterSpacing: "-0.5px" }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.6 }}>
            Sign in to find teammates, discover events and watch knowledge reels.
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "13px 20px", borderRadius: 12,
              background: loading ? "rgba(255,255,255,0.05)" : "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s", marginBottom: 16,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#f5f5f5"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#fff"; }}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span style={{ fontSize: 14, fontWeight: 500, color: loading ? "rgba(255,255,255,0.4)" : "#1a1a1a" }}>
              {loading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          {/* Error */}
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#F09595", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              By signing in you agree to our Terms & Privacy Policy
            </span>
          </div>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span
            onClick={() => navigate("/")}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#8B7CF6"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
          >
            ← Back to home
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}