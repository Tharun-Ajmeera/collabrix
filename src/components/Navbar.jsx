import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

// Page titles for each route
const PAGE_TITLES = {
  "/": "Home",
  "/events": "Events",
  "/teammates": "Find Teammates",
  "/reels": "Reels",
  "/profile": "My Profile",
  "/inbox": "Messages",
  "/admin": "Admin Panel",
  "/create-team": "Create Team",
  "/onboarding": "Setup Profile",
};

export default function Navbar({ title, hideBack = false, rightContent = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pageTitle = title || PAGE_TITLES[location.pathname] || "Collabrix India";

  const isHome = location.pathname === "/";
  const canGoBack = !isHome && !hideBack;

  const NAV_LINKS = [
    { label: "Events", path: "/events" },
    { label: "Teammates", path: "/teammates" },
    { label: "Reels", path: "/reels" },
    { label: "Messages", path: "/inbox" },
  ];

  return (
    <>
      <style>{`
        .navbar-link { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 13px; cursor: pointer; padding: 7px 14px; border-radius: 999px; transition: all 0.2s; white-space: nowrap; font-family: inherit; }
        .navbar-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .navbar-link.active { color: #A899F0; background: rgba(83,64,200,0.15); }
        .dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: rgba(16,16,28,0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 8px; min-width: 180px; z-index: 200; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: background 0.15s; font-size: 13px; color: rgba(255,255,255,0.7); border: none; background: none; width: 100%; font-family: inherit; text-align: left; }
        .dropdown-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        @media (max-width: 768px) { .desktop-links { display: none !important; } }
        @media (min-width: 769px) { .mobile-menu { display: none !important; } }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        background: "rgba(8,8,12,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>

        {/* LEFT — Logo + Back + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>

          {/* Back button */}
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "7px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5, flexShrink: 0, fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >
              ← Back
            </button>
          )}

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("/")}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 46 46" fill="none">
                <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
                <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
                <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
                <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", letterSpacing: "-0.4px" }}>
              Collab<span style={{ color: "#8B7CF6" }}>rix</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}> India</span>
            </span>
          </div>

          {/* Page title on mobile */}
          {pageTitle && !isHome && (
            <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="mobile-menu">
              / {pageTitle}
            </span>
          )}
        </div>

        {/* CENTER — Desktop nav links */}
        <div className="desktop-links" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`navbar-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* RIGHT — Profile + Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {/* Custom right content */}
          {rightContent}

          {user ? (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              {/* Profile avatar button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ background: "none", border: "2px solid rgba(139,124,246,0.4)", borderRadius: "50%", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#8B7CF6"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(139,124,246,0.4)"}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} style={{ width: 34, height: 34, borderRadius: "50%", display: "block" }} />
                ) : (
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#5340C8,#8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {user.displayName?.charAt(0)}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="dropdown">
                  {/* User info */}
                  <div style={{ padding: "10px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{user.displayName}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{user.email}</div>
                  </div>

                  <button className="dropdown-item" onClick={() => { navigate("/profile"); setShowDropdown(false); }}>
                    <span>👤</span> My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate("/inbox"); setShowDropdown(false); }}>
                    <span>💬</span> Messages
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate("/create-team"); setShowDropdown(false); }}>
                    <span>👥</span> Create Team
                  </button>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 6, paddingTop: 6 }}>
                    <button className="dropdown-item" onClick={async () => {
                      const { auth } = await import("../firebase");
                      const { signOut } = await import("firebase/auth");
                      await signOut(auth);
                      navigate("/");
                      setShowDropdown(false);
                    }} style={{ color: "#F09595" }}>
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/login")}
              style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 18px", borderRadius: 999, fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
              Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
}