import { useState, useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "../firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    // ✅ KEY FIX: wait for redirect to fully resolve first,
    // THEN start listening — prevents the null flash race condition
    getRedirectResult(auth)
      .catch(() => {})
      .finally(() => {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setAuthLoading(false);
        });
      });

    return () => unsubscribe();
  }, []);

  return { user, authLoading };
}