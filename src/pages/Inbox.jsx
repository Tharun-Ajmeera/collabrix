import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function Inbox() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dms, setDms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid), orderBy("lastMessageTime", "desc"));
    const unsub = onSnapshot(q, snap => { setDms(snap.docs.map(d => ({ id: d.id, type: "dm", ...d.data() }))); setLoadingChats(false); });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "groups"), where("members", "array-contains", user.uid), orderBy("lastMessageTime", "desc"));
    const unsub = onSnapshot(q, snap => { setGroups(snap.docs.map(d => ({ id: d.id, type: "group", ...d.data() }))); });
    return () => unsub();
  }, [user]);

  const getOtherUserId = (chat) => chat.participants?.find(p => p !== user?.uid);
  const getOtherUserName = (chat) => { const id = getOtherUserId(chat); return chat.userNames?.[id] || "Student"; };
  const getOtherUserPhoto = (chat) => { const id = getOtherUserId(chat); return chat.userPhotos?.[id] || null; };
  const getUnread = (chat) => chat[`unread_${user?.uid}`] || 0;

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

  const allChats = [...dms, ...groups].sort((a, b) => {
    const tA = a.lastMessageTime?.toDate?.() || new Date(0);
    const tB = b.lastMessageTime?.toDate?.() || new Date(0);
    return tB - tA;
  });

  const filtered = allChats
    .filter(c => (c.type === "dm" ? getOtherUserName(c) : c.name)?.toLowerCase().includes(search.toLowerCase()))
    .filter(c => activeTab === "all" || (activeTab === "dms" && c.type === "dm") || (activeTab === "groups" && c.type === "group"));

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 40 }}>💬</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Log in to see messages</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>Log in</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .chat-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .chat-row:hover { background: rgba(255,255,255,0.04); }
        .chat-row:active { background: rgba(83,64,200,0.1); }
        .tab-btn { background: none; border: 1px solid transparent; cursor: pointer; padding: 7px 16px; font-size: 13px; font-weight: 500; border-radius: 999px; transition: all 0.2s; color: rgba(255,255,255,0.4); font-family: inherit; white-space: nowrap; }
        .tab-btn.active { background: rgba(83,64,200,0.2); color: #A899F0; border-color: rgba(139,124,246,0.3); }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      <Navbar />

      {/* Two column layout on desktop */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingTop: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>Messages</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              {allChats.length} conversation{allChats.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => navigate("/create-team")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
            👥 Create Team
          </button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "11px 16px", marginBottom: 14 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff", padding: 0 }} />
          {search && <span onClick={() => setSearch("")} style={{ color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</span>}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            { key: "all", label: `All (${allChats.length})` },
            { key: "dms", label: `💬 DMs (${dms.length})` },
            { key: "groups", label: `👥 Teams (${groups.length})` },
          ].map(tab => (
            <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat list container */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>

          {/* Loading */}
          {loadingChats && (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, animation: "pulse 1.5s infinite" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 13, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8, width: "40%" }} />
                    <div style={{ height: 11, background: "rgba(255,255,255,0.04)", borderRadius: 4, width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loadingChats && allChats.length === 0 && (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No messages yet!</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px" }}>
                Find teammates and start chatting or create a team!
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/teammates")}
                  style={{ padding: "10px 20px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>
                  Find Teammates →
                </button>
                <button onClick={() => navigate("/create-team")}
                  style={{ padding: "10px 20px", borderRadius: 999, background: "rgba(83,64,200,0.15)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                  + Create Team
                </button>
              </div>
            </div>
          )}

          {/* No search results */}
          {!loadingChats && allChats.length > 0 && filtered.length === 0 && (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
              No conversations found for "{search}"
            </div>
          )}

          {/* Chat rows */}
          {!loadingChats && filtered.map(chat => {
            const isDM = chat.type === "dm";
            const name = isDM ? getOtherUserName(chat) : chat.name;
            const photo = isDM ? getOtherUserPhoto(chat) : null;
            const unread = isDM ? getUnread(chat) : 0;
            const otherId = isDM ? getOtherUserId(chat) : null;

            return (
              <div key={chat.id} className="chat-row"
                onClick={() => isDM ? navigate(`/chat/${otherId}`) : navigate(`/group/${chat.id}`)}>

                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {isDM ? (
                    photo ? (
                      <img src={photo} alt={name} referrerPolicy="no-referrer" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: unread > 0 ? "2px solid #8B7CF6" : "2px solid rgba(255,255,255,0.06)" }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#5340C8,#8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>
                        {name?.charAt(0)}
                      </div>
                    )
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                      {chat.emoji}
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: unread > 0 ? 600 : 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                    {!isDM && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 999, background: "rgba(83,64,200,0.2)", color: "#A899F0", border: "1px solid rgba(139,124,246,0.25)", flexShrink: 0 }}>
                        Team · {chat.members?.length}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: unread > 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: unread > 0 ? 500 : 400 }}>
                    {chat.lastMessage || "Start a conversation!"}
                  </div>
                </div>

                {/* Time + arrow */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: unread > 0 ? "#8B7CF6" : "rgba(255,255,255,0.25)" }}>{formatTime(chat.lastMessageTime)}</span>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.12)" }}>›</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tip */}
        {!loadingChats && allChats.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            💡 Create a team chat to coordinate with your hackathon squad
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}