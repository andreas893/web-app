import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import LandingPage from "./pages/landingPage";
import Login from "./components/Login";
import Opret from "./components/Opret";
import ProtectedRoute from "./components/ProtectedRoute";




export default function App() {
  return (
    <main className="min-h-screen">
      <Routes>
        {/* Login & Signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Opret />} />

        {/* Landingpage (kun én route!) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect ukendte sider */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}
