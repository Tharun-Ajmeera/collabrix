import { useState, useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    getRedirectResult(auth)
      .catch(() => {})
      .finally(() => {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}