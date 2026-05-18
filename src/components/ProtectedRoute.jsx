import { Navigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#08080C", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(83,64,200,0.3)", borderTopColor: "#5340C8", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user && !auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}