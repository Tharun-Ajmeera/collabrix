// src/components/ProtectedRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Use this wrapper around any route that requires login.
//
// Usage in your router (App.jsx):
//
//   import ProtectedRoute from "./components/ProtectedRoute";
//
//   <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//   <Route path="/teammates" element={<ProtectedRoute><Teammates /></ProtectedRoute>} />
//
// If the user is not logged in, they get sent to /login.
// While Firebase is still resolving the session, a spinner is shown instead
// of immediately redirecting — this is what fixed the login loop.
// ─────────────────────────────────────────────────────────────────────────────

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  // Firebase is still checking — don't redirect yet
  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#08080C",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 32, height: 32,
          border: "3px solid rgba(83,64,200,0.3)",
          borderTopColor: "#5340C8",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Auth resolved: redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
