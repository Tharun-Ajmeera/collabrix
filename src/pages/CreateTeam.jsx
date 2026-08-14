import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

const TEAM_EMOJIS = ["🚀", "🏆", "⚡", "🔥", "💡", "🧠", "🎯", "🌐", "💻", "🛠", "🤖", "🎮", "🌟", "💎", "🦁"];

export default function CreateTeam() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🚀");
  const [collabs, setCollabs] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch accepted collabs to add as members
  useEffect(() => {
    if (!user) return;
    const fetchCollabs = async () => {
      try {
        const q = query(
          collection(db, "teamRequests"),
          where("toId", "==", user.uid),
          where("status", "==", "accepted")
        );
        const snap = await getDocs(q);
        setCollabs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchCollabs();
  }, [user]);

  const toggleMember = (collab) => {
    setSelectedMembers(prev =>
      prev.find(m => m.uid === collab.fromId)
        ? prev.filter(m => m.uid !== collab.fromId)
        : [...prev, { uid: collab.fromId, name: collab.fromName, photo: collab.fromPhoto }]
    );
  };

  const createTeam = async () => {
    if (!teamName.trim()) { setError("Please enter a team name!"); return; }
    if (selectedMembers.length === 0) { setError("Please add at least 1 member!"); return; }
    setCreating(true);
    setError("");
    try {
      const allMembers = [user.uid, ...selectedMembers.map(m => m.uid)];
      const memberNames = {
        [user.uid]: user.displayName,
        ...Object.fromEntries(selectedMembers.map(m => [m.uid, m.name]))
      };
      const memberPhotos = {
        [user.uid]: user.photoURL || "",
        ...Object.fromEntries(selectedMembers.map(m => [m.uid, m.photo || ""]))
      };

      const groupRef = await addDoc(collection(db, "groups"), {
        name: teamName.trim(),
        emoji: selectedEmoji,
        members: allMembers,
        memberNames,
        memberPhotos,
        createdBy: user.uid,
        createdByName: user.displayName,
        lastMessage: `${user.displayName} created the group`,
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      // Send first message
      await addDoc(collection(db, "groups", groupRef.id, "messages"), {
        text: `👋 ${user.displayName} created the team "${teamName.trim()}"! Let's build something amazing!`,
        senderId: "system",
        senderName: "System",
        createdAt: serverTimestamp(),
        type: "system",
      });

      navigate(`/group/${groupRef.id}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to create team. Please try again!");
    }
    setCreating(false);
  };

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Please log in first</div>
      <button onClick={() => navigate("/login")} style={{ padding: "10px 24px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer" }}>Log in</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; padding: 12px 16px; font-size: 14px; width: 100%; outline: none; font-family: inherit; transition: border 0.2s; }
        input:focus { border-color: rgba(139,124,246,0.6); }
        ::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 20px", height: 60, display: "flex", alignItems: "center", gap: 12, background: "rgba(8,8,12,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>←</button>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Create Team</div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 20px 80px", animation: "fadeIn 0.3s ease" }}>

        {/* Emoji picker */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Team Emoji</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TEAM_EMOJIS.map(emoji => (
              <button key={emoji} onClick={() => setSelectedEmoji(emoji)}
                style={{ width: 44, height: 44, borderRadius: 10, fontSize: 22, background: selectedEmoji === emoji ? "rgba(83,64,200,0.3)" : "rgba(255,255,255,0.05)", border: selectedEmoji === emoji ? "2px solid rgba(139,124,246,0.6)" : "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.2s" }}>
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Team Name */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Team Name *</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(83,64,200,0.2)", border: "1px solid rgba(139,124,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {selectedEmoji}
            </div>
            <input
              type="text"
              placeholder="e.g. ETHIndia Squad, SIH Team..."
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              maxLength={40}
            />
          </div>
          {teamName && (
            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right" }}>{teamName.length}/40</div>
          )}
        </div>

        {/* Add Members */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Add Members from your Collabs *</div>
            {selectedMembers.length > 0 && (
              <div style={{ fontSize: 11, color: "#8B7CF6" }}>{selectedMembers.length} selected</div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "24px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading your collabs...</div>
          ) : collabs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>No collabs yet!</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Accept collab requests first, then create a team!</div>
              <button onClick={() => navigate("/profile")} style={{ padding: "8px 20px", borderRadius: 999, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12 }}>
                Go to My Collabs →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {collabs.map(collab => {
                const isSelected = selectedMembers.find(m => m.uid === collab.fromId);
                return (
                  <div key={collab.id}
                    onClick={() => toggleMember(collab)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isSelected ? "rgba(83,64,200,0.15)" : "rgba(255,255,255,0.03)", border: isSelected ? "1px solid rgba(139,124,246,0.4)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}>
                    {collab.fromPhoto ? (
                      <img src={collab.fromPhoto} alt={collab.fromName} style={{ width: 44, height: 44, borderRadius: "50%", border: isSelected ? "2px solid #8B7CF6" : "2px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#5340C8,#8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {collab.fromName?.charAt(0)}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{collab.fromName}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>✅ Collab Accepted</div>
                    </div>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: isSelected ? "linear-gradient(135deg,#5340C8,#7B6EE0)" : "rgba(255,255,255,0.06)", border: isSelected ? "none" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>
                      {isSelected ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* You are already in team */}
        <div style={{ padding: "12px 16px", background: "rgba(29,158,117,0.08)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1D9E75,#5DCAA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {user?.displayName?.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{user?.displayName} (You)</div>
            <div style={{ fontSize: 11, color: "#5DCAA5" }}>Team Creator — always included</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)", color: "#F09595", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Preview */}
        {teamName && selectedMembers.length > 0 && (
          <div style={{ padding: "14px 16px", background: "rgba(83,64,200,0.1)", border: "1px solid rgba(139,124,246,0.2)", borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#8B7CF6", marginBottom: 8 }}>Team Preview</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#5340C8,#7B6EE0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{selectedEmoji}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{teamName}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{selectedMembers.length + 1} members</div>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={createTeam}
          disabled={creating || !teamName.trim() || selectedMembers.length === 0}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600,
            background: (!teamName.trim() || selectedMembers.length === 0) ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#5340C8,#7B6EE0)",
            color: (!teamName.trim() || selectedMembers.length === 0) ? "rgba(255,255,255,0.3)" : "#fff",
            border: "none", cursor: (!teamName.trim() || selectedMembers.length === 0) ? "not-allowed" : "pointer",
            boxShadow: (!teamName.trim() || selectedMembers.length === 0) ? "none" : "0 0 20px rgba(83,64,200,0.4)",
            transition: "all 0.2s",
          }}>
          {creating ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Creating Team...
            </span>
          ) : `${selectedEmoji} Create Team Chat`}
        </button>
      </div>
    </div>
  );
}