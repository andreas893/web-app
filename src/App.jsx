import { Routes, Route, Navigate } from "react-router";
import LandingPage from "./pages/landingpage";

import Login from "./components/Login";
import Opret from "./components/Opret";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <main className="min-h-screen">
      <Routes>
        {/* Landingpage vises efter login */}
        <Route path="/" element={<LandingPage />} />

        {/* Hvis man går et forkert sted hen, send brugeren hjem */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Opret />} />

        <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
      </Routes>
    </main>

  );
};

