import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../useAuth";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, query, orderBy,
  serverTimestamp, doc, getDoc, setDoc, updateDoc
} from "firebase/firestore";

const EMOJIS = ["❤️", "😂", "🔥", "👏", "😮", "😢"];

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(null);
  const [reactions, setReactions] = useState({});
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Chat ID is always sorted so both users get same chat
  const chatId = [user?.uid, userId].sort().join("_");

  // Fetch other user profile
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) setOtherUser({ id: snap.id, ...snap.data() });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  // Listen to messages in real time
  useEffect(() => {
    if (!user || !chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      // Mark as read
      updateDoc(doc(db, "chats", chatId), { [`unread_${user.uid}`]: 0 }).catch(() => {});
    });
    return () => unsub();
  }, [chatId, user]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      // Create chat doc if doesn't exist
      await setDoc(doc(db, "chats", chatId), {
        participants: [user.uid, userId],
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        [`unread_${userId}`]: (messages.filter(m => m.senderId !== user.uid).length) + 1,
        [`unread_${user.uid}`]: 0,
        userNames: {
          [user.uid]: user.displayName,
          [userId]: otherUser?.name || "",
        },
        userPhotos: {
          [user.uid]: user.photoURL || "",
          [userId]: otherUser?.photoURL || "",
        },
      }, { merge: true });

      // Add message
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        senderId: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL || "",
        createdAt: serverTimestamp(),
        reactions: {},
      });
    } catch (err) { console.error("Error sending:", err); }
    setSending(false);
    inputRef.current?.focus();
  };

  const addReaction = async (messageId, emoji) => {
    try {
      const msgRef = doc(db, "chats", chatId, "messages", messageId);
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

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Please log in to chat</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg, #5340C8, #7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>Log in</button>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: "2px solid #5340C8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ height: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        .msg-bubble { animation: fadeIn 0.2s ease; }
        .emoji-btn:hover { transform: scale(1.3); }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "0 16px", height: 64, display: "flex", alignItems: "center", gap: 12, background: "rgba(8,8,12,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)", flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20, padding: "4px 8px 4px 0", display: "flex", alignItems: "center" }}>←</button>

        {otherUser?.photoURL ? (
          <img src={otherUser.photoURL} alt={otherUser.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(139,124,246,0.4)", cursor: "pointer" }} onClick={() => navigate(`/user/${userId}`)} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #5340C8, #8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "#fff", flexShrink: 0, cursor: "pointer" }} onClick={() => navigate(`/user/${userId}`)}>
            {otherUser?.name?.charAt(0) || "?"}
          </div>
        )}

        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => navigate(`/user/${userId}`)}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{otherUser?.name || "Student"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            {otherUser?.college ? `${otherUser.college}` : "Collabrix India"}
            {otherUser?.domain ? ` • ${otherUser.domain}` : ""}
          </div>
        </div>

        <button onClick={() => navigate("/teammates")} style={{ background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", color: "#A899F0", padding: "7px 14px", borderRadius: 999, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
          👥 Team Up
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>

        {/* Empty State */}
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: "40px 24px", textAlign: "center" }}>
            {otherUser?.photoURL ? (
              <img src={otherUser.photoURL} alt="" style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgba(139,124,246,0.4)" }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #5340C8, #8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: "#fff" }}>
                {otherUser?.name?.charAt(0) || "?"}
              </div>
            )}
            <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{otherUser?.name || "Student"}</div>
            {otherUser?.college && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{otherUser.college}</div>}
            {otherUser?.skills?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
                {otherUser.skills.slice(0, 4).map(s => (
                  <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(139,124,246,0.1)", border: "1px solid rgba(139,124,246,0.2)", color: "#A899F0" }}>{s}</span>
                ))}
              </div>
            )}
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
              Start a conversation! 👋<br />
              <span style={{ fontSize: 11 }}>Say hi or discuss a hackathon idea</span>
            </div>
          </div>
        )}

        {/* Message Groups */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 12px" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", padding: "3px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.06)" }}>{date}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {msgs.map((msg, index) => {
              const isMe = msg.senderId === user.uid;
              const showAvatar = !isMe && (index === 0 || msgs[index - 1]?.senderId !== msg.senderId);
              const msgReactions = msg.reactions || {};
              const hasReactions = Object.values(msgReactions).some(users => users?.length > 0);

              return (
                <div key={msg.id} className="msg-bubble" style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: hasReactions ? 20 : 4, justifyContent: isMe ? "flex-end" : "flex-start" }}>

                  {/* Avatar for other user */}
                  {!isMe && (
                    <div style={{ width: 28, flexShrink: 0 }}>
                      {showAvatar && (
                        otherUser?.photoURL ? (
                          <img src={otherUser.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                        ) : (
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #5340C8, #7B6EE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff" }}>
                            {otherUser?.name?.charAt(0)}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div style={{ position: "relative", maxWidth: "70%" }}>
                    {/* Message bubble */}
                    <div
                      onDoubleClick={() => setShowEmojis(showEmojis === msg.id ? null : msg.id)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: isMe ? "linear-gradient(135deg, #5340C8, #7B6EE0)" : "rgba(255,255,255,0.08)",
                        border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</div>
                      <div style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>

                    {/* Emoji picker */}
                    {showEmojis === msg.id && (
                      <div style={{ position: "absolute", [isMe ? "right" : "left"]: 0, bottom: "100%", marginBottom: 4, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "6px 10px", display: "flex", gap: 6, zIndex: 10, animation: "popIn 0.15s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                        {EMOJIS.map(emoji => (
                          <button key={emoji} className="emoji-btn" onClick={() => addReaction(msg.id, emoji)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 2, transition: "transform 0.15s", display: "block" }}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    {hasReactions && (
                      <div style={{ position: "absolute", bottom: -18, [isMe ? "right" : "left"]: 4, display: "flex", gap: 3 }}>
                        {Object.entries(msgReactions).filter(([_, users]) => users?.length > 0).map(([emoji, users]) => (
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

      {/* Input Area */}
      <div style={{ padding: "10px 16px 24px", background: "rgba(8,8,12,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 8px 8px 16px" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff", padding: 0, borderRadius: 0 }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "none", cursor: input.trim() ? "pointer" : "default",
              background: input.trim() ? "linear-gradient(135deg, #5340C8, #7B6EE0)" : "rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s", flexShrink: 0,
            }}
          >
            {sending ? (
              <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <span style={{ color: input.trim() ? "#fff" : "rgba(255,255,255,0.3)" }}>↑</span>
            )}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Double tap a message to react with emoji</span>
        </div>
      </div>
    </div>
  );
}