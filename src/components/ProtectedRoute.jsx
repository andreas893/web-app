import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Indlæser...</p>;
  }

  // hvis ingen bruger → redirect til login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ellers vis indhold
  return children;
}
