import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase"; // ← add this

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  // Still loading — wait, don't redirect yet
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

  // Check both hook state AND Firebase's sync currentUser
  if (!user && !auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}