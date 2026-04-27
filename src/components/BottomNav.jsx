import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../useAuth";

const TABS = [
  { label: "Home", icon: "🏠", path: "/" },
  { label: "Events", icon: "🎪", path: "/events" },
  { label: "Squad", icon: "👥", path: "/teammates" },
  { label: "Reels", icon: "🎬", path: "/reels" },
  { label: "Profile", icon: "👤", path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleTab = (tab) => {
    if (tab.path === "/profile" && !user) {
      navigate("/login");
      return;
    }
    navigate(tab.path);
  };

  return (
    <>
      {/* Only show on mobile */}
      <style>{`
        .bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 200;
            background: rgba(12, 12, 20, 0.97);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255,255,255,0.08);
            padding: 8px 0 20px;
          }
          .bottom-nav-spacer {
            display: block;
            height: 80px;
          }
        }
        @media (min-width: 769px) {
          .bottom-nav-spacer {
            display: none;
          }
        }
      `}</style>

      <div className="bottom-nav">
        {TABS.map(tab => {
          const isActive = location.pathname === tab.path ||
            (tab.path === "/profile" && location.pathname === "/login");
          return (
            <div
              key={tab.path}
              onClick={() => handleTab(tab)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                padding: "4px 0",
                transition: "all 0.2s",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                background: isActive ? "rgba(83,64,200,0.25)" : "transparent",
                transition: "all 0.2s",
                fontSize: 18,
              }}>
                {tab.path === "/profile" && user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: isActive ? "2px solid #8B7CF6" : "2px solid rgba(255,255,255,0.2)",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 16 }}>{tab.icon}</span>
                )}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#8B7CF6" : "rgba(255,255,255,0.35)",
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spacer so content isn't hidden behind bottom nav */}
      <div className="bottom-nav-spacer" />
    </>
  );
}