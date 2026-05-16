// src/hooks/useAuth.js
// ─────────────────────────────────────────────────────────────────────────────
// FIX: Added `authLoading` state.
//
// The redirect loop happened because:
//   1. User logs in → navigate("/profile")
//   2. Profile page mounts → useAuth runs → auth.currentUser is null for ~200ms
//      (Firebase hasn't restored the session yet)
//   3. Protected route sees null user → redirects back to /login ← LOOP
//
// Fix: `authLoading` starts true and only flips false after the FIRST
// onAuthStateChanged fires. Protected routes must wait for authLoading=false
// before deciding to redirect.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export function useAuth() {
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // ← KEY FIX

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false); // Firebase has resolved; safe to act on auth state
    });
    return () => unsubscribe();
  }, []);

  return { user, authLoading };
}
