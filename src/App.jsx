import { Routes, Route, Navigate } from "react-router";
import LandingPage from "./pages/LandinPage";

export default function App() {
  return (
    <main className="min-h-screen">
      <Routes>
        {/* Landingpage vises efter login */}
        <Route path="/" element={<LandingPage />} />

        {/* Hvis man går et forkert sted hen, send brugeren hjem */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}
