import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// ── tiny helpers ──────────────────────────────────────────────────────────────
const Input = ({ label, type = "text", value, onChange, placeholder, maxLength }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      display: "block", fontSize: 12, fontWeight: 500,
      color: "rgba(255,255,255,0.45)", marginBottom: 6,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: "100%", padding: "12px 14px", borderRadius: 10,
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff", fontSize: 14, outline: "none", transition: "border 0.2s",
        fontFamily: "inherit",
      }}
      onFocus={e => (e.target.style.borderColor = "rgba(83,64,200,0.7)")}
      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
    />
  </div>
);

const PrimaryBtn = ({ onClick, disabled, children, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      width: "100%", padding: "13px 20px", borderRadius: 12,
      background: disabled || loading
        ? "rgba(83,64,200,0.4)"
        : "linear-gradient(135deg,#5340C8,#7B5CF0)",
      border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
      cursor: disabled || loading ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      transition: "opacity 0.2s", letterSpacing: "0.01em", fontFamily: "inherit",
    }}
    onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.opacity = "0.88"; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
  >
    {loading ? <Spinner size={16} color="#fff" /> : children}
  </button>
);

const Spinner = ({ size = 28, color = "#5340C8" }) => (
  <div style={{
    width: size, height: size,
    border: `2.5px solid ${color}33`,
    borderTopColor: color,
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
    flexShrink: 0,
  }} />
);

const ErrorBox = ({ msg }) => (
  <div style={{
    padding: "10px 14px", borderRadius: 8,
    background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.25)",
    color: "#F09595", fontSize: 13, marginBottom: 14, textAlign: "center",
  }}>
    {msg}
  </div>
);

const BackBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "none", border: "none", color: "rgba(255,255,255,0.35)",
      fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0,
      display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
    }}
    onMouseEnter={e => (e.currentTarget.style.color = "#8B7CF6")}
    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
  >
    ← Back
  </button>
);

// ── main component ────────────────────────────────────────────────────────────
export default function Login() {
  const [tab, setTab]                   = useState("signin");
  const [method, setMethod]             = useState("options");

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPass, setConfirmPass]   = useState("");

  const [phone, setPhone]               = useState("+91"); // pre-filled
  const [otp, setOtp]                   = useState("");
  const [otpSent, setOtpSent]           = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);

  const [loading, setLoading]           = useState(true); // true until auth resolves
  const [error, setError]               = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  // ── KEY FIX: navigate when Firebase auth resolves (handles mobile redirect) ──
  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    } else {
      setLoading(false);
    }
  }, [user]);

  // reset errors on tab/method switch
  useEffect(() => { setError(""); }, [tab, method]);

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true); setError("");
    try {
      if (isMobile) {
        // Redirect flow: page reloads → useAuth picks up session → useEffect navigates
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(friendlyError(err.code));
      setLoading(false);
    }
  };

  // ── Email / Password ─────────────────────────────────────────────────────────
  const handleEmail = async () => {
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    if (tab === "signup" && password !== confirmPass) return setError("Passwords don't match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (tab === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error(err);
      setError(friendlyError(err.code));
      setLoading(false);
    }
  };

  // ── Phone OTP ────────────────────────────────────────────────────────────────
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendOtp = async () => {
    setError("");
    let cleaned = phone.trim();
    // auto-fix: 919XXXXXXXX → +919XXXXXXXX
    if (!cleaned.startsWith("+") && cleaned.startsWith("91")) cleaned = "+" + cleaned;
    if (!cleaned.startsWith("+") || cleaned.replace(/\D/g, "").length < 10) {
      return setError("Enter number with country code e.g. +91XXXXXXXXXX");
    }
    setLoading(true);
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, cleaned, window.recaptchaVerifier);
      setConfirmResult(result);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError(friendlyError(err.code));
      if (window.recaptchaVerifier) { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp || otp.length !== 6) return setError("Enter the 6-digit OTP.");
    setLoading(true);
    try {
      await confirmResult.confirm(otp);
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  // ── friendly errors ──────────────────────────────────────────────────────────
  const friendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":        return "No account found with this email.";
      case "auth/wrong-password":        return "Wrong password. Please try again.";
      case "auth/email-already-in-use":  return "This email is already registered. Try signing in.";
      case "auth/invalid-email":         return "Please enter a valid email address.";
      case "auth/too-many-requests":     return "Too many attempts. Please wait a moment.";
      case "auth/invalid-phone-number":  return "Invalid number. Use format +91XXXXXXXXXX.";
      case "auth/popup-closed-by-user":  return "Popup was closed. Please try again.";
      default:                           return "Something went wrong. Please try again.";
    }
  };

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#08080C",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #111 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px", animation: "fadeIn 0.35s ease" }}>

        {/* ── Logo ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, background: "#EEF2FF",
            border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 14px",
          }}>
            <svg width="32" height="32" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
            Collab<span style={{ color: "#8B7CF6" }}>rix</span> India
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 5, letterSpacing: "0.06em" }}>
            DISCOVER · CONNECT · COMPETE
          </div>
        </div>

        {/* ── Card ── */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "28px 28px 24px",
        }}>

          {/* ── Tabs ── */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.05)",
            borderRadius: 10, padding: 4, marginBottom: 24,
          }}>
            {["signin", "signup"].map(t => (
              <button key={t}
                onClick={() => { setTab(t); setMethod("options"); }}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
                  background: tab === t ? "#5340C8" : "transparent",
                  color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s", fontFamily: "inherit",
                }}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* ── Loading while Firebase resolves ── */}
          {loading && method === "options" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "28px 0" }}>
              <Spinner />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Signing you in…</div>
            </div>

          ) : method === "options" ? (
            <>
              {/* Google */}
              <button onClick={handleGoogle} disabled={loading}
                style={{
                  width: "100%", padding: "12px 20px", borderRadius: 12, background: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  cursor: "pointer", transition: "background 0.2s", marginBottom: 12, fontFamily: "inherit",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0f0f0")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>Continue with Google</span>
              </button>

              {/* Email */}
              <button onClick={() => setMethod("email")}
                style={{
                  width: "100%", padding: "12px 20px", borderRadius: 12,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  cursor: "pointer", transition: "background 0.2s", marginBottom: 12,
                  color: "#fff", fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Continue with Email
              </button>

              {/* Phone */}
              <button onClick={() => setMethod("phone")}
                style={{
                  width: "100%", padding: "12px 20px", borderRadius: 12,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  cursor: "pointer", transition: "background 0.2s",
                  color: "#fff", fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
                Continue with Phone (OTP)
              </button>

              {error && <div style={{ marginTop: 12 }}><ErrorBox msg={error} /></div>}

              <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.5 }}>
                By continuing you agree to our Terms &amp; Privacy Policy
              </p>
            </>

          ) : method === "email" ? (
            <>
              <BackBtn onClick={() => setMethod("options")} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>
                {tab === "signup" ? "Create your account" : "Sign in with email"}
              </h3>
              <Input label="Email" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              <Input label="Password" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {tab === "signup" && (
                <Input label="Confirm Password" type="password" value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" />
              )}
              {error && <ErrorBox msg={error} />}
              <PrimaryBtn onClick={handleEmail} loading={loading}>
                {tab === "signup" ? "Create Account" : "Sign In"}
              </PrimaryBtn>
              {tab === "signin" && (
                <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  Don't have an account?{" "}
                  <span style={{ color: "#8B7CF6", cursor: "pointer" }} onClick={() => setTab("signup")}>
                    Sign up
                  </span>
                </p>
              )}
            </>

          ) : method === "phone" ? (
            <>
              <BackBtn onClick={() => { setMethod("options"); setOtpSent(false); setPhone("+91"); setOtp(""); }} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>
                {otpSent ? "Enter OTP" : "Sign in with phone"}
              </h3>
              {!otpSent ? (
                <>
                  <Input label="Phone Number" type="tel" value={phone}
                    onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" />
                  {error && <ErrorBox msg={error} />}
                  <div id="recaptcha-container" />
                  <PrimaryBtn onClick={handleSendOtp} loading={loading}>Send OTP</PrimaryBtn>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
                    OTP sent to <strong style={{ color: "rgba(255,255,255,0.7)" }}>{phone}</strong>.{" "}
                    <span style={{ color: "#8B7CF6", cursor: "pointer" }}
                      onClick={() => { setOtpSent(false); setOtp(""); }}>Change</span>
                  </p>
                  <Input label="6-Digit OTP" type="number" value={otp}
                    onChange={e => setOtp(e.target.value.slice(0, 6))} placeholder="• • • • • •" maxLength={6} />
                  {error && <ErrorBox msg={error} />}
                  <PrimaryBtn onClick={handleVerifyOtp} loading={loading}>Verify &amp; Continue</PrimaryBtn>
                </>
              )}
            </>
          ) : null}
        </div>

        {/* ── Back to home ── */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span onClick={() => navigate("/")}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.28)", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => (e.target.style.color = "#8B7CF6")}
            onMouseLeave={e => (e.target.style.color = "rgba(255,255,255,0.28)")}
          >
            ← Back to home
          </span>
        </div>

      </div>
    </div>
  );
}
