import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ShareSong from "./components/ShareSong";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingPage from "./pages/OnboardingPage"
import LibraryPage from "./pages/LibraryPage";
import Opret from "./components/Opret";

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Routes>
         <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/signup" element={<Opret />} />


        {/* Startside */}
        <Route path="/" element={<LandingPage />} />

        {/* Dele en sang */}
        <Route path="/share" element={<ShareSong />} />

        {/* Login (til senere) */}
        <Route path="/login" element={<Login />} />
        
        {/* Library side */}
        <Route path="/library" element={<LibraryPage />} />

        {/* Beskyttet side */}
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <h1>Kun for loggede brugere</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}
