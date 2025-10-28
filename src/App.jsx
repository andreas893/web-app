// src/App.jsx
import { Routes, Route } from "react-router-dom";

// ⭐ Core / feed / landing
import LandingPage from "./pages/LandingPage";

// ⭐ Auth / onboarding
import OnboardingPage from "./pages/OnboardingPage";
import Opret from "./components/Opret";       // signup
import Login from "./components/Login";

// ⭐ Content creation / sharing
import ShareSong from "./components/ShareSong";
import SharePlaylist from "./pages/SharePlaylist";
import MoodPage from "./pages/MoodPage";

// ⭐ Wrapped / insights
import WrappedWeek from "./pages/WrappedWeek";
import WrappedMonth from "./pages/WrappedMonth";
import StatisticsPage from "./pages/StatisticsPage";

// ⭐ Library / profile
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import PinnedPage from "./pages/PinnedPage";
import PlaylistView from "./pages/PlaylistView";
import BadgePage from "./pages/BadgePage"

// ⭐ Social (nyttt)
import MessagesPage from "./pages/MessagesPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";

// ⭐ Protected example
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white font-inter">
      <Routes>

        {/* ─────────────────────────────
           Onboarding / Auth
        ───────────────────────────── */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/signup" element={<Opret />} />
        <Route path="/login" element={<Login />} />

        {/* ─────────────────────────────
           Hovedapp / Feed
        ───────────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ─────────────────────────────
           Deling / Opret indhold
        ───────────────────────────── */}
        <Route path="/share-song" element={<ShareSong />} />
        <Route path="/share-playlist" element={<SharePlaylist />} />
        <Route path="/choose-mood" element={<MoodPage />} />

        {/* ─────────────────────────────
           Bibliotek / Profil / Playlist
        ───────────────────────────── */}
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/pinned" element={<PinnedPage />} />
        <Route path="/playlist/:id" element={<PlaylistView />} />
        <Route path="/badges" element={<BadgePage />} />

        {/* ─────────────────────────────
           Wrapped / Statistik
        ───────────────────────────── */}
        <Route path="/wrapped-week" element={<WrappedWeek />} />
        <Route path="/wrapped-month" element={<WrappedMonth />} />
        <Route path="/stats" element={<StatisticsPage />} />

        {/* ─────────────────────────────
           Social / Beskeder / Notifikationer
        ───────────────────────────── */}
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:chatId" element={<ChatPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* ─────────────────────────────
           Beskyttet route eksempel
        ───────────────────────────── */}
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <h1 className="p-4 text-white">Kun for loggede brugere</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}
