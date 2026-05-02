import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import BottomNav from "../components/BottomNav";

export default function Inbox() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageTime", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(data);
      setLoadingChats(false);
    });
    return () => unsub();
  }, [user]);

  const getOtherUserId = (chat) => chat.participants?.find(p => p !== user?.uid);

  const getOtherUserName = (chat) => {
    const otherId = getOtherUserId(chat);
    return chat.userNames?.[otherId] || "Student";
  };

  const getOtherUserPhoto = (chat) => {
    const otherId = getOtherUserId(chat);
    return chat.userPhotos?.[otherId] || null;
  };

  const getUnreadCount = (chat) => chat[`unread_${user?.uid}`] || 0;

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const filtered = chats.filter(chat =>
    getOtherUserName(chat).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 40 }}>💬</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Log in to see your messages</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>Log in</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .chat-row { display: flex; align-items: center; gap: 14px; padding: 12px 20px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .chat-row:hover { background: rgba(255,255,255,0.03); }
        .chat-row:active { background: rgba(83,64,200,0.1); }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,8,12,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF2FF", border: "0.5px solid #D0C8F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 500, color: "#fff" }}>Messages</span>
        </div>
        <button onClick={() => navigate("/teammates")} style={{ background: "linear-gradient(135deg, #5340C8, #7B6EE0)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer" }}>
          + New Chat
        </button>
      </nav>

      <div style={{ paddingTop: 60, paddingBottom: 80 }}>

        {/* Search */}
        <div style={{ padding: "16px 20px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff", padding: 0, borderRadius: 0 }} />
          </div>
        </div>

        {/* Loading */}
        {loadingChats && (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", animation: "pulse 1.5s infinite" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 13, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8, width: "50%" }} />
                  <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingChats && chats.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No messages yet!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 280, marginBottom: 24, lineHeight: 1.6 }}>
              Find teammates and start a conversation to build your dream team!
            </div>
            <button onClick={() => navigate("/teammates")} style={{ padding: "12px 28px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              Find Teammates →
            </button>
          </div>
        )}

        {/* Chat list */}
        {!loadingChats && filtered.length > 0 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {filtered.map(chat => {
              const otherId = getOtherUserId(chat);
              const name = getOtherUserName(chat);
              const photo = getOtherUserPhoto(chat);
              const unread = getUnreadCount(chat);
              return (
                <div key={chat.id} className="chat-row" onClick={() => navigate(`/chat/${otherId}`)}>

                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {photo ? (
                      <img src={photo} alt={name} style={{ width: 52, height: 52, borderRadius: "50%", border: unread > 0 ? "2px solid #8B7CF6" : "2px solid rgba(255,255,255,0.08)", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #5340C8, #8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, color: "#fff", border: unread > 0 ? "2px solid #8B7CF6" : "2px solid transparent" }}>
                        {name.charAt(0)}
                      </div>
                    )}
                    {unread > 0 && (
                      <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#5340C8", border: "2px solid #08080C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>
                        {unread > 9 ? "9+" : unread}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: unread > 0 ? 600 : 500, color: "#fff" }}>{name}</span>
                      <span style={{ fontSize: 11, color: unread > 0 ? "#8B7CF6" : "rgba(255,255,255,0.3)", flexShrink: 0, marginLeft: 8 }}>
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: unread > 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: unread > 0 ? 500 : 400 }}>
                      {chat.lastMessage || "Start a conversation!"}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 16, flexShrink: 0 }}>›</div>
                </div>
              );
            })}
          </div>
        )}

        {/* No search results */}
        {!loadingChats && chats.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
            No conversations found for "{search}"
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}