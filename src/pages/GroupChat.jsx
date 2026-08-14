import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";

const EMOJIS = ["❤️", "😂", "🔥", "👏", "💡", "🚀"];

export default function GroupChat() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch group info
  useEffect(() => {
    if (!groupId) return;
    const fetchGroup = async () => {
      try {
        const snap = await getDoc(doc(db, "groups", groupId));
        if (snap.exists()) setGroup({ id: snap.id, ...snap.data() });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchGroup();
  }, [groupId]);

  // Listen to messages
  useEffect(() => {
    if (!groupId) return;
    const q = query(collection(db, "groups", groupId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [groupId]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      await addDoc(collection(db, "groups", groupId, "messages"), {
        text,
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL || "",
        createdAt: serverTimestamp(),
        type: "text",
        reactions: {},
      });
      await updateDoc(doc(db, "groups", groupId), {
        lastMessage: `${user.displayName}: ${text}`,
        lastMessageTime: serverTimestamp(),
      });
    } catch (err) { console.error(err); }
    setSending(false);
    inputRef.current?.focus();
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const msgRef = doc(db, "groups", groupId, "messages", messageId);
      const msgSnap = await getDoc(msgRef);
      if (msgSnap.exists()) {
        const current = msgSnap.data().reactions || {};
        const users = current[emoji] || [];
        const updated = users.includes(user.uid)
          ? users.filter(u => u !== user.uid)
          : [...users, user.uid];
        await updateDoc(msgRef, { [`reactions.${emoji}`]: updated });
      }
    } catch (err) { console.error(err); }
    setShowEmojis(null);
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = msg.createdAt ? formatDate(msg.createdAt) : "Now";
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  // Get avatar color for member
  const getColor = (name) => {
    const colors = ["#5340C8", "#1D9E75", "#D4537E", "#EF9F27", "#185FA5", "#7B6EE0", "#E24B4A"];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  if (loading) return (
    <div style={{ height: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!group) return (
    <div style={{ height: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 40 }}>😕</div>
      <div style={{ fontSize: 16, color: "#fff" }}>Group not found!</div>
      <button onClick={() => navigate("/inbox")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>← Back to Inbox</button>
    </div>
  );

  const members = Object.entries(group.memberNames || {});

  return (
    <div style={{ height: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        .msg-bubble { animation: fadeIn 0.2s ease; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "0 16px", height: 64, display: "flex", alignItems: "center", gap: 12, background: "rgba(8,8,12,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)", flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>←</button>

        {/* Group icon */}
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, cursor: "pointer" }}
          onClick={() => setShowMembers(!showMembers)}>
          {group.emoji}
        </div>

        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setShowMembers(!showMembers)}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{group.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{members.length} members • Tap to see members</div>
        </div>

        {/* Create team button */}
        <button onClick={() => navigate("/create-team")} style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "7px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
          + New Team
        </button>
      </div>

      {/* Members panel */}
      {showMembers && (
        <div style={{ background: "rgba(10,10,20,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Team Members</div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
            {members.map(([uid, name]) => {
              const photo = group.memberPhotos?.[uid];
              const isCreator = uid === group.createdBy;
              return (
                <div key={uid} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  {photo ? (
                    <img src={photo} alt={name} style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${isCreator ? "#EF9F27" : "rgba(255,255,255,0.1)"}` }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${getColor(name)},${getColor(name)}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", border: `2px solid ${isCreator ? "#EF9F27" : "rgba(255,255,255,0.1)"}` }}>
                      {name?.charAt(0)}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", maxWidth: 56, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {uid === user?.uid ? "You" : name?.split(" ")[0]}
                  </div>
                  {isCreator && <div style={{ fontSize: 9, color: "#EF9F27" }}>Creator</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>

        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{group.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{group.name}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>This is the beginning of your team chat!<br />Start discussing your hackathon idea 🚀</div>
          </div>
        )}

        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 12px" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", padding: "3px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.06)" }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {msgs.map((msg, index) => {
              const isMe = msg.senderId === user?.uid;
              const isSystem = msg.type === "system";
              const showName = !isMe && !isSystem && (index === 0 || msgs[index - 1]?.senderId !== msg.senderId);
              const showAvatar = !isMe && !isSystem && (index === msgs.length - 1 || msgs[index + 1]?.senderId !== msg.senderId);
              const msgReactions = msg.reactions || {};
              const hasReactions = Object.values(msgReactions).some(users => users?.length > 0);
              const color = getColor(msg.senderName);

              // System message
              if (isSystem) return (
                <div key={msg.id} style={{ textAlign: "center", margin: "8px 0" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", padding: "4px 12px", borderRadius: 999 }}>{msg.text}</span>
                </div>
              );

              return (
                <div key={msg.id} className="msg-bubble" style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: hasReactions ? 22 : 4, justifyContent: isMe ? "flex-end" : "flex-start" }}>

                  {/* Avatar for others */}
                  {!isMe && (
                    <div style={{ width: 30, flexShrink: 0 }}>
                      {showAvatar && (
                        msg.senderPhoto ? (
                          <img src={msg.senderPhoto} alt="" style={{ width: 30, height: 30, borderRadius: "50%" }} />
                        ) : (
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                            {msg.senderName?.charAt(0)}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div style={{ position: "relative", maxWidth: "70%" }}>
                    {/* Sender name */}
                    {showName && (
                      <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 4, paddingLeft: 2 }}>{msg.senderName}</div>
                    )}

                    {/* Message bubble */}
                    <div
                      onDoubleClick={() => setShowEmojis(showEmojis === msg.id ? null : msg.id)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: isMe ? "linear-gradient(135deg, #5340C8, #7B6EE0)" : "rgba(255,255,255,0.08)",
                        border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</div>
                      <div style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", marginTop: 3, textAlign: isMe ? "right" : "left" }}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>

                    {/* Emoji picker */}
                    {showEmojis === msg.id && (
                      <div style={{ position: "absolute", [isMe ? "right" : "left"]: 0, bottom: "100%", marginBottom: 4, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "6px 10px", display: "flex", gap: 6, zIndex: 10, animation: "popIn 0.15s ease" }}>
                        {EMOJIS.map(emoji => (
                          <button key={emoji} onClick={() => addReaction(msg.id, emoji)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 2, transition: "transform 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          >{emoji}</button>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    {hasReactions && (
                      <div style={{ position: "absolute", bottom: -18, [isMe ? "right" : "left"]: 4, display: "flex", gap: 3 }}>
                        {Object.entries(msgReactions).filter(([_, u]) => u?.length > 0).map(([emoji, users]) => (
                          <div key={emoji} onClick={() => addReaction(msg.id, emoji)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "1px 6px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                            <span>{emoji}</span>
                            {users.length > 1 && <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>{users.length}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 24px", background: "rgba(8,8,12,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 8px 8px 16px" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={`Message ${group.name}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff", padding: 0 }}
          />
          <button onClick={sendMessage} disabled={!input.trim() || sending}
            style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: input.trim() ? "pointer" : "default", background: input.trim() ? "linear-gradient(135deg,#5340C8,#7B6EE0)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
            {sending ? (
              <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <span style={{ color: input.trim() ? "#fff" : "rgba(255,255,255,0.3)" }}>↑</span>
            )}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 5 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Double tap any message to react</span>
        </div>
      </div>
    </div>
  );
}