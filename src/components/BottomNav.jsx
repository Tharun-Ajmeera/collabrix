import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../useAuth";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const TABS = [
  { label: "Home", icon: "🏠", path: "/" },
  { label: "Events", icon: "🎪", path: "/events" },
  { label: "Squad", icon: "👥", path: "/teammates" },
  { label: "Messages", icon: "💬", path: "/inbox" },
  { label: "Profile", icon: "👤", path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for unread messages
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        total += data[`unread_${user.uid}`] || 0;
      });
      setUnreadCount(total);
    });
    return () => unsub();
  }, [user]);

  const handleTab = (tab) => {
    if ((tab.path === "/profile" || tab.path === "/inbox") && !user) {
      navigate("/login");
      return;
    }
    navigate(tab.path);
  };

  return (
    <>
      <style>{`
        .bottom-nav { display: none; }
        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 200;
            background: rgba(10, 10, 18, 0.97);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255,255,255,0.08);
            padding: 8px 0 20px;
          }
          .bottom-nav-spacer { display: block; height: 80px; }
        }
        @media (min-width: 769px) {
          .bottom-nav-spacer { display: none; }
        }
      `}</style>

      <div className="bottom-nav">
        {TABS.map(tab => {
          const isActive =
            location.pathname === tab.path ||
            (tab.path === "/inbox" && location.pathname.startsWith("/chat"));
          const showBadge = tab.path === "/inbox" && unreadCount > 0;

          return (
            <div key={tab.path} onClick={() => handleTab(tab)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 0", transition: "all 0.2s" }}>

              {/* Icon container */}
              <div style={{ width: 44, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, background: isActive ? "rgba(83,64,200,0.25)" : "transparent", transition: "all 0.2s", position: "relative" }}>

                {/* Profile photo */}
                {tab.path === "/profile" && user?.photoURL ? (
                  <img src={user.photoURL} alt="profile" style={{ width: 24, height: 24, borderRadius: "50%", border: isActive ? "2px solid #8B7CF6" : "2px solid rgba(255,255,255,0.2)", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 16 }}>{tab.icon}</span>
                )}

                {/* Unread badge */}
                {showBadge && (
                  <div style={{ position: "absolute", top: -2, right: 4, minWidth: 16, height: 16, borderRadius: 999, background: "#5340C8", border: "2px solid #08080C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff", padding: "0 3px" }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>

              {/* Label */}
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? "#8B7CF6" : "rgba(255,255,255,0.35)", transition: "all 0.2s", fontFamily: "'Inter', sans-serif" }}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bottom-nav-spacer" />
    </>
  );
}