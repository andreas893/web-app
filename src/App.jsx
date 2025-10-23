import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ShareSong from "./components/ShareSong";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingPage from "./pages/OnboardingPage";
import LibraryPage from "./pages/LibraryPage";
import Opret from "./components/Opret";
import PlaylistView from "./pages/PlaylistView";
import MoodPage from "./pages/MoodPage";

import WrappedWeek from "./pages/WrappedWeek";
import WrappedMonth from "./pages/WrappedMonth";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Routes>
        {/* Onboarding og Signup */}
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

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/playlist/:id" element={<PlaylistView />} />
        <Route path="/choose-mood" element={<MoodPage />} />
        {/* Wrapped sider */}
        <Route path="/wrapped-week" element={<WrappedWeek />} />
        <Route path="/wrapped-month" element={<WrappedMonth />} />

        {/* Beskyttet testside */}
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
