import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // CRITICAL: Show spinner while Firebase is restoring session
  // Never redirect while loading is true
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#08080C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(83,64,200,0.3)",
          borderTopColor: "#5340C8",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          Loading...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Only redirect after loading is fully done
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}