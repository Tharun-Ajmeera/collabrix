import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const STEPS = [
  { id: 1, title: "Welcome! 👋", subtitle: "Let's set up your profile in 60 seconds" },
  { id: 2, title: "Your College 🎓", subtitle: "Help other students find you" },
  { id: 3, title: "Your Skills 💡", subtitle: "What are you good at?" },
  { id: 4, title: "Your City 📍", subtitle: "Find teammates near you" },
];

const SUGGESTED_SKILLS = ["React", "Python", "Node.js", "Flutter", "Figma", "UI/UX", "Machine Learning", "DSA", "Web3", "Solidity", "TypeScript", "Docker", "AWS", "MongoDB", "Java", "C++", "Data Science", "Cybersecurity", "Next.js", "Angular", "Swift", "Kotlin", "Unity", "AR/VR", "Robotics", "IoT", "Go", "DevOps", "MySQL", "Firebase"];
const SUGGESTED_DOMAINS = ["AI / ML", "Full Stack", "Web3 / Blockchain", "UI / UX", "Mobile Dev", "Cybersecurity", "Data Science", "Open Innovation", "FinTech", "EdTech", "HealthTech", "Game Dev", "AR / VR", "Robotics", "Cloud Computing", "DevOps"];
const SUGGESTED_CITIES = ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Coimbatore", "Vellore", "Mysuru", "Nagpur", "Kochi", "Visakhapatnam", "Indore", "Chandigarh", "Mangalore", "Manipal", "Warangal", "Tirupati", "Online"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Alumni"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    college: "",
    year: "",
    skills: [],
    domain: "",
    city: "",
  });
  const [skillInput, setSkillInput] = useState("");

  const progress = (step / STEPS.length) * 100;

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed) && form.skills.length < 10) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));

  const nextStep = () => {
    if (step < STEPS.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "",
        bio: form.bio,
        college: form.college,
        year: form.year,
        skills: form.skills,
        domain: form.domain,
        city: form.city,
        hackathonsWon: 0,
        onboarded: true,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      navigate("/teammates", { replace: true });
    } catch (err) {
      console.error("Error saving profile:", err);
    }
    setSaving(false);
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return form.college.trim().length > 0;
    if (step === 3) return form.skills.length > 0 && form.domain;
    if (step === 4) return form.city.length > 0;
    return true;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#08080C", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        input, textarea, select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; padding: 12px 16px; font-size: 14px; width: 100%; outline: none; font-family: inherit; transition: border 0.2s; }
        input:focus, textarea:focus, select:focus { border-color: rgba(139,124,246,0.6); }
        select option { background: #1a1a2e; }
        ::placeholder { color: rgba(255,255,255,0.25); }
        .skill-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; background: rgba(139,124,246,0.15); border: 1px solid rgba(139,124,246,0.4); color: #A899F0; margin: 3px; cursor: pointer; transition: all 0.2s; }
        .skill-chip:hover { background: rgba(139,124,246,0.25); }
        .suggest-chip { display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); margin: 3px; cursor: pointer; transition: all 0.2s; }
        .suggest-chip:hover { background: rgba(139,124,246,0.15); border-color: rgba(139,124,246,0.4); color: #A899F0; }
        .domain-chip { display: inline-block; padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); margin: 4px; cursor: pointer; transition: all 0.2s; }
        .domain-chip.selected { background: rgba(83,64,200,0.2); border-color: rgba(139,124,246,0.5); color: #A899F0; }
        .city-chip { display: inline-block; padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 500; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); margin: 4px; cursor: pointer; transition: all 0.2s; }
        .city-chip.selected { background: rgba(239,159,39,0.15); border-color: rgba(239,159,39,0.4); color: #EF9F27; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 46 46" fill="none">
              <circle cx="11" cy="23" r="6.5" fill="#5340C8" />
              <circle cx="35" cy="11" r="6.5" fill="#5340C8" opacity="0.55" />
              <circle cx="35" cy="35" r="6.5" fill="#5340C8" opacity="0.55" />
              <line x1="17.2" y1="20.5" x2="28.8" y2="13.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="17.2" y1="25.5" x2="28.8" y2="32.5" stroke="#5340C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>Collab<span style={{ color: "#8B7CF6" }}>rix</span> India</span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Step {step} of {STEPS.length}</span>
            <span style={{ fontSize: 12, color: "#8B7CF6" }}>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #5340C8, #8B7CF6)", borderRadius: 999, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {STEPS.map(s => (
            <div key={s.id} style={{ width: s.id === step ? 24 : 8, height: 8, borderRadius: 999, background: s.id <= step ? "#5340C8" : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Card */}
        <div key={step} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 28px 24px", animation: "fadeIn 0.3s ease" }}>

          {/* Step header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4 }}>
              {STEPS[step - 1].title}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{STEPS[step - 1].subtitle}</p>
          </div>

          {/* ─── STEP 1: Welcome + Bio ─── */}
          {step === 1 && (
            <div>
              {/* User photo + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px", background: "rgba(83,64,200,0.1)", border: "1px solid rgba(139,124,246,0.2)", borderRadius: 14 }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(139,124,246,0.4)" }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#5340C8,#8B7CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>
                    {user?.displayName?.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{user?.displayName}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>Short Bio (optional)</label>
                <textarea
                  placeholder="e.g. Full stack dev passionate about AI and hackathons! 🚀"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  maxLength={150}
                  style={{ resize: "none" }}
                />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4, textAlign: "right" }}>{form.bio.length}/150</div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: College + Year ─── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>College / University *</label>
                <input
                  type="text"
                  placeholder="e.g. IIT Bombay, JNTU Hyderabad..."
                  value={form.college}
                  onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>Year of Study</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {YEARS.map(y => (
                    <button key={y} onClick={() => setForm(f => ({ ...f, year: y }))}
                      style={{ padding: "8px 16px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.2s", background: form.year === y ? "linear-gradient(135deg,#5340C8,#7B6EE0)" : "rgba(255,255,255,0.06)", color: form.year === y ? "#fff" : "rgba(255,255,255,0.5)" }}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Skills + Domain ─── */}
          {step === 3 && (
            <div>
              {/* Skills input */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>
                  Your Skills * <span style={{ color: "rgba(255,255,255,0.2)" }}>({form.skills.length}/10)</span>
                </label>

                {/* Selected skills */}
                {form.skills.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    {form.skills.map(s => (
                      <span key={s} className="skill-chip" onClick={() => removeSkill(s)}>
                        {s} <span style={{ opacity: 0.6 }}>×</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skill input */}
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && skillInput.trim()) { e.preventDefault(); addSkill(skillInput); } }}
                    style={{ borderRadius: 12 }}
                  />
                  <button onClick={() => addSkill(skillInput)} disabled={!skillInput.trim()}
                    style={{ padding: "0 16px", borderRadius: 12, background: skillInput.trim() ? "linear-gradient(135deg,#5340C8,#7B6EE0)" : "rgba(255,255,255,0.06)", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0, fontSize: 16 }}>
                    +
                  </button>
                </div>

                {/* Suggestions */}
                <div style={{ maxHeight: 100, overflowY: "auto" }}>
                  {SUGGESTED_SKILLS.filter(s => !form.skills.includes(s)).map(s => (
                    <span key={s} className="suggest-chip" onClick={() => addSkill(s)}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Domain */}
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>Primary Domain *</label>
                <div style={{ maxHeight: 120, overflowY: "auto" }}>
                  {SUGGESTED_DOMAINS.map(d => (
                    <span key={d} className={`domain-chip ${form.domain === d ? "selected" : ""}`} onClick={() => setForm(f => ({ ...f, domain: d }))}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: City ─── */}
          {step === 4 && (
            <div>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 12 }}>Select your city *</label>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {SUGGESTED_CITIES.map(c => (
                  <span key={c} className={`city-chip ${form.city === c ? "selected" : ""}`} onClick={() => setForm(f => ({ ...f, city: c }))}>
                    {c === "Online" ? "🌐" : "📍"} {c}
                  </span>
                ))}
              </div>

              {/* Custom city input */}
              <div style={{ marginTop: 12 }}>
                <input
                  type="text"
                  placeholder="Or type your city..."
                  value={!SUGGESTED_CITIES.includes(form.city) ? form.city : ""}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                />
              </div>

              {/* Final summary */}
              {form.city && (
                <div style={{ marginTop: 16, padding: "14px", background: "rgba(83,64,200,0.1)", border: "1px solid rgba(139,124,246,0.2)", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#A899F0", marginBottom: 8 }}>✨ Your Profile Summary</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                    🎓 {form.college || "Not added"} {form.year && `• ${form.year}`}<br />
                    💡 {form.domain || "Not added"}<br />
                    📍 {form.city}<br />
                    🛠 {form.skills.slice(0, 3).join(", ")}{form.skills.length > 3 ? ` +${form.skills.length - 3} more` : ""}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {step > 1 && (
            <button onClick={prevStep} style={{ flex: 1, padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 500, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
              ← Back
            </button>
          )}

          {step < STEPS.length ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              style={{ flex: 2, padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 600, background: canProceed() ? "linear-gradient(135deg, #5340C8, #7B6EE0)" : "rgba(255,255,255,0.06)", color: canProceed() ? "#fff" : "rgba(255,255,255,0.3)", border: "none", cursor: canProceed() ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: canProceed() ? "0 0 20px rgba(83,64,200,0.3)" : "none" }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={!canProceed() || saving}
              style={{ flex: 2, padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 600, background: canProceed() ? "linear-gradient(135deg, #1D9E75, #0F6E56)" : "rgba(255,255,255,0.06)", color: "#fff", border: "none", cursor: canProceed() ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: canProceed() ? "0 0 20px rgba(29,158,117,0.3)" : "none" }}
            >
              {saving ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Setting up...
                </span>
              ) : "🚀 Let's Go!"}
            </button>
          )}
        </div>

        {/* Skip option */}
        {step === 1 && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span onClick={() => navigate("/profile", { replace: true })} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#8B7CF6"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
            >
              Skip for now →
            </span>
          </div>
        )}

      </div>
    </div>
  );
}